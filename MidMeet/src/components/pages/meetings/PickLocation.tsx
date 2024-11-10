import LocationInput from "../../fields/LocationInput";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { Button, Divider, Box, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { TokenContext } from "../../../App";
import currentUser from "../../../currentUser";
import { useContext } from "react";
import { Spinner } from "react-bootstrap";
import theme from "../../MuiTheme";
import { ThemeProvider } from "@mui/material/styles";

type PickLocationProp = {
  setLocation: React.Dispatch<
    React.SetStateAction<{
      address: string;
      lng: number;
      lat: number;
    }>
  >;
  handleCreate: (location: {
    address: string;
    lng: number;
    lat: number;
  }) => Promise<void>;
};

export default function PickLocation({
  setLocation,
  handleCreate,
}: PickLocationProp) {
  const { token, setToken } = useContext(TokenContext);
  const { user, isLoading, isError } = currentUser(token, setToken);
  if (isLoading) {
    return <Spinner animation="border" variant="warning" />; // Render loading state
  }

  if (isError) {
    return <div>Error: Unable to fetch user data</div>; // Render error state
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            margin: 10,
          }}
        >
          <Typography sx={{ width: "30%" }}>
            <LocationInput setLocation={setLocation}></LocationInput>
            <Divider>
              <Chip sx={{ margin: "10px" }} label="Or" size="small" />
            </Divider>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <TextField
                  id="outlined-read-only-input"
                  label="Your default Address"
                  defaultValue=""
                  value={user?.location.address}
                  sx={{ width: "100%" }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  color="secondary"
                  sx={{ margin: "20px" }}
                  onClick={() => {
                    if (user?.location) {
                      handleCreate(user?.location);
                    }
                  }}
                  variant="outlined"
                  endIcon={<HomeIcon />}
                >
                  Choose My Default Address
                </Button>
              </div>
            </div>
          </Typography>
        </Box>
      </ThemeProvider>
    </>
  );
}
