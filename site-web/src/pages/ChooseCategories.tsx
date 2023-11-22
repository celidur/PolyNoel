import { useState } from "react";
import CategoriesSelect from "../components/CategoriesSelect";
import styles from './ChooseCategories.module.css'
import HTTPManager from "../assets/js/http_manager";

export default function ChooseCategories() : JSX.Element {
    const[input, setInput] = useState("");
    const [select, setSelect] = useState(false);
    const httpManager = new HTTPManager();
    const selectAll = () => {
        httpManager.selectAllCategories().then(()=>{
            setSelect(!select);
        });
    }
    return (
        <div className={styles.container}>
            <a className={styles.returnButton} href="/parent">Retour</a>
            <div className={styles.header_container}>

                <div className={styles.title}>
                    Choose Categories
                </div>
                <div className={styles.controls}>
                <div className={styles.button1Pos}><button className={styles.addAll} onClick={selectAll}>Select All</button></div>    
                
                <input className={styles.input} value={input} placeholder="Search Category" onChange={(e)=>setInput(e.target.value)}></input>

                <div className={styles.button2Pos}>
                <button className={styles.removeAll}>Remove All</button>
                </div>

                </div>
            </div>
            <CategoriesSelect input={input} select={select}></CategoriesSelect>
        </div>
        );
}