import React from 'react';
import { useState } from 'react';
import '../App.css'

export default function ActiveInterventionDater({data}) {
    // TODO: rename file and component

    const [statusDisplay, setStatusDisplay] = useState("Complete");
    const [cupidStatus, setCupidStatus] = useState("Unassigned");
    const [money, setMoney] = useState("0.00");

    async function waitForPromiseFulfillment(data) {
        let intervenData = await Promise.resolve({data}.data);

        var fulfilled = intervenData["fulfilled"];
        var cupid = intervenData["cupid"];

        if(!fulfilled) {
            setStatusDisplay("In Progress");
        }

        if(cupid != null && !fulfilled) {
            setCupidStatus("On their way");
        } else if (cupid != null && fulfilled) {
            setCupidStatus("Moved on to another date");
        }


        setMoney(intervenData["total_payout"]);
    }

    waitForPromiseFulfillment(data)

    return(
        <div id="centeredDiv">
            <h2 id="interventionHeader">Intervention Status:</h2>
            <h3 id="interventionInfo">{statusDisplay}</h3>
            <h2 id="interventionHeader">Cupid Status:</h2>
            <h3 id="interventionInfo">{cupidStatus}</h3>
            <h2 id="interventionHeader">Cupid Cash Spent on Intervention:</h2>
            <div id="interventionDescriptor">
                <h3>${money}</h3>
            </div>

        </div>
    )

}