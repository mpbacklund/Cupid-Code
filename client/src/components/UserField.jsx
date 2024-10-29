import React from 'react';

import '../App.css';

export default function UserField({label, value}) {
    var displayValue;

    if(value == "") {
        displayValue = value;
    } else if(value == 0.00) {
        displayValue = value;
    } else if(value == true) {
        displayValue = "Active";
    } else if (value == false) {
        displayValue = "Inactive";
    } else {
        displayValue = value;
    }

    return(
        <div id="userField">
            <h3 id="fieldText">{label}</h3>
            <h3 id="fieldText">{displayValue}</h3>
        </div>
    )
}