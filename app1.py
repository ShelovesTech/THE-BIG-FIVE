
# *384*31278#
import os
from flask import Flask, request
from africastalking.AfricasTalking import AfricasTalking, Voice
from dotenv import load_dotenv


# Configure Africa's Talking credentials
username = os.environ.get('AT_USERNAME')
api_key = os.environ.get('AT_API_KEY')
AT = AfricasTalking(username, api_key)
sms = AT.Messaging
voice = Voice

# Load environment variables
load_dotenv()

# Create Flask App
app = Flask(__name__)
PORT = int(os.environ.get('PORT', 3000))

response = ""

@app.route('/', methods=['POST', 'GET'])
def ussd_callback():
    global response
    session_id = request.values.get("sessionId", None)
    service_code = request.values.get("serviceCode", None)
    phone_number = request.values.get("phoneNumber", None)
    text = request.values.get("text", "default")

    if text == '':
        response  = "CON What would you want to check \n"
        response += "1. My Account \n"
        response += "2. My phone number"

    elif text == '1':
        response = "CON Choose account information you want to view \n"
        response += "1. Account number \n"
        response += "2. Account balance"

    elif text == '1*1':
        accountNumber  = "ACC1001"
        response = "END Your account number is " + accountNumber

    elif text == '1*2':
        balance  = "KES 10,000"
        response = "END Your balance is " + balance
    elif text == '2':
        response = "END This is your phone number " + phone_number  
    return response


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
@app.route('/USSD', methods=['POST', 'GET'])
def ussd_callback():
    response = ''
    session_id = request.values.get("sessionId", None)
    service_code = request.values.get("serviceCode", None)
    phone_number = request.values.get("phoneNumber", None)
    text = request.values.get("text", "default")

    try:
        if text == '':
            response = '''CON Karibu 
            1. Information on wildlife, places to visit
            2. Book ticket
            3. Report a problem
            4. Join support group
            5. Give feedback
            6. Helpline'''
        elif text == '1':
            make_call(phone_number)
            response = '''CON You will receive a call shortly \n0. Back'''
        elif text == '2':
            send_sms(phone_number, "Welcome to Nairobi, the capital of Kenya.")
            response = '''CON You will receive an SMS with a link to a document about it shortly \n0. Back'''
        elif text == '3':
            send_sms(phone_number, "BOOK A TOUR WITH US.")
            response = '''CON You will receive a link to the volunteer form shortly \n0. Back'''
        elif text == '4':
            response = '''CON Thank you \n0. Back'''
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
    app.run(host="0.0.0.0", port=os.environ.get('PORT'))