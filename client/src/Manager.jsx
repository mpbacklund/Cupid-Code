import React from 'react';
import { Route, Routes } from "react-router-dom";

import NavDrawer from "./components/NavDrawer";
import NavBar from "./components/NavBar";
import ManagerHome from "./pages/manager/ManagerHome"
import Finances from './pages/manager/Finances';

export function Manager() {
  // the following gets rendered into the nav drawer on the front end
  const navDrawerRoutes = [
    { path: "/", name: "Dashboard" },
    { path: "/finances", name: "Revenue Report" },
  ];
  
  const navDrawerHiddenState = React.useState(true)
  const [navDrawerHidden, setNavDrawerHidden] = navDrawerHiddenState

  return (
    <>
      <NavDrawer routes={navDrawerRoutes} hiddenState={navDrawerHiddenState} />
      <NavBar clickEventHandler={() => setNavDrawerHidden(!navDrawerHidden)} />
      <div className="content">
        <Routes>
          <Route path="/" element={<ManagerHome />} />
          <Route path="/finances" element={<Finances />} />
        </Routes>
      </div>
    </>
  );
}
