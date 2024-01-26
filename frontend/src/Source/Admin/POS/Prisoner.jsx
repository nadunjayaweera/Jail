import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/system";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const steps = ["Receiver Details", "Bill Print", "Order Complete!"];

const HorizontalLinearStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [receiverDetails, setReceiverDetails] = React.useState({
    prisonersName: "",
    phoneNumber: "",
    wardNumber: "",
    prisonerNumber: "",
    otp: "",
  });
  const [loginSuccess, setLoginSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    // Save input fields in local storage when moving to the next step
    if (activeStep === 0) {
      const { prisonersName, phoneNumber, wardNumber, prisonerNumber } =
        receiverDetails;
      const inputData = {
        prisonersName,
        phoneNumber,
        wardNumber,
        prisonerNumber,
      };
      localStorage.setItem("inputData", JSON.stringify(inputData));
    }

    // Check if phone number is successfully verified
    if (activeStep === 0 && loginSuccess) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else if (activeStep !== 0) {
      // If it's not the first step, move to the next step directly
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }

    // Update skipped steps
    if (activeStep === 0 && !loginSuccess) {
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setReceiverDetails({
      prisonersName: "",
      phoneNumber: "",
      wardNumber: "",
      prisonerNumber: "",
      otp: "",
    });
  };

  const sendOTP = async () => {
    // Extract data from the form fields
    const { prisonersName, phoneNumber, wardNumber, prisonerNumber } =
      receiverDetails;

    // Prepare the data to be sent
    const data = {
      name: prisonersName,
      mobileno: phoneNumber,
      presonerid: prisonerNumber,
      wardno: wardNumber,
    };

    try {
      // Make the HTTP POST request to your actual API endpoint for OTP
      const response = await fetch(
        "https://backprison.talentfort.live/api/v1/presonersignup/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // You can handle the response here if needed
      const responseData = await response.json();
      console.log("Response from the server:", responseData);
    } catch (error) {
      console.error("Error sending OTP:", error.message);
    }
  };

  const login = async () => {
    // Extract data from the form fields
    const { phoneNumber, otp } = receiverDetails;

    // Prepare the data to be sent for login
    const loginData = {
      mobileno: phoneNumber,
      password: otp, // Assuming OTP is used as a password for simplicity
    };

    try {
      // Make the HTTP POST request to the login endpoint
      const response = await fetch(
        "https://backprison.talentfort.live/api/v1/presonersignup/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // You can handle the response here if needed
      const responseData = await response.json();
      console.log("Mobile Number Verified:", responseData);

      // Set loginSuccess to true upon successful login
      setLoginSuccess(true);

      // Move to the next step or perform additional actions if login is successful
      // handleNext();
    } catch (error) {
      console.error("Error logging in:", error.message);

      // Check for a specific error message from the server
      if (error.message.includes("Incorrect password")) {
        setErrorMessage("Incorrect OTP. Please try again.");
      } else {
        setErrorMessage("Error logging in. Please try again.");
      }
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <TextField
              label="Prisoners Name"
              id="prisonername"
              sx={{ m: 1, width: "50ch" }}
              value={receiverDetails.prisonersName}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  prisonersName: e.target.value,
                }))
              }
            />
            <TextField
              label="Phone Number"
              id="mobileno"
              sx={{ m: 1, width: "40ch" }}
              value={receiverDetails.phoneNumber}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value,
                }))
              }
            />
            <Button
              variant="contained"
              style={{
                marginRight: "10px",
                width: "200px",
                height: "50px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
              onClick={sendOTP}
            >
              Send OTP
            </Button>

            <br />
            <TextField
              label="Ward Number"
              id="wardno"
              sx={{ m: 1, width: "50ch" }}
              value={receiverDetails.wardNumber}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  wardNumber: e.target.value,
                }))
              }
            />
            <TextField
              label="Prisoner Number"
              id="prisonerid"
              sx={{ m: 1, width: "50ch" }}
              value={receiverDetails.prisonerNumber}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  prisonerNumber: e.target.value,
                }))
              }
            />
            <TextField
              label="OTP "
              id="password"
              sx={{ m: 1, width: "50ch" }}
              value={receiverDetails.otp}
              onChange={(e) =>
                setReceiverDetails((prev) => ({
                  ...prev,
                  otp: e.target.value,
                }))
              }
            />
            <Button
              variant="contained"
              style={{
                marginRight: "10px",
                width: "150px",
                height: "50px",
                borderRadius: "10px",
                marginTop: "10px",
              }}
              onClick={login}
            >
              Verify Number
            </Button>
            {loginSuccess && (
              <Alert
                icon={<CheckCircleIcon fontSize="inherit" />}
                severity="success"
                sx={{ alignItems: "flex-start", marginTop: 2 }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setLoginSuccess(false);
                    }}
                  >
                    <CloseRoundedIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <div>
                  <Typography level="body-sm" color="success">
                    Mobile number verified successfully
                  </Typography>
                </div>
              </Alert>
            )}
            {errorMessage && (
              <Alert
                severity="error"
                sx={{ marginTop: 2 }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setErrorMessage("")}
                  >
                    <CloseRoundedIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <Typography>{errorMessage}</Typography>
              </Alert>
            )}
          </div>
        );

      case 1:
        // Retrieve data from local storage
        const storedData = localStorage.getItem("cart");
        const cartData = storedData ? JSON.parse(storedData) : [];

        return (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell>Category</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartData.map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{item.name}</StyledTableCell>
                    <StyledTableCell>{item.price}</StyledTableCell>
                    <StyledTableCell>{item.category}</StyledTableCell>
                    <StyledTableCell>
                      {item.date ? new Date(item.date).toDateString() : "N/A"}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        );

      case 2:
        return <Typography variant="h5">Order Complete</Typography>;

      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <React.Fragment>
        <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
        {getStepContent(activeStep)}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: "1 1 auto" }} />
          {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )}
          <Button
            onClick={activeStep === steps.length - 1 ? handleReset : handleNext}
          >
            {activeStep === steps.length - 1 ? "Order Complete" : "Next"}
          </Button>
        </Box>
      </React.Fragment>
    </Box>
  );
};

export default HorizontalLinearStepper;
