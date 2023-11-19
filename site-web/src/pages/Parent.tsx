import React from "react"
import { NavLink } from "react-router-dom";

export default function Parent() : JSX.Element {
    return (
        <>
            <div>
                <NavLink to="/parent/tasks">Parent Tasks</NavLink>
            </div>            
        </>
    );
}