import React from "react";
import { Box } from "@mui/material";

const AboutUsdata = () => {
  const aboutUsContent = `Welcome to Mexican Hoppers, where we bring the vibrant flavors of Mexico to Sri Lanka. Our mission is to provide an authentic and unforgettable dining experience that will transport you to the streets of Mexico. At Mexican Hoppers, we take pride in sourcing the freshest ingredients from local farmers and suppliers. Our skilled chefs use traditional cooking techniques to create mouthwatering hoppers that are bursting with flavor. Step into our warm and inviting restaurant, where the tantalizing aroma of freshly cooked hoppers fills the air. Our friendly and knowledgeable staff are here to guide you through our menu, ensuring that your visit is nothing short of exceptional. We are deeply committed to our community and believe in supporting local businesses. By partnering with local farmers, we not only ensure the quality of our ingredients but also contribute to the sustainability of our environment. So, whether you're craving a classic hopper or feeling adventurous enough to try our unique flavor combinations, we invite you to join us at Mexican Hoppers.`;

  return (
    <>
      <img
        src="/images/logo.png"
        alt="Logo"
        style={{
          width: "200px",
          height: "200px",
          display: "block",
          margin: "0 auto",
        }}
      />
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="1000px"
      margin="0 auto"
      padding="20px"
      color="black"
    >
      <h1>Mexican Hoppers</h1>
      <p>{aboutUsContent}</p>
    </Box>
    </>
  );
};

export default AboutUsdata;
