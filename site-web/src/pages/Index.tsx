import './indexStyles.css'
// import Pattern from '../assets/img/candycane.jpg'
//import { NavLink } from "react-router-dom";

import React from "react"

export default function Index() : JSX.Element {
    return (
        <div>
           {/* Hello World! */}
            <div className='countdown'>
                <p>Time left to complete tasks:</p>
                <p>xxdays:xxhours:xxminutes</p>
            </div>
            <div id="battleBarContainer">
                <div className='battleBar'></div>
                {/* <img className='pattern' src={Pattern} alt="candycane pattern"></img> */}
                <div id="labelsContainer">
                    <p className="naughty">Naughty</p>
                    <p className="nice">Nice</p>
                </div>
            </div>
            <div id='bottomContainer'>
                <div id='wishlistContainer'>
                    <p className="wishlist">What I would like</p>
                    <div className='wishlistBox'></div>
                </div>
                <div id='todoListContainer'>
                    <p className="todoList">My To Do list</p>
                    <div className='todoListBox'></div>
                    <div className='todoListBox'></div>
                    <div className='todoListBox'></div>
                </div>
            </div>
        </div>
    );
}