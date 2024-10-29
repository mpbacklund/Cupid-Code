import React, { useState, useEffect } from 'react';
import '../../App.css'

function ManagerHome() {
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/manager_statistics/', {
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
        <>
        <div id="centeredDiv">
            <h2 id="interventionHeader">Business Overview: </h2>
            {statistics && (
                <div>
                    <h3 id="interventionInfo">Fulfilled interventions in the last 30 days: {statistics.fulfilled_interventions_last_30_days}</h3>
                    <h3 id="interventionInfo">Number of daters on the app: {statistics.unique_daters_count}</h3>
                    <h3 id="interventionInfo">Number of daters who used app this month: {statistics.monthly_daters_count}</h3>
                    <h3 id="interventionInfo">Number of cupids on the app: {statistics.unique_cupids_count}</h3>
                    <h3 id="interventionInfo">Number of cupids who used the app this month: {statistics.monthly_cupids_count}</h3>
                </div>
            )}
        </div>
        </>
    );

}

export default ManagerHome;
