import React, { useContext } from 'react';

import '../App.css';
import { AccountTypeContext } from '../main';
import LogoButton from "./LogoButton";
import PanicButton from "./PanicButton";

export default function NavBar({ clickEventHandler, interventionClickHandler, intervenResponse }) {
  const userType = useContext(AccountTypeContext);

  return (
    <>
      <div className="navBar">
        <LogoButton onClick={clickEventHandler} />
        { userType === "Dater" && <PanicButton interOnClick={interventionClickHandler} intervenResponse={intervenResponse}/> }
      </div>
    </>
  )
}