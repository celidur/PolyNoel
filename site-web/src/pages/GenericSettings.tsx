
import { useState } from "react";
import HTTPManager from "../assets/js/http_manager";
import ChangePrice from "../components/ChangePrice";
import { MonthsLeft } from "./ParentTaskPage";
import styles from "./GenericSettings.module.css"

export default function GenericSettings() : JSX.Element {
    const [countdownData, setCountdownData] = useState<{ month: number; day: number }>({ month: 0, day: 0 });
    console.log(countdownData);
    const httpManager = new HTTPManager();
    const resetSetings = () => {
        httpManager.selectAllCategories().then(()=>{
            console.log("test");
        });
        httpManager.setPriceBorn({inferior:0, superior:4294967295});
    }
    return (
        <>
        <div className={styles.bgstripes}></div>
        <div className={styles.settings_container}>
            <ChangePrice></ChangePrice>
            <div className={styles.formContainer}>
                    <MonthsLeft setCountdownData={setCountdownData} />
            </div>
            <button className={styles.button} onClick={resetSetings}>Reset Settings</button>
        </div>
        </>
    );
}