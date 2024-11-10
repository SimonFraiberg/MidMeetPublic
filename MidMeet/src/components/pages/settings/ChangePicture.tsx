import Picture from "../../picture/Picture";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import PortraitIcon from "@mui/icons-material/Portrait";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import "react-toastify/dist/ReactToastify.css";
import theme from "../../MuiTheme";
import { ThemeProvider } from "@mui/material/styles";

import { useState, useContext } from "react";
import { updateProfilePic } from "../../../apiOperations/userApi";
import { TokenContext } from "../../../App";
import { toast } from "react-toastify";
export default function ChangePicture() {
  const [picture, setPicture] = useState("");
  const [open, setOpen] = useState(false);
  const { token, setToken } = useContext(TokenContext);
  const onClick = async () => {
    const result = await updateProfilePic(token, setToken, picture);
    if (result) {
      toast.success("profile picture changed");
      setPicture("");
      setOpen(false);
    } else {
      toast.error("error in changing profile picture");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ListItemButton onClick={() => setOpen(true)}>
          <ListItemIcon>
            <PortraitIcon style={{ fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Change Profile Picture" />
        </ListItemButton>

        <Dialog open={open}>
          <Box sx={{ width: "100%" }}>
            <DialogTitle>Set new profile picture</DialogTitle>

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
            <div className="profilePictureSettings">
              <Picture value={picture} set={setPicture} />
              {picture !== "" && (
                <Button
                  onClick={onClick}
                  className="changeButton"
                  variant="outlined"
                  endIcon={<InsertPhotoIcon />}
                  color="secondary"
                >
                  change Picture
                </Button>
              )}
            </div>
          </Box>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
