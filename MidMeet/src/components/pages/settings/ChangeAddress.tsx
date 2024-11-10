import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import "react-toastify/dist/ReactToastify.css";
import OtherHousesIcon from "@mui/icons-material/OtherHouses";
import LocationInput from "../../fields/LocationInput";
import { useState, useContext } from "react";
import { TokenContext } from "../../../App";
import { updateAddress } from "../../../apiOperations/userApi";
import { toast } from "react-toastify";
import "./settings.css";
import theme from "../../MuiTheme";
import { ThemeProvider } from "@mui/material/styles";

export default function ChangeAddress() {
  const [location, setLocation] = useState({ address: "", lng: 0, lat: 0 });
  const [open, setOpen] = useState(false);
  const { token, setToken } = useContext(TokenContext);
  const onClick = async () => {
    const result = await updateAddress(token, setToken, location);
    if (result) {
      toast.success("Address changed successfully");
      setOpen(false);
    } else {
      toast.error("Error in changing address");
    }
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <ListItemButton onClick={() => setOpen(true)}>
          <ListItemIcon>
            <OtherHousesIcon style={{ fontSize: 40 }} />
          </ListItemIcon>
          <ListItemText primary="Set Default Address" />
        </ListItemButton>

        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md" // Sets the maximum width of the dialog
          fullWidth // Ensures the dialog takes up the full width
        >
          <Box sx={{ minHeight: "400px", width: "100%" }}>
            <DialogTitle>Set new default address</DialogTitle>

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
              <LocationInput setLocation={setLocation} />
              <Button
                sx={{ left: "25%", marginTop: "50px" }}
                onClick={onClick}
                className="changeButton"
                disabled={location.address == ""}
                variant="outlined"
                color="secondary"
                endIcon={<HomeIcon />}
              >
                Change Address
              </Button>
            </div>
          </Box>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
