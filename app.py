from flask import Flask, request, Response
from africastalking.AfricasTalking import AfricasTalking, Voice
import os

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Create Flask App
app = Flask(__name__)
PORT = int(os.environ.get('PORT', 3000))

# Configure Africa's Talking credentials
username = os.environ.get('AT_USERNAME')
api_key = os.environ.get('AT_API_KEY')
AT = AfricasTalking(username, api_key)
sms = AT.Messaging
voice = Voice

# Helper Functions
def make_call(phone_number):
    options = {
        'from_': os.environ.get('CALL_FROM'),
        'to': [phone_number],
    }
    return voice.call(options)

def send_sms(phone_number, message):
    options = {
        'to': phone_number,
        'message': message,
    }
    return sms.send(options)

# USSD Endpoint
@app.route('/USSD', methods=['POST'])
def ussd():
    response = ''
    data = request.get_json()

    try:
        phoneNumber = data['phoneNumber']
        text = data['text']

        if not text:
            response = '''CON Karibu 
            1. Information on wildlife, places to visit
            2. Book ticket
            3. Report a problem
            4. Join support group
            5. Give feedback
            6. Helpline'''
        elif text == '1':
            make_call(phoneNumber)
            response = '''CON You will receive a call shortly \n0. Back'''
        elif text == '2':
            send_sms(phoneNumber, "Welcome to Nairobi, the capital of Kenya.")
            response = '''CON You will receive an SMS with a link to a document about it shortly \n0. Back'''
        elif text == '3':
            send_sms(phoneNumber, "BOOK A TOUR WITH US.")
            response = '''CON You will receive a link to the volunteer form shortly \n0. Back'''
        elif text == '4':
            response = '''CON Thank you \n0. Back'''

        elif text == '6':
            response = '''END We are reaching you via call'''
            make_call(phone_number)
        elif text in ['1*0', '2*0', '3*0', '4*0']:
            response = '''CON What would you like to do
            1. Information on wildlife, places to visit
            2. Book ticket
            3. Report a problem
            4. Join support group
            5. Give feedback
            6. Helpline'''

    except Exception as e:
        print(e)
        response = 'END An error occurred. Please try again later.'

    return Response(response, content_type='text/plain')

# Start the Server
if __name__ == '__main__':
    app.run(port=PORT)
