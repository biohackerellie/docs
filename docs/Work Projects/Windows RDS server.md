This is an ongoing project for Laurel Public Schools and I will be updating the documentation as we go. 

---

## Project Goal

The goal with this project is to build a scalable RDS server for students to be able to remote into from their chromebooks, allowing us to cut down on computer labs
outside of the classes that use Photoshop and Illustrator.

---

## Progress

### January 25th, 2023

**Initial Stages**

Currently, we are building all on prem, testing with 3 windows server vms, 1 to run the gateway and licensing, the connection broker, and the session host. Once we have a proof of concept and the plan gets approved, the hope is to integrate a kubernetese cluster to scale this out (*edit, kubernetese can not be used with RDS apparently*). 

---

### January 30th, 2023

**Progress**

Initial testing has involved 4 windows server VMS. A gateway, connection broker, session host, and virtualization host. Our initial thinking is that we will only want to use the RDP app and not the web browser, and only allow access on campus so a webhost is not necessary. So far I have RDS sessions working as a proof of concept. My hesitation with sessions is it being a shared resource pool off of a single, or however many hosts we scale up to, session host vm and that vm is Windows server. Meaning all of our students will have access to the base file system of our vm host and server manager, etc. I like the idea of VDI better as each VM that spins up will act as its own environment per user. 

Further exploration and setup of the virtualization host for testing has lead to me being stuck in creating the template windows 10 VM. Trying to make a VM inside of another VM is complicating getting a network connection through.

### February 15th, 2023

**Solution**

After a few more weeks of testing virtualization on our infrastructure, I decided on scrapping most of RDS core concepts to use our own custom soultion. We now have a working prototype using guacamole and RDP into an RDS session host. Though the host runs windows server, through group policy I am able to structure the host to be just like a student desktop. Using sessions vs VDI works much better for us on prem as it requires significantly less resources. If we were to do VDI instead, I'd have to insist on doing so in Azure, as the workload we would need would be quite resource intensive and not something we should spare server space on unless we were to purchase entire servers just for this purpose. 

The decision to use guacamole is purely from an ease of use point. It provides a seemless user expierence with HTML5 based RDP, which runs great on the chromebooks the students will be using. Right now we are still in the proof of concept phase, but now that we have a solid demo, if approved, I will begin building up guacamole to support SSO and building the back end to support a large user base. 