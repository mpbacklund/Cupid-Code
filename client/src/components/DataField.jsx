import React from 'react';

import '../App.css';

export default function DataField({label, value}) {
    return(
        <div id="dataField">
            <h3 id="fieldText">{label}</h3>
            <h3 id="fieldText">{value}</h3>
        </div>
    )
}