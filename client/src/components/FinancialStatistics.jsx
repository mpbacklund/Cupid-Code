import React from 'react';

export default function FinancialStatistics({ data }) {
    

    return (
        <div id="centeredDiv">
            <h2 id="interventionHeader">Financial Statistics:</h2>
            <h3 id="interventionInfo">Total amount transferred in interventions: ${data['total_payout'].toFixed(2)}</h3>
            <h3 id="interventionInfo">Total amount from interventions given to Cupids: ${cupidPayout.toFixed(2)}</h3>
            <h3 id="interventionInfo">Total amount from interventions we kept: ${ourPayout.toFixed(2)}</h3>
            <h3 id="interventionInfo">Total Cupid Cash bought but not used: ${totalUnusedCupidCash.toFixed(2)}</h3>
        </div>
    );
}
