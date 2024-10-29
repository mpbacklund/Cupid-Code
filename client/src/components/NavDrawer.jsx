import React, { useContext } from 'react';

import { Link } from "react-router-dom";
import { AccountTypeContext } from '../main';
import '../App.css';
import LogOutButton from './LogOutButton';

export default function NavDrawer({ routes, hiddenState }) {
  const userType = useContext(AccountTypeContext);

  const [hidden, setHidden] = hiddenState

  const helpLinks = {
    "Cupid": "https://docs.google.com/document/d/1ItMok7hFumzCCwvWmiW-dzlQMI_SYh9o7BI4LZGarQs/edit?usp=sharing",
    "Dater": "https://docs.google.com/document/d/1wA_p__3Cthe7EnQcs_spUxNYeQatVnTM8X0xD__xX5M/edit?usp=sharing",
    "Manager": "https://docs.google.com/document/d/1PThxiABQLADh_oP_PeTwgfRvlarO_2Rh8dl9mO0Jatk/edit?usp=sharing"
  }

  return(
    <>
      <nav className={hidden ? 'navDrawer navClosed' : 'navDrawer navOpen'}>
        <div className={'navWrapper'}>
          <div className='navLocation'>
            {routes.map(route => (
                <Link key={route.path} to={route.path} className={'navDrawerElement'} onClick={() => setHidden(true)}>{route.name}</Link>
            ))}
            <a className='navDrawerElement' href={helpLinks[userType]}>Help</a>
          </div>
            <LogOutButton />
        </div>
      </nav>
    </>
  );
}