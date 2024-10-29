import React from 'react';

import '../App.css'

export default function LogOutButton() {

    async function logOut() {
       window.location.href = '/registration/logout/';
    }

    return(
        <button className="cupid-code-button" id="logOutButton" onClick={logOut}>Log out</button>
    )
}