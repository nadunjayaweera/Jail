import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

const steps = ["Reciver Details ", "Bill print", "Oder Complete!"];

const HorizontalLinearStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());

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

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
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
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            <TextField
              label="Prisoners Name"
              id="outlined-start-adornment"
              sx={{ m: 1, width: "50ch" }}
            />
            <TextField
              label="Phone Number"
              id="outlined-start-adornment"
              sx={{ m: 1, width: "50ch" }}
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
            >
              Send OTP
            </Button><TextField
              label="OTP "
              id="outlined-start-adornment"
              sx={{ m: 1, width: "50ch" }}
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
            >
              Verify OTP
            </Button>
            <br />
            <TextField
              label="Ward Number"
              id="outlined-start-adornment"
              sx={{ m: 1, width: "50ch" }}
            />
            <TextField
              label="Prisoner Number"
              id="outlined-start-adornment"
              sx={{ m: 1, width: "50ch" }}
            />
          </div>
        );
      case 1:
        return;
      case 2:
        return <Typography variant="h5">Oder Complete </Typography>;
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
          {/* {isStepOptional(activeStep) && (
            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
              Skip
            </Button>
          )} */}
          {activeStep !== steps.length - 1 && (
            <Button onClick={handleNext}>
              {activeStep === steps.length - 2 ? "Order Complete" : "Next"}
            </Button>
          )}
        </Box>
      </React.Fragment>
    </Box>
  );
};

export default HorizontalLinearStepper;
