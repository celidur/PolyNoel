import { NavLink } from "react-router-dom";
import styles from './Parent.module.css'

export default function Parent() : JSX.Element {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.pageTile}>
                    Settings
                </div>
                <NavLink className={styles.feature} to="/parent/tasks">
                    Edit Tasks
                </NavLink>
                <NavLink className={styles.feature} to="/parent/battlepass">
                    Edit BattlePass
                </NavLink>
                <NavLink className={styles.feature} to="/parent/categories">
                    Filter Categories
                </NavLink>
                <NavLink className={styles.feature} to="/parent/settings">
                    Ajust Price Range
                </NavLink>
            </div>            
        </>
    );
}