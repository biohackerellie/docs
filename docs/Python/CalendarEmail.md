# Export weekly Google Calendar Events and send as Email reminder

In some work environments, users can be too busy to be bothered to check a calendar to know what's going on every day. I developed this program to scrape calendar events and send them as a weekly email.

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
from email.mime.text import MIMEText
import base64
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build


# Define the email address to send the message to
to = 'users_email@domain.com'

# Set up credentials to authenticate with the Google API
creds = None
if os.path.exists('token.pickle'):
    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)
if not creds or not creds.valid:
    flow = InstalledAppFlow.from_client_secrets_file('client_secret.json', scopes=['https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/gmail.send'])
    creds = flow.run_local_server(port=0)
    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)

# Build the service objects for the Calendar API and Gmail API
service = build('calendar', 'v3', credentials=creds)
gmail_service = build('gmail', 'v1', credentials=creds)

# Define the start and end dates for the weekly events

#Get the current time in UTC
now = datetime.datetime.utcnow()

#Convert to MST for our use, can be swapped for any timezone in the pytz library
timezone = pytz.timezone('US/Mountain')
now = timezone.localize(now)
# Define start and end of the week
start_of_week = (now - datetime.timedelta(days=now.weekday())).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '-07:00' # be sure to adjust the -07:00 offset to match your TZ
end_of_week = (now + datetime.timedelta(days=7 - now.weekday())).strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + '-07:00'

# Fetch the events from the calendar
events_result = service.events().list(calendarId='primary', timeMin=start_of_week, timeMax=end_of_week, singleEvents=True, orderBy='startTime').execute()
events = events_result.get('items', [])

# Create a list of MIMEText objects for each event
event_texts = []
for event in events:
    start = event['start'].get('dateTime', event['start'].get('date'))
    event_text = MIMEText(event['summary'] + ' (' + start + ')\n\n')
    event_texts.append(event_text)

# Concatenate the event texts to create the final message body
message_body = 'Weekly events:\n\n'
for event_text in event_texts:
    message_body += event_text.get_payload()

# Create a MIMEText object for the message body
message = MIMEText(message_body)

# Send the email
message['to'] = to
message['subject'] = 'Weekly events'
raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
body = {'raw': raw}
send_message = (gmail_service.users().messages().send(userId="me", body=body).execute())
print(F'sent message to {to} Message Id: {send_message["id"]}')
```