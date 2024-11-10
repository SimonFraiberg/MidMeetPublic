import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/pages/login/Login";
import Register from "./components/pages/register/Register";
import HomePage from "./components/pages/home/HomePage";
import React, { useState } from "react";
import CreateMeeting from "./components/pages/meetings/createMeet";
import MapScreen from "./components/pages/map/MapScreen";
import Settings from "./components/pages/settings/Settings";
import PreferenceQuiz from "./components/pages/prefrenceQuiz/PreferenceQuiz";
import MeetingPage from "./components/pages/meetings/MeetingPage";

export const TokenContext = React.createContext({
  token: "failed",
  setToken: (str: string) => {
    str;
  },
});

function App() {
  const [token, setToken] = useState<string>("failed");

  const value = { token, setToken };

  return (
    <>
      <TokenContext.Provider value={value}>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={HomePage} />
            <Route path="/Login" Component={Login} />
            <Route path="/Register" Component={Register} />
            <Route path="/HomePage" Component={HomePage} />
            <Route path="/Settings" Component={Settings} />
            <Route path="/Map/:meetId" element={<MapScreen />} />
            <Route path="/createMeet" Component={CreateMeeting} />
            <Route path="/Meetings" Component={MeetingPage} />
            <Route path="/PreferenceQuiz/*" element={<PreferenceQuiz />} />
            <Route path="/*" element={<Navigate to="/HomePage" />} />
          </Routes>
        </BrowserRouter>
      </TokenContext.Provider>
    </>
  );
}

export default App;
