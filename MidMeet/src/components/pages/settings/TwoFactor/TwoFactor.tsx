import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { set2FA, isVerified2FA } from "../../../../apiOperations/userApi";
import { useContext, useState, useEffect } from "react";
import { TokenContext } from "../../../../App";
import AuthCode from "react-auth-code-input";
import { useSpring, animated } from "@react-spring/web";
import { CheckCircleOutline } from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

import { toast, ToastContainer } from "react-toastify";

import "./twoFactor.css";
const steps = [
  "Download Google Authenticator App",
  "Scan QR code",
  "Enter the code from Google Authenticator",
];

export default function TwoFactor() {
  const [result, setResult] = useState("");
  const handleOnChange = (res: string) => {
    setResult(res);
  };

  const { token, setToken } = useContext(TokenContext);
  const [animationFinished, setAnimationFinished] = useState(false);

  const [qr, setQr] = useState("");
  const checkmarkAnimation = useSpring({
    opacity: animationFinished ? 1 : 0,
    transform: animationFinished
      ? "scale(1) rotate(0deg)"
      : "scale(0.5) rotate(-45deg)",
    config: { duration: 1000 },
  });

  useEffect(() => {
    const tfa = async () => {
      if (!qr) {
        try {
          const qrImage = await set2FA(token, setToken);
          setQr(qrImage.img);
        } catch (error) {
          console.error("Failed to fetch QR code", error);
        }
      }
    };
    tfa();
  }, [qr, token, setToken]);
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = async () => {
    if (activeStep == 2) {
      const status = await isVerified2FA(token, setToken, result);
      if (status) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setAnimationFinished(true);
      } else {
        toast.error("wrong code");
      }
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            index;

            return (
              <Step key={label} {...stepProps} className="custom-step">
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep == 0 && (
          <>
            <div className="download-buttons">
              <img src="./google_Authenticator.webp"></img>

              <a
                target="_blank"
                href="https://apps.apple.com/us/app/google-authenticator/id388497605"
              >
                <img
                  src="./appleDonwload.svg"
                  className="download-button-apple"
                ></img>
              </a>

              <a
                target="_blank"
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
              >
                <img
                  src="./androidDownload.svg"
                  className="download-button-android"
                ></img>
              </a>
            </div>
          </>
        )}
        {activeStep == 1 && (
          <>
            <h5 className="qr-title">Scan the QR code with your phone</h5>

            <div className="download-buttons">
              <img src={qr}></img>
            </div>
          </>
        )}
        {activeStep == 2 && (
          <>
            <ToastContainer
              position="bottom-center"
              autoClose={2000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <h5 className="qr-title">
              Enter the code from Google Authenticator
            </h5>
            <span className="qr-title">The code changes every 30 seconds.</span>

            <div className="qr-title">
              <AuthCode
                inputClassName="auth-code-container"
                allowedCharacters="numeric"
                onChange={handleOnChange}
              />
            </div>
          </>
        )}
        {animationFinished && activeStep === steps.length && (
          <div className="qr-title">
            <animated.div style={checkmarkAnimation}>
              <CheckCircleOutline style={{ fontSize: 80, color: "green" }} />
            </animated.div>
            <h2>2FA Enabled Successfully</h2>
          </div>
        )}

        {activeStep === steps.length ? (
          <React.Fragment>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
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

              <Button onClick={handleNext} color="secondary">
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </>
  );
}
