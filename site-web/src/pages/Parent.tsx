import { NavLink } from "react-router-dom";
import styles from './Parent.module.css'

export default function Parent() : JSX.Element {
    return (
        <>
            <div className={styles.container}></div>
                <div className={styles.bloc}>
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
                        Adjust Constraints
                    </NavLink>
                </div>            
        </>
    );
}