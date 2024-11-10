import { Button } from "react-bootstrap";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import { disable2FA } from "../../../../apiOperations/userApi";
import TwoFactor from "./TwoFactor";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { get2FA } from "../../../../apiOperations/userApi";
import { useContext, useState, useEffect } from "react";
import { TokenContext } from "../../../../App";
import AuthCode from "react-auth-code-input";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PhonelinkLockIcon from "@mui/icons-material/PhonelinkLock";
import ListItem from "@mui/material/ListItem";

import { toast, ToastContainer } from "react-toastify";

export default function TwoFactorSteps() {
  const [open, setOpen] = useState(false);
  const [twofaEnabled, setTwofaEnabled] = useState(false);
  const [result, setResult] = useState("");
  const handleOnChange = (res: string) => {
    setResult(res);
  };
  const { token, setToken } = useContext(TokenContext);
  useEffect(() => {
    const is2fa = async () => {
      const is2faEnabled = await get2FA(token, setToken);
      setTwofaEnabled(is2faEnabled);
    };
    is2fa();
  }, [twofaEnabled, token, setToken]);

  return (
    <div>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <PhonelinkLockIcon style={{ fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText
            onClick={() => setOpen(true)}
            primary={twofaEnabled ? "Disable Google 2FA" : "Set Google 2FA"}
          />
        </ListItemButton>
      </ListItem>

      <Dialog open={open}>
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {twofaEnabled ? (
          <>
            <DialogTitle>Disabling Google 2FA</DialogTitle>
            <Box sx={{ padding: "100px", width: "100%" }}>
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
              <span className="qr-title">
                The code changes every 30 seconds.
              </span>

              <div className="qr-title">
                <AuthCode
                  inputClassName="auth-code-container"
                  allowedCharacters="numeric"
                  onChange={handleOnChange}
                />
              </div>
              <div className="qr-title">
                <Button
                  onClick={async () => {
                    const status = await disable2FA(token, setToken, result);
                    if (status) {
                      toast.success("Google 2FA disabled");
                      setOpen(false);
                    } else {
                      toast.error("wrong code failed to disable");
                    }
                  }}
                  variant="primary"
                >
                  Disable 2FA
                </Button>
              </div>
            </Box>
          </>
        ) : (
          <>
            <DialogTitle>Set Google 2FA</DialogTitle>

            <TwoFactor />
          </>
        )}
      </Dialog>
    </div>
  );
}
