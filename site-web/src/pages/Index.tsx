import '../assets/css/indexStyles.css'
//import { NavLink } from "react-router-dom";

import React from "react"

export default function Index() : JSX.Element {
    return (
        <div>
           {/* Hello World! */}
            <div className='countdown'>
                <p>Time left to complete tasks</p>
                <p>xx:xx:xx</p>
            </div>
            <div id="battleBarContainer">
                <span>naughty</span>
                <div className='battleBar'></div>
                <span>nice</span>
            </div>
        </div>
    );
}