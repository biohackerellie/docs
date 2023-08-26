# Export weekly Google Calendar Events and send as Email reminder
In some work environments, users can be too busy to be bothered to check a calendar to know what's going on every day. I wrote this script to scrape calendar events and send them as a weekly email.

Before we begin, you will need to make a project on cloud.google.com, give it google calendar and gmail api access, and set up credentials and download the credential .json file to the root directory where you're running this script. The google calendars are all exported ical feeds from laurel.schoolspace.us


You will also need to generate a token file if its your first time running the script. The first time it is run, it needs to authenticate via a web browser, so you will have to run it on your local machine.

To generate a token: 
```python
import os.path
import pickle
import google.auth.credentials
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow

#Define credential token
token = 'token.pickle'


#Checks for token, if none yet, pull credentials from secret.json file
creds = None
if os.path.exists('token.pickle'):
  with open('token.pickle', 'rb') as token:
    creds = pickle.load(token)
if not creds or not creds.valid:
    flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', scopes=['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/gmail.send'])
    creds = flow.run_local_server(port=0)
    with open('token.pickle', 'wb') as token:
      pickle.dump(creds, token)
```

once you have a pickle.token, be sure to copy it to the root directory if the script file on your remote server if you're running on one. 

Here is the full script to email users their calendar events.

```python
import datetime
import pytz
import os.path
import pickle
import google.auth.credentials
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from email.mime.text import MIMEText
import base64
import dateutil.parser
from email.mime.multipart import MIMEMultipart


#Set email recipients to their buildings calendar ids
calendar_recipients = {
		'Calendar_ID1': ['recipient1@email.com', 'recipient2@email.com']
		'Calendar_ID2': ['recipient1@email.com', 'recipient3@email.com']
		'Calendar_ID3': ['recipient4@email.com', 'recipient5@email.com'] #add as many as you need

}

#loads the credentials
token = 'token.pickle'

with open('token.pickle', 'rb') as token:
    creds = pickle.load(token)

service = build('calendar', 'v3', credentials=creds)

#set date and time
now = datetime.datetime.utcnow()
timezone = pytz.timezone('US/Mountain')
now = timezone.localize(now)
start_of_week = (now - datetime.timedelta(days=now.weekday())).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '-07:00' # be sure to adjust the -07:00 offset to match your TZ
end_of_week = (now + datetime.timedelta(days=7 - now.weekday())).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '-07:00'

# sends the emails according to matching calendar ids and email addresses
for calendar_id, recipients in calendar_recipients.items():
    events_result = service.events().list(calendarId=calendar_id, timeMin=start_of_week, timeMax=end_of_week, singleEvents=True, orderBy='startTime').execute()
    events = events_result.get('items', [])

    event_texts = []
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        start_datetime_utc = dateutil.parser.parse(start)
        mountain_tz = pytz.timezone('US/Mountain')
        start_datetime_mountain = start_datetime_utc.astimezone(mountain_tz)
        start_date = start_datetime_mountain.strftime('%A, %B %d, %Y')  
        start_time = start_datetime_mountain.strftime('%I:%M %p')  
        event_text = event['summary'] + ' (' + start_date + ' at ' + start_time + ')\n\n'
        event_texts.append(event_text)

    message = MIMEMultipart()
    message['to'] = ', '.join(recipients)
    message['subject'] = 'Weekly events'

    body = '<b>Here is what is happening this week in your building:</b><br><br>'
    for event_text in event_texts:
        body += event_text + '<br>'

    message.attach(MIMEText(body, 'html'))

    gmail_service = build('gmail', 'v1', credentials=creds)

    body = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
    send_message = (gmail_service.users().messages().send(userId="me", body=body).execute())
    print(F'sent message to {calendar_id} recipients: {recipients} Message Id: {send_message["id"]}')

```