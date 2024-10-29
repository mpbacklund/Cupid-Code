import React from 'react';
import '../App.css';

function InterventionPopUp({ popUpHidden, displayText }) {
  
  const [hidden, setHidden] = popUpHidden;

  return (
    <div className={hidden ? 'popUpWrapper popUpClosed' : 'popUpWrapper'}>
      <div className='interventionPopUp'>
        <div id='interTitle'>{displayText}</div>
        <button id='interButton' onClick={() => setHidden(!hidden)}>OK</button>
      </div>
    </div>
  );
}

export default InterventionPopUp;