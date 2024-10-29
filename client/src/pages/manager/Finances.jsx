import React, { useState, useEffect } from 'react';
import '../../App.css'

function Finances() {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/financial_statistics/', {
                    method: 'GET'
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setStatistics(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, []);

    return (
        <div id="centeredDiv">
            <h2 id="interventionHeader">Cupid Code Financial Statistics: </h2>
            {statistics && (
                <div>
                    <h3 id="interventionInfo">Total amount transferred in interventions in the last 30 days: ${statistics.total_payout}</h3>
                    <h3 id="interventionInfo">Total amount from interventions given to Cupids: ${statistics.cupid_payout}</h3>
                    <h3 id="interventionInfo">Total amount from interventions we kept: ${statistics.our_payout}</h3>
                    <h3 id="interventionInfo">Total Cupid Cash bought but not used: ${statistics.total_unused_cupid_cash}</h3>
                </div>
            )}
        </div>
    );
}

export default Finances;
