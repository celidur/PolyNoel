import Logo from '../assets/img/test-logo.png'
import { NavLink } from "react-router-dom";

export default function NavBar() : JSX.Element {
  return (
    <header>
        <div>
          <NavLink className="title" to="/">
            <img className="logo" src={Logo} alt="logo" />        
            PolyNoel
          </NavLink>          
        </div>
        <NavLink className="title" to="/parent">
          <button>Switch to Parent Mode</button> 
        </NavLink>          
    </header>
  );
}