const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { async } = require("validate.js");

const app = express();

const PORT = 3000;

const credentials = {
  apiKey: "",
  username: "eKaranja777",
};
const AfricasTalking = require("africastalking")(credentials);
const sms = AfricasTalking.SMS;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


 

app.post("/", async(req, res) => {
    console.log("hiiii")
    const { phoneNumber, text } = req.body
     if (text === "") {
    console.log(text);

    response = `CON karibu 
            1. Information on wildlife , places to visit 
            2. book ticket
            3. report a problem
            4. Join support group
            5. Give feedback 
            6. HELPLINE
            `;
  } else if (text === "1") {
  
    const credentials = {
      apiKey:
        "",
      username: "",
    };
    const AfricasTalking = require("africastalking")(credentials);
    const voice = AfricasTalking.VOICE;

    function makeCall(phoneNumber) {
      const options = {
        callFrom: "0792190741",

        callTo: [phoneNumber],
      };

      console.log("calling");
      voice.call(options).then(console.log).catch(console.log);
    }

    makeCall(phoneNumber);

    response = `CON you will receive a call shortly \n
    0. Back`;
  } else if (text === "2") {
    console.log(phoneNumber)
    function sendSms() {
      console.log("wwwww");
      const options = {
        to: phoneNumber,
        message:
          "welcome to Nairobi the capital of Kenya. "
      };
      sms
        .send(options)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    console.log("bfore")
    sendSms(phoneNumber);
    console.log("fore")

    console.log("smssssss");
    response = `CON you will receive an sms with a link to a document about it shortly \n
    0. Back`;
  } else if (text === "3") {
    function sendSms() {
      console.log("wwwww");
      const options = {
        to: phoneNumber,

        message:
          "BOOK A TOUR WITH US.",
      };
      sms
        .send(options)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    sendSms(phoneNumber);
    // Business logic for first level response
    response = `CON YOU WILL RECEIVE A LINK TO THE VOLUNTEER FORM SHORTLY \n 
    0. Back`;
  } else if (text === "4") {
    console.log("wwwww222");

       response = `CON thank you \n 
    0. Back`;
  }
  else if (text === "1*0") {
    console.log(text);

    response = `CON What would you like to do
            1. information on the wildlife , places to visit
            2. BOOK TICKET 
            3. report a problem
            4.join support group
            5. Give feedback  
            6.HELPLINE
            `;
  } else if (text === "2*0") {
    console.log(text);

    response = `CON What would you like to do
    1. information on wildlife , places to visit
    2. book ticket
    3. report a problem
    4.join support group 
    5. Give feedback 
    6.HELPLINE
            `;
  } else if (text === "3*0") {
    console.log(text);

    response = `CON What would you like to do
    1. information on wildlife, places to visit
    2. book ticket
    3. report a problem
    4.join support group 
    5. Give feedback
    6.HELPLINE
           
            `;
  } else if (text === "4*0") {
    //     console.log(text);

    response = `CON What would you like to do
    1. information on wildlife 
    2. book ticket
    3. report a problem
    4.join support group 
    5. Give feedback
    6.HELPLINE
            `;
  
  }
  // Print the response onto the page so that our gateway can read it
  res.set("Content-Type: text/plain");

  res.send(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})