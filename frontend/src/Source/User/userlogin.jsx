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
import { useSignIn, useAuthUser } from "react-auth-kit";

export default function Userlogin() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState(null);
  const signIn = useSignIn();
  const { setAuthState } = useAuthUser();

  const handleLogin = async () => {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const response = await fetch(
      "https://backfood.tfdatamaster.com/api/v1/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log(email);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.fname);
      localStorage.setItem("userLName", data.lname);
      localStorage.setItem("userMobile", data.mobileno);

      if (data.role === "admin") {
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/userinterface";
      }
      signIn({
        token: data.token,
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { email: data.email },
      });
      setAuthState({ email: data.email });
    } else {
      const error = await response.json();
      console.error(error);
      setErrorMessage(error.message);
    }
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
                <b>LET'S ORDER</b>
              </Typography>
              <Typography level="body2" style={{ color: "black" }}>
                Log in to continue.
              </Typography>
            </div>
            <FormControl>
              <FormLabel sx={{ color: "black" }}>Username*</FormLabel>
              <Input
                // html input attribute
                name="email"
                type="email"
                placeholder="mail@mail.com"
              />
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: "black" }}>Password*</FormLabel>
              <Input
                // html input attribute
                name="password"
                type="password"
                placeholder="password"
              />
            </FormControl>

            <Button sx={{ mt: 1 /* margin top */ }} onClick={handleLogin}>
              Log in
            </Button>

            <Typography style={{ color: "red" }}>{errorMessage}</Typography>

            <Typography
              endDecorator={<Link href="/signup">Sign up</Link>}
              fontSize="sm"
              sx={{ alignSelf: "center", color: "black" }}
            >
              Don&apos;t have an account?
            </Typography>
          </Sheet>
        </div>
      </main>
    </CssVarsProvider>
  );
}
