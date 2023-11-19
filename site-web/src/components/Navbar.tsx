import Logo from '../assets/img/gift.svg'
import SwitchImg from '../assets/img/switch.svg'
import { NavLink } from "react-router-dom";
import styles from './Navbar.module.css'
import { useState } from 'react';


export default function NavBar() : JSX.Element {
  const [isParentMode, setMode] = useState<Boolean>(false);
  return (
    <header className={styles.header}>        
        <NavLink className={styles.title} to="/"
          onClick={()=> setMode(false)}>
          <img className={styles.logo} src={Logo} alt="logo" />        
          <span className={styles.nav_title}>PolyNoel</span>
        </NavLink>                  

        <NavLink className={styles.parent_mode} to={isParentMode ? "/" : "/parent"}
          onClick={()=>setMode(!isParentMode)}
        >
             {isParentMode ? <>Parent</> : <>Kid</> } Mode
            <img className={styles.switch_img} src={SwitchImg} alt="switch"></img>                    
        </NavLink>          
    </header>
  );
}