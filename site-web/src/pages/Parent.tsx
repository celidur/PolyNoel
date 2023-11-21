import { NavLink } from "react-router-dom";
import styles from './Parent.module.css'

export default function Parent() : JSX.Element {
    return (
        <>
            <div className={styles.container}>
                <NavLink className={styles.feature} to="/parent/tasks">
                    Tasks
                </NavLink>
                <NavLink className={styles.feature} to="/parent/battlepass">
                    BattlePass
                </NavLink>
                <NavLink className={styles.feature} to="/parent/categories">
                    Filter Categories
                </NavLink>
                <NavLink className={styles.feature} to="/parent/settings">
                    Settings
                </NavLink>
            </div>            
        </>
    );
}