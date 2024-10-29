import React from 'react';
import ActiveInterventionDater from "../../components/ActiveInterventionDater";

function Intervention() {

    // Get intervention information
    async function getIntervention() {
        const response = await fetch('/get_intervention/', {
            method: 'GET'
        });

        return await response.json();
    }

    return(
        <>
            <ActiveInterventionDater data={getIntervention()}></ActiveInterventionDater>
        </>
    )
}

export default Intervention;