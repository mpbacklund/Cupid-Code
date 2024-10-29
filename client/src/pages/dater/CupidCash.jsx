import React from 'react';
import { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

function CupidCash() {
    const cookies = new Cookies(null, { path: '/' });
    const [balance, setBalance] = useState(0);
    const [budget, setBudget] = useState(0);

    useEffect(() => {
        getUser()
    }, []);

    async function getUser() {
        const response = await fetch('/me/', {
            method: 'GET'
        });

        const userData = await response.json();
        setBalance(userData['balance'])
        setBudget(userData['budget'])
    }

    async function addToBalance() {
        var newBalance = parseFloat(balance) + 10;

        await fetch('/update_me/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get("csrftoken")
            },
            body: JSON.stringify({ "field": "balance", "value": newBalance })
        });

        getUser();
    }

    async function increaseBudget() {
        var newBudget = parseFloat(budget) + 10;

        if (newBudget > balance) {
            //TODO: Have this return a specific error
            return;
        }

        await fetch('/update_me/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get("csrftoken")
            },
            body: JSON.stringify({ "field": "budget", "value": newBudget })
        });

        getUser();
    }

    return(
        <>
            
            <div id="cashBox">
                <h3>Your Total Cupid Cash:</h3>
                <h1>${balance}</h1>
                <button className="cupid-code-button" id="cashButton" onClick={addToBalance}>
                    <p id="textOnBlueButton">Upload $10</p>
                </button>

            </div>

            <div id="cashBox">
            <h3>Budget for next date:</h3>
            <h1>${budget}</h1>
            <button className="cupid-code-button" id="cashButton" onClick={increaseBudget}>
                <p id="textOnBlueButton">Add $10</p>
            </button>
            
        </div>
        </>
    )
}

export default CupidCash;