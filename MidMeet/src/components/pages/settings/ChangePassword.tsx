import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import PasswordIcon from "@mui/icons-material/Password";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert"; // Import Alert for displaying errors
import { changePassword } from "../../../apiOperations/userApi";
import { useContext } from "react";
import { TokenContext } from "../../../App";
import { toast, ToastContainer } from "react-toastify";

export default function ChangePassword() {
  const { token, setToken } = useContext(TokenContext);

  const [showPasswordOld, setShowPasswordOld] = React.useState(false);
  const [showPasswordNew, setShowPasswordNew] = React.useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState(""); // State for error messages

  const handleClickShowPasswordOld = () => setShowPasswordOld((show) => !show);
  const handleClickShowPasswordNew = () => setShowPasswordNew((show) => !show);
  const handleClickShowPasswordConfirm = () =>
    setShowPasswordConfirm((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(""); // Clear error when closing the dialog
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());

    const oldPassword = formJson.oldPassword;
    const newPassword = formJson.newPassword;
    const confirmNewPassword = formJson.confirmNewPassword;

    if (!oldPassword) {
      setError("Current password is required.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    // Proceed with password change logic, like sending to an API
    console.log("Password change request:", formJson);
    const result = await changePassword(
      token,
      setToken,
      newPassword,
      oldPassword
    );
    if (result) {
      toast.success("changed password");
      setError("");
      handleClose();
    } else {
      setError("Wrong Current Password");
    }
  };

  return (
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
      <React.Fragment>
        <ListItem disablePadding>
          <ListItemButton onClick={handleClickOpen}>
            <ListItemIcon>
              <PasswordIcon style={{ fontSize: 40 }} />
            </ListItemIcon>
            <ListItemText primary="Change Password" />
          </ListItemButton>
        </ListItem>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: "form",
            onSubmit: handleSubmit, // Use the custom submit handler
          }}
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Password must be 8-20 characters long and contain at least one
              uppercase letter.
            </DialogContentText>
            {error && <Alert severity="error">{error}</Alert>}{" "}
            {/* Display error message */}
            <div className="settings">
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Current Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="oldPassword"
                  type={showPasswordOld ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordOld}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPasswordOld ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
            <div className="settings">
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  New Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="newPassword"
                  type={showPasswordNew ? "text" : "password"}
                  inputProps={{
                    pattern: "(?=.*[A-Z]).{8,20}", // Add pattern for new password validation
                    title:
                      "Password must be 8-20 characters long and contain at least one uppercase letter",
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordNew}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPasswordNew ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
            <div className="settings">
              <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm New Password
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  name="confirmNewPassword"
                  type={showPasswordConfirm ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPasswordConfirm}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPasswordConfirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="secondary">
              Change
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}
