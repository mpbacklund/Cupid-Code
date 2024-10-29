import React from 'react';

import CupidDetails from '../../components/CupidDetails'
import UserDetails from '../../components/UserDetails'

export default function CupidProfile() {
    async function getUser() {
        const response = await fetch('/me/', {
            method: 'GET'
        });

        return await response.json();

    }

    var data = getUser()
    
    return(
        <>
        <div id="centeredDiv">
        <UserDetails userData={data}></UserDetails>
        <CupidDetails userData={data}></CupidDetails>
        </div>
        
        </>
    )
}