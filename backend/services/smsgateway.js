import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let authToken = null;
let tokenExpiration = null;

async function login() {
  try {
    const response = await axios.post("https://e-sms.dialog.lk/api/v1/login", {
      username: process.env.DIALOG_SMS_USERNAME,
      password: process.env.DIALOG_SMS_PASSWORD,
    });

    if (response.data.status === "success") {
      authToken = response.data.token;
      tokenExpiration = new Date().getTime() + response.data.expiration * 1000;
      console.log("Login successful. Token acquired.");
    } else {
      console.error("Login failed:", response.data.comment);
    }
  } catch (error) {
    console.error("Error during login:", error.message);
  }
}

function generateUniqueTransactionId() {
  // Get the current timestamp as an integer
  const timestamp = Math.floor(new Date().getTime() / 1000);

  return timestamp.toString();
}

async function sendSMS(phoneNumber, message) {
  try {
    if (!authToken || new Date().getTime() > tokenExpiration) {
      // If token is not available or expired, perform login
      console.log("Token not available or expired. Logging in...");
      await login();
    }

    const smsData = {
      sourceAddress: process.env.DIALOG_SMS_MASK,
      message: message,
      transaction_id: generateUniqueTransactionId(),
      msisdn: [{ mobile: phoneNumber }],
      push_notification_url: "https://xxx/xx?",
    };

    const response = await axios.post(
      "https://e-sms.dialog.lk/api/v2/sms",
      smsData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    console.log("SMS sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending SMS:", error.message);
  }
}

export { sendSMS };
