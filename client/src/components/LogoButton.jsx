import React from 'react';

import '../App.css'

export default function LogoButton({ onClick }) {
    return (
        <img onClick={ onClick } className="logo" src="/heart.svg" alt="Cupid Heart Logo"/>
    )
}