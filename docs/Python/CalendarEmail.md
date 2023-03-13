# Export weekly Google Calendar Events and send as Email reminder

In some work environments, users can be too busy to be bothered to check a calendar to know what's going on every day. I developed this script to scrape calendar events and send them as a weekly email.

Before we begin, you will need to make a project on [cloud.google.com](https://console.cloud.google.com), give it google calendar and gmail api access, and set up credentials and download the credential ``.json`` file to the root directory where you're running this program.

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

#set calendar ID and Recipients
calendar_id = 'calendar_id_goes_here'
to = ['recipient 1', 'recipient 2']

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

#build calendar service
service = build('calendar', 'v3', credentials=creds)

#Set timezone and start and end of a week
now = datetime.datetime.utcnow()
timezone = pytz.timezone('US/Mountain')
now = timezone.localize(now)
start_of_week = (now - datetime.timedelta(days=now.weekday())).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '-07:00' # be sure to adjust the -07:00 offset to match your TZ
end_of_week = (now + datetime.timedelta(days=7 - now.weekday())).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '-07:00'

#get google calendar events
events_result = service.events().list(calendarId=calendar_id, timeMin=start_of_week, timeMax=end_of_week, singleEvents=True, orderBy='startTime').execute()
events = events_result.get('items', [])

#Define text stated for each event
event_texts = []
for event in events:
	start = event['start'].get('dateTime', event['start'].get('date'))
	start_datetime_utc = dateutil.parser.parse(start)
	mountain_tz = pytz.timezone('US/Mountain')
	start_datetime_mountain = start_datetime_utc.astimezone(mountain_tz)
	start_date = start_datetime_mountain.strftime('%A, %B %d, %Y')  # format start date as 'Weekday, Month day, Year'
	start_time = start_datetime_mountain.strftime('%I:%M %p')  # format start time as 'hh:mm AM/PM'
	event_text = event['summary'] + ' (' + start_date + ' at ' + start_time + ')\n\n'
	event_texts.append(event_text)


#Build and send email
message = MIMEMultipart()
message['to'] = ', '.join(to)
message['subject'] = 'Weekly events'

body = '<b>Here is what is happening this week in your building:</b><br><br>'
for event_text in event_texts:
    body += event_text + '<br>'

message.attach(MIMEText(body, 'html'))

gmail_service = build('gmail', 'v1', credentials=creds)



body = {'raw': base64.urlsafe_b64encode(message.as_bytes()).decode()}
send_message = (gmail_service.users().messages().send(userId="me", body=body).execute())
print(F'sent message to {to} Message Id: {send_message["id"]}')
```