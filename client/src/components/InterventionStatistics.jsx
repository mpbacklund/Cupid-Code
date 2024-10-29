import React, { useState, useEffect } from 'react';

export default function InterventionStatistics({ data }) {
    const [fulfilledInterventionsLast30Days, setFulfilledInterventionsLast30Days] = useState(0);
    const [uniqueDatersCount, setUniqueDatersCount] = useState(0);
    const [monthlyDatersCount, setMonthlyDatersCount] = useState(0);
    const [uniqueCupidsCount, setUniqueCupidsCount] = useState(0);
    const [monthlyCupidsCount, setMonthlyCupidsCount] = useState(0);

    useEffect(() => {
        // Update state variables when data changes
        setFulfilledInterventionsLast30Days(data.fulfilled_interventions_last_30_days || 0);
        setUniqueDatersCount(data.unique_daters_count || 0);
        setMonthlyDatersCount(data.monthly_daters_count || 0);
        setUniqueCupidsCount(data.unique_cupids_count || 0);
        setMonthlyCupidsCount(data.monthly_cupids_count || 0);
    }, [data]);

    return (
        <div id="centeredDiv">
            <h2 id="interventionHeader">App Statistics:</h2>
            <h3 id="interventionInfo">Fulfilled interventions in the last 30 days: {fulfilledInterventionsLast30Days}</h3>
            <h3 id="interventionInfo">Unique daters count: {uniqueDatersCount}</h3>
            <h3 id="interventionInfo">Monthly daters count: {monthlyDatersCount}</h3>
            <h3 id="interventionInfo">Unique cupids count: {uniqueCupidsCount}</h3>
            <h3 id="interventionInfo">Monthly cupids count: {monthlyCupidsCount}</h3> 
        </div>
    );
}
