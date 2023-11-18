import Logo from '../assets/img/test-logo.png'
import { NavLink } from "react-router-dom";
import NavBarCSS from './Navbar.module.css'

export default function NavBar() : JSX.Element {
  return (
    <header className={NavBarCSS.header}>
        <div>
          <NavLink className={NavBarCSS.title} to="/">
            <img className={NavBarCSS.logo} src={Logo} alt="logo" />        
            PolyNoel
          </NavLink>          
        </div>
        <NavLink className={NavBarCSS.title} to="/parent">
          <button>Switch to Parent Mode</button> 
        </NavLink>          
    </header>
  );
}