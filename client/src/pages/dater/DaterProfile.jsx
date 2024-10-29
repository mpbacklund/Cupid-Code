import React from 'react';

import UserDetails from "../../components/UserDetails";


function DaterProfile() {
    async function getUser() {
        const response = await fetch('/me/', {
            method: 'GET'
        });

        return await response.json();

    }

    return(
        
        <>
            <div id="centeredDiv">
            <UserDetails userData={getUser()}></UserDetails>
            </div>
            
        </>
    )
}

export default DaterProfile;