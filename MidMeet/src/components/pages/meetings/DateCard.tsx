import "./meetings.css";
import dayjs from "dayjs";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../MuiTheme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import Card from "@mui/material/Card";
import { Box, TextField } from "@mui/material";

type DateProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  value: dayjs.Dayjs | null;
  setValue: React.Dispatch<React.SetStateAction<dayjs.Dayjs | null>>;
};

export default function DateCard({
  name,
  setName,
  value,
  setValue,
}: DateProps) {
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
          }}
        >
          {" "}
          <TextField
            required
            id="outlined-required"
            sx={{ width: "30%" }}
            label="Enter Meet Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Card className="date_card ">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <StaticDateTimePicker
                sx={{
                  ".MuiDialogActions-root": {
                    display: "none", // Hide cancel and ok buttons
                  },
                  ".MuiButtonBase-root.MuiTab-root.Mui-selected": {
                    color: "primary.main",
                  },
                  ".MuiPickersToolbarText-root": {
                    fontSize: "2rem", // Corrected syntax for font size
                  },
                  ".MuiDayCalendar-weekDayLabel": {
                    color: "primary.dark", // week day labels
                  },
                  ".MuiClockPointer-root": {
                    backgroundColor: "primary.light", // hover color
                    color: "primary.main", // week day labels
                  },
                  ".MuiClockPointer-thumb": {
                    border: "16px solid primary.main",
                    backgroundColor: "primary.main", //  hover color
                    color: "primary.main", //  week day labels
                  },
                  ".MuiClock-pin": {
                    backgroundColor: "primary.light", //  hover color
                    color: "primary.main", //  week day labels
                  },
                  ".MuiPickersDay-daySelected": {
                    backgroundColor: "primary.main", //  selected date circle
                    "&:hover": {
                      backgroundColor: "primary.light", //  hover color
                    },
                  },
                  ".MuiPickersYear-yearButton.Mui-selected ": {
                    backgroundColor: "primary.main", // selected date circle
                    "&:hover": {
                      backgroundColor: "primary.light", //  hover color
                    },
                  },
                  ".MuiPickersDay-root.Mui-selected": {
                    backgroundColor: "primary.main", //  selected date background
                    color: "#fff", // White text for selected date
                    "&:hover": {
                      backgroundColor: "primary.main", // Orange hover color
                    },
                  },
                  ".MuiPickersDay": {
                    backgroundColor: "primary.main", //  selected date background
                    color: "#fff", // White text for selected date
                    "&:hover": {
                      backgroundColor: "primary.light", // Orange hover color
                    },
                  },
                  ".MuiClock-clock .Mui-selected": {
                    backgroundColor: "primary.main", //  selected time circle
                    color: "#fff", // White text for selected time
                    "&:hover": {
                      backgroundColor: "primary.light", // Orange hover color
                    },
                  },
                  ".MuiYearPicker-year.selected": {
                    color: "primary.main", //  text for selected year
                    "&:hover": {
                      color: "primary.light", //  hover color
                    },
                  },
                }}
                className="custom-date-picker"
                value={value}
                ampm={false}
                disablePast={true}
                onChange={(newValue) => setValue(newValue)}
              />
            </LocalizationProvider>
          </Card>
        </Box>
      </ThemeProvider>
    </>
  );
}
