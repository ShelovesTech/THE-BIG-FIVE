// Required Libraries
const express = require("express");
const bodyParser = require("body-parser");
const AfricasTalking = require("africastalking");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Create Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Configure Africa's Talking credentials
const credentials = {
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
};
const AT = AfricasTalking(credentials);
const sms = AT.SMS;
const voice = AT.VOICE;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined")); // Logger

// Helper Functions
const makeCall = (phoneNumber) => {
  const options = {
    callFrom: process.env.CALL_FROM,
    callTo: [phoneNumber],
  };

  voice.call(options).then(console.log).catch(console.log);
};

const sendSms = (phoneNumber, message) => {
  const options = {
    to: phoneNumber,
    message: message,
  };
  return sms.send(options);
};

// USSD Endpoint
app.post("/USSD", async (req, res) => {
  let response = "";
  const { phoneNumber, text } = req.body;

  try {
    if (!text) {
      response = `CON Karibu 
            1. Information on wildlife, places to visit
            2. Book ticket
            3. Report a problem
            4. Join support group
            5. Give feedback
            6. Helpline`;
    } else if (text === "1") {
      makeCall(phoneNumber);
      response = `CON You will receive a call shortly \n0. Back`;
    } else if (text === "2") {
      await sendSms(phoneNumber, "Welcome to Nairobi, the capital of Kenya.");
      response = `CON You will receive an SMS with a link to a document about it shortly \n0. Back`;
    } else if (text === "3") {
      await sendSms(phoneNumber, "BOOK A TOUR WITH US.");
      response = `CON You will receive a link to the volunteer form shortly \n0. Back`;
    } else if (text === "4") {
      response = `CON Thank you \n0. Back`;
    } else if (text === "1*0" || text === "2*0" || text === "3*0" || text === "4*0") {
      response = `CON What would you like to do
            1. Information on wildlife, places to visit
            2. Book ticket
            3. Report a problem
            4. Join support group
            5. Give feedback
            6. Helpline`;
    }
  } catch (error) {
    console.error(error);
    response = `END An error occurred. Please try again later.`;
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
