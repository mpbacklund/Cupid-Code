import React from 'react';
import { useState } from 'react';
import '../App.css'
import UserField from './UserField'

export default function UserDetails({userData}) {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    
    async function waitForPromiseFulfillment() { // This function keeps us from setting the values of our variables before they've been provided
        let data = await Promise.resolve({userData}.userData);

        setUsername(data['username'])
        setEmail(data['email'])
    }

    waitForPromiseFulfillment()

    return(

        <div id="centeredDiv">
            <UserField label='Username:' value={username}></UserField>
            <UserField label='Email:' value={email}></UserField>
        </div>
    )
}