import { NavLink } from "react-router-dom";
import styles from './Parent.module.css'

export default function Parent() : JSX.Element {
    return (
        <>
            <div className={styles.container}>
                <NavLink className={styles.feature} to="/parent/tasks">
                    Tasks
                </NavLink>
                <NavLink className={styles.feature} to="#">
                    BattlePass
                </NavLink>
                <NavLink className={styles.feature} to="#">
                    View Rankings
                </NavLink>
            </div>            
        </>
    );
}