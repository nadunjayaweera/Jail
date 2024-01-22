import React, { useState, useEffect, useRef } from "react";
import { Typography, Box, Stack } from "@mui/material";
import { Phone, LocationOn, Mail } from "@mui/icons-material";

import axios from "axios";
const Footer = () => {
  const [salesData, setSalesData] = useState(null);
  const prevSalesData = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioURL = "../noti.mp3";
  const audioRef = useRef(null);

  const handlePlay = () => {
    audioRef.current.play();
  };

  const handlePause = () => {
    audioRef.current.pause();
  };
  const handleclose = () => {
    const close = document.getElementById("popup");
    close.style.display = "none";
  };
  const fetchSalesData = async () => {
    try {
      const response = await axios.get("http://localhost:8084/api/v1/getsales");
      const salesData = response.data;
      const lastElement = salesData[salesData.length - 1].orderId;

      // Check if the value is new
      if (lastElement !== prevSalesData.current) {
        // If new, show the popup
        const popup = document.getElementById("popup");
        popup.style.display = "block";

        // Play notification sound (replace with your audio URL)
        const notificationSound = new Audio("./noti.mp3");
        notificationSound.play().catch((error) => {
          // If the play() method fails, it is often due to a browser restriction.
          // You can handle the error here or provide a fallback solution.
          console.error("Failed to play the notification sound:", error);
        });
      }

      // Update the state and the previous salesData
      setSalesData(lastElement);
      prevSalesData.current = lastElement;
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  // Call the API on initial render and set up the interval
  useEffect(() => {
    fetchSalesData();

    // Set up the interval to fetch the data every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(fetchSalesData, 5000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array ensures the effect runs only on initial render

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#696969",
        color: "#ffffff",
        textAlign: "center",
        padding: "20px",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* <div class="popupbox" id="popup">
        <div class="popup">
          <img
            id="close2"
            onClick={handleclose}
            src="https://moveyellow.com/public/assets/images/close.png"
            alt=""
          />
          <div>
            <h1 style={{ color: "black" }}>New Sale Here {salesData}</h1>
            <div>
              <img
                style={{ maxWidth: "40px" }}
                src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-bell-512.png"
                alt=""
              />
            </div>
            <button
              onClick={handleclose}
              style={{
                width: "120px",
                height: "40px",
                border: "none",
                color: "white",
                background: "black",
              }}
            >
              Close
            </button>{" "}
          </div>
        </div>
      </div> */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Phone />

          <Typography variant="body2">Contact NO: 011 2 87 14 14</Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <LocationOn />
          <Typography variant="body2">
            Address: No.15, Madiwela Road, Thalawathugoda, Sri Lanka.
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Mail />
          <Typography variant="body2">Email: test@example.com</Typography>
        </Stack>
      </Stack>
      <Typography variant="body2" sx={{ marginTop: "10px" }}>
        © 2023 MEXICAN HOPPERS. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
