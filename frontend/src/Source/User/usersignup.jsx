import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    conpassword: "",
    mobileno: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const [errorMessage, setErrorMessage] = React.useState(null);

  const handleSignUp = () => {
    // Send formData to backend API
    // Check if passwords match
    if (formData.password !== formData.conpassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    fetch("http://localhost:8084/api/v1/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Email already exists");
        }
        return response.json();
      })
      .then((data) => {
        // Handle successful sign-up
        console.log(data);
        navigate("/userinterface");
      })
      .catch((error) => {
        // Handle sign-up error
        console.error(error);
        // Set error message state variable
        setErrorMessage(error.message);
      });
  };

  return (
    <CssVarsProvider>
      <main>
        <div
          style={{
            background: `url(/images/background.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            sx={{
              width: "90%", // Adjust the width to your preference
              margin: "auto", // Center the sheet horizontally
              my: 4, // margin top & bottom
              py: 3, // padding top & bottom
              px: 2, // padding left & right
              display: "flex",
              flexDirection: "column",
              gap: 2,
              borderRadius: "sm",
              boxShadow: "md",
              backgroundColor: "white",
            }}
            variant="outlined"
          >
            <div>
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
              <Typography level="h4" component="h1" style={{ color: "black" }}>
                <b>Sign Up</b>
              </Typography>
              <Typography level="body2" style={{ color: "black" }}>
                Create a new account.
              </Typography>
            </div>
            <FormControl>
              <FormLabel sx={{ color: "black" }}>First Name</FormLabel>
              <Input
                name="fname"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: "black" }}>Last Name</FormLabel>
              <Input
                name="lname"
                type="text"
                placeholder="LastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: "black" }}>Email</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="mail@mail.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: "black" }}>Mobile NO</FormLabel>
              <Input
                name="mobileno"
                type="number"
                placeholder="Mobile No"
                value={formData.mobileno}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: "black" }}>Password</FormLabel>
              <Input
                name="password"
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: "black" }}>Confirm Password</FormLabel>
              <Input
                name="conpassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.conpassword}
                onChange={handleInputChange}
              />
            </FormControl>

            <Button sx={{ mt: 1 }} onClick={handleSignUp}>
              Sign up
            </Button>
            <Typography style={{ color: "red" }}>{errorMessage}</Typography>
            <Typography
              endDecorator={<Link href="/">Log in</Link>}
              fontSize="sm"
              sx={{ alignSelf: "center", color: "black" }}
            >
              Already have an account?
            </Typography>
          </Sheet>
        </div>
      </main>
    </CssVarsProvider>
  );
}
