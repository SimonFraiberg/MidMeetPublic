import { Button } from "react-bootstrap";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import { useState, useContext } from "react";
import AuthCode from "react-auth-code-input";
import { TokenContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login2FA } from "../../../apiOperations/userApi";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

type TwoFactorLoginProps = {
  email: string;
  password: string;
  open2FA: boolean;
  setOpen2FA: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function TwoFactorLogin({
  email,
  password,
  open2FA,
  setOpen2FA,
}: TwoFactorLoginProps) {
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const handleOnChange = (res: string) => {
    setTwoFactorCode(res);
  };
  const { setToken } = useContext(TokenContext);
  const navigate = useNavigate();
  return (
    <>
      <Dialog open={open2FA}>
        <DialogTitle> Google 2FA Authentication</DialogTitle>
        <Box sx={{ padding: "100px", width: "100%" }}>
          <IconButton
            aria-label="close"
            onClick={() => setOpen2FA(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            {" "}
            <CloseIcon />
          </IconButton>

          <h5 className="qr-title">Enter the code from Google Authenticator</h5>
          <span className="qr-title">The code changes every 30 seconds.</span>

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
                const status = await login2FA(email, password, twoFactorCode);
                console.log(status);

                if (status != "Wrong Google Token") {
                  setToken(status);
                  navigate("/HomePage");
                } else {
                  toast.error("Wrong 2FA code");

                  setOpen2FA(false);
                }
              }}
              variant="primary"
            >
              Login
            </Button>
          </div>
        </Box>
      </Dialog>
    </>
  );
}
