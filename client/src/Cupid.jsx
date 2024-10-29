import React from 'react';
import { Route, Routes } from "react-router-dom";

import NavBar from './components/NavBar';
import NavDrawer from './components/NavDrawer';
import CupidHome from "./pages/cupid/CupidHome";
import CupidProfile from "./pages/cupid/CupidProfile";

export function Cupid() {
  // the following gets rendered into the nav drawer on the front end
  const navDrawerRoutes = [
    { path: "/", name: "Home Page" },
    { path: "/profile", name: "Profile"}
  ];
  
  const navDrawerHiddenState = React.useState(true)
  const [navDrawerHidden, setNavDrawerHidden] = navDrawerHiddenState

  return (
    <>
      <NavDrawer routes={navDrawerRoutes} hiddenState={navDrawerHiddenState} />
      <NavBar clickEventHandler={() => setNavDrawerHidden(!navDrawerHidden)} />
        <Routes>
          <Route index element={<CupidHome/>} />
          <Route path="/profile" element={<CupidProfile/>} />
        </Routes>
    </>
  );
}