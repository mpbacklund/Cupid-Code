import React from 'react';
import { Route, Routes } from "react-router-dom";

import NavDrawer from "./components/NavDrawer";
import NavBar from "./components/NavBar";
import Chat from "./pages/dater/Chat";
import CupidCash from "./pages/dater/CupidCash";
import DaterProfile from "./pages/dater/DaterProfile";
import Intervention from "./pages/dater/Intervention";
import InterventionPopUp from './components/InterventionPopUp';

export function Dater() {
  // the following gets rendered into the nav drawer on the front end
  const navDrawerRoutes = [
    { path: "/", name: "Chat" },
    { path: "/intervention", name: "Intervention" },
    { path: "/cupid-cash", name: "Cupid Cash" },
    { path: "/profile", name: "Profile"}
  ];
    
  const navDrawerHiddenState = React.useState(true);
  const [navDrawerHidden, setNavDrawerHidden] = navDrawerHiddenState;

  const interventionHiddenState = React.useState(true);
  const [interventionHidden, setInterventionHidden] = interventionHiddenState;

  const [interventionResponse, setInterventionResponse] = React.useState("Stay where you are so your cupid can find you! To view active interventions, navigate to the Intervention page in the menu.")

  return (
    <>
      <NavDrawer routes={navDrawerRoutes} hiddenState={navDrawerHiddenState} />
      <NavBar 
        clickEventHandler={() => setNavDrawerHidden(!navDrawerHidden)} 
        interventionClickHandler={() => setInterventionHidden(!interventionHidden)}
        intervenResponse={(msg) => setInterventionResponse(msg)}
        >
      </NavBar>
      <InterventionPopUp popUpHidden={interventionHiddenState} displayText={interventionResponse}/>
      <div className="content">
        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/intervention" element={<Intervention />} />
          <Route path="/cupid-cash" element={<CupidCash />} />
          <Route path="/profile" element={<DaterProfile />} />
        </Routes>
      </div>
    </>
  );
}
