import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import emailjs from "emailjs-com"; // Import the emailjs library

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

   const sendEmail = (e) => {
    e.preventDefault();

    const templateParams = {
      user_name: name,
      user_email: email,
      message: message,
    };

    emailjs
      .send(
        "service_zc7jbtg",
        "template_hwaxwsr",
        templateParams,
        "QeY9-5RV_EHW3ap7U"
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
          // Reset the form fields after successful submission
          setName("");
          setEmail("");
          setMessage("");
        },
        (error) => {
          console.log("Error sending email:", error.text);
        }
      );
  };
  return (
    <form onSubmit={sendEmail}>
      <Box
        display="flex"
        flexDirection="column"
        maxWidth="400px"
        margin="0 auto"
      >
        <TextField
          required
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          sx={{
            "& label.MuiInputLabel-root": {
              color: "white", // Change the font color of the label
            },
            "& .MuiInputBase-input": {
              color: "white", // Change the text color of the input
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#808080", // Change the background color of the input
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#808080", // Change the border color of the input
            },
          }}
        />
        <TextField
          required
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Use setEmail to update email state
          margin="normal"
          sx={{
            "& label.MuiInputLabel-root": {
              color: "white", // Change the font color of the label
            },
            "& .MuiInputBase-input": {
              color: "white", // Change the text color of the input
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#808080", // Change the background color of the input
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#808080", // Change the border color of the input
            },
          }}
        />
       <TextField
          required
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Use setMessage to update message state
          margin="normal"
          multiline // Set multiline to true for a multi-line text field
          rows={4} // Specify the number of rows for the multi-line text field
          sx={{
            "& label.MuiInputLabel-root": {
              color: "white", // Change the font color of the label
            },
            "& .MuiInputBase-input": {
              color: "white", // Change the text color of the input
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#808080", // Change the background color of the input
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#808080", // Change the border color of the input
            },
          }}
        />

        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </form>
  );
};

export default ContactForm;
