# Windows RDS with Guacamole and Azure SAML

For the school district I work for, I was tasked with coming up with a proof of concept for using Windows Remote Desktop Services as a means to cut down on computer labs and allowing students to access Windows based software from their chromebooks.

From the start, I wanted to keep it entirely on prem vs using Azure cloud or any such service. I decided on using Apache's Guacamole as a web based RDP gateway, because it operates incredibly smoothly on chromebooks will keeping resource needs low on the back end. 

Though there is plenty of documentation provided by Microsoft on RDS, and plenty of documentation for Guacamole, it took quite a lot of tinkering to actually merge the concepts to work for a large user base, and I wanted to provide some insight and documentation so others can learn from and expand upon this concept.

## Windows Server Host

Before setting up Guacamole that we use as a gateway to access Windows, we need to set up the host server that users will connect to. For our initial setup, all we need is a Virtual Machine running windows server 2022 and we've given it 20gb of ram and 8vCPUs. This can and will be expanded as needed. On the Windows server, you will need to install the Windows RDS connection broker and session host role, and create a new session. If you plan to scale to more than 1 host, it's recommended to also have the connection broker on its own server vm. More documentation on this can be found [here](https://learn.microsoft.com/en-us/windows-server/remote/remote-desktop-services/rds-roles). Right now, this host can hold 30-60 concurrent users, to expand beyond that user base, we can simply replicate the VM and load balance it in Guacamole.

## Installing Guacamole Docker Image

Our installation was installed using a specific image that includes a postgresql database. We have set up a dedicated Ubuntu Server 22.04 vm host for this service. First and foremost, make sure you have Docker installed on your system, once you do, install the Guacamole container:
```bash
sudo docker run -d \
  -p 8080:8080 \
  -v <path/to/config/>:/config \
  -e "EXTENSIONS=auth-saml" \
  maxwaldorf/guacamole
```
Since we bound the config file of the container to a local folder on the VM, we can access the generated properties file to make changes to Guacamole's configuration. 

## Reverse Proxy Setup
We will need to make a publicly accessible domain name for our container in order for Azure to be able to authenticate our users to Guacamole. The safest way to do this without exposing direct ports to our container is through a reverse proxy or by using a cloudflare tunnel (I highly suggest this)

More information on CF tunnels can be found [here](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/)

## Guacamole Setup
### Setup a local admin account
Once you've got the container made, a default admin user has automatically been created, the username and password are both `guacadmin`. You can access the Guacamole dashboard either from the proxy address you set up, or he ip and port of the container `http://<your.container.ip>.com:8080`. Once you have logged into guacamole, go to the settings and add a new local admin user with all of the admin rights, then log into the new account and delete `guacadmin`. 

### Add RDS host
Next, go to the connections tab to configure the connection to the Windows host we set up earlier.
1. Click `New Connection`
2. Name the host and set the protocol to RDP
3. Scroll down to the `Parameters` tab, and under `Network` set the hostname to the IP address of the windows server
4. Under `Authentication`, set the username to `${GUAC_USERNAME}`. This will automatically pass through the username of the current logged in user to the host you're connecting to.
5. Leave `Password` blank, add your domain name into the `Domain` field
6. Set `Security Mode` to NLA.
7. Check the box next to `Ignore server certificate`
8. The rest of the config is optional, otherwise scroll to the bottom of the page and click save.



### Groups
We will want to set up at least 2 groups. A non privileged (what will be our default group) and an admin group. Start by going to the Groups tab. 
1. Click `New Group` and choose a name. This is our default group, and we named it `Students`.
2. For the Student group, under `Permissions` leave everything unchecked, for the admin group, check every box.
3. Scroll down to connections, and check the box next to the Host we added earlier. 
4. Click save.

:::note
When only one connection is selected for a non admin group, upon authenticating through Azure, the user will automatically be remoting into the connection, bypassing the guacamole dashboard all together.
:::

## Azure SAML Config
### Setup in Azure Portal
An enterprise app needs to be configured in Azure.
1. In Azure AD, under the `Enterprise Applications` tab, click `create new` then `create your own application`.
2. Name it, and select the `Non-gallery` Option. Set as single tenant.
3. Once the app is created and you're on the app page, go to the `Single sign-on `tab and edit the basic SAML Config
4. Set both the Identifier (Entity ID) and Reply URL to your custom domain that you set up with the reverse proxy.
5. Edit `Attributes & Claims`, Edit the Required claim, Unique User Identifier. Set the identifier format to `Persistent` Source to `Attribute` and the attribute to ` user.onpremisessamaccountname`. This passes in the first part of a users email to guacamole as the username.
6. Under SAML Certificates, download the Federation Metadata XML, you will need to add that into the `/config` folder of the Docker container we set up earlier. 
7. Take note of the `Login URL`, we will need that later. 

### Edit Guacamole.Properties File
Now we need to point Guacamole to our Azure app for sign on. We will do this by editing the `guacamole.properties` file. Because we mounted the config folder to the host linux VM, we won't need to attach to the container to edit the file. I recommend using Visual Studio to do this next step as it makes it much easier to edit files. 
1. SSH into your linux vm. 
2. Go to the guacamole config folder that we mounted earlier `/path/to/config`
3. edit the `guacamole.properties` with the following:

```bash
#change the default postgresql fields below for better security
postgresql-hostname: <yourhostname>
postgresql-port: 5432
postgresql-database: <nameofyourdb>
postgresql-username: <user>
postgresql-password: <password

enable-clipboard-integration: true
skip-if-unavailable: saml #For accessing guac without saml. Once SAML is working properly, comment out this line and reapply config.
extension-priority: saml
saml-idp-url: https://login.microsoftonline.com/<example_numbers>/saml2 #the url I told you to note down. You forgot didnt you?
saml-entity-id: https://example-domain.com/
saml-callback-url: https://example-domain.com/
saml-idp-metadata-url: file:///config/guacamole/Guacamole.xml #the xml file from Azure we downloaded in an earlier step. 
saml-strict: false # This field will very depending on the reverse proxy you use. If you get stuck in a loop while logging in, adjust this value.
postgresql-auto-create-accounts: true #By default, saml users are volatile, setting this creates persistent users automatically on first login.
```
4. Restart the container.


Now users should be able to login with with their domain accounts to guacamole. By default, users will not be assigned a group. If you don't have a large userbase or are fine with manually assigning groups, then you're done! Woohoo! If you want to set auto gropu assignments, then its time to put on your SQL hats!

### Automatic Group assignment
Though on the surface it appears guacamole can identify groups sent from azure, the functionality does not appear to work properly, at least with this current docker image. So instead, we need to script this function into the sql database. 
 
First, we will want to write the script and save it as a `.sql` file so that it can be run again if needed. There are a set of scripts that start up the database in the mounted container config folder, `/path/to/config/guacamole/schema`, so we will add it there. From a terminal or VScode, create the `default-groups.sql` file in the `/schema` folder and add the following:

```sql
-- Define Group
CREATE OR REPLACE FUNCTION add_to_default_group() RETURNS TRIGGER AS $$
-- Define function action, inserting a new entity(user) id next to group 1 (our default group)
BEGIN
    INSERT INTO guacamole_user_group_member (user_group_id, member_entity_id)
    VALUES (1, NEW.entity_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that calls the trigger function after a new user is inserted
CREATE TRIGGER add_to_default_group_trigger
AFTER INSERT ON guacamole_user
FOR EACH ROW EXECUTE FUNCTION add_to_default_group();
```

This script assumes the the default group you are setting has a group id of `1`. If this isn't the case, you'll have to query the db to find the names of the groups in the `guacamole_user_group` table. Using the commands in the next step can help you get this information.

To run this script, we will need to connect to the database via the linux CLI. There are 2 options for this, you can either connect directly to the database and paste in the script contents, or you can send a single command to the db, telling it to run the script file.

1. Copy and Paste.

```bash
#attaches to the docker container
sudo docker exec -it <container_name> bash
#To connect directly into the database, and copy and paste in the script contents, do this
psql -U <user> -d <guacdatabase>
#Now you are in the database, using postgres cli, you can simply paste in the entire script file and hit enter.
```
while you're here, you can search the database to find the group names
```sql
-- this will display the group ids you need for the script
TABLE guacamole_user_group
```


2. Script command.
```bash
#attaches to the docker container
sudo docker exec -it <container_name> bash
#run the script file
psql -U <user> -d <guacdatabase> -a -f /config/schema/default-groups.sql
```
## All done

After all of that, Guacamole should now be up and running with authentication setup through azure and automatic group assignments in the sql database! 


