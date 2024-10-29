import React from 'react';
import { useState } from 'react';
import '../App.css'
import UserField from './UserField'

export default function CupidDetails({userData}) {
    const [balance, setBalance] = useState(0);
    const [working, setWorking] = useState(false);
    const [active, setActiveStatus] = useState(false);

    async function waitForPromiseFulfillment() {
        let data = await Promise.resolve({userData}.userData);

        setBalance(data['balance'])
        setWorking(data['working'])
        setActiveStatus(data['activated'])

    }

    waitForPromiseFulfillment()

    return(
        <>
        <div id="centeredDiv">
        <h2 id="interventionHeader">Your Metrics</h2>
        <UserField label='Balance' value={balance}></UserField>
        <UserField label='Working Status' value={working}></UserField>
        <UserField label='Account Status' value={active}></UserField>
        </div>
        
        </>
    )
}