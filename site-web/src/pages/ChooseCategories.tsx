import { useState } from "react";
import CategoriesSelect from "../components/CategoriesSelect";
import styles from './ChooseCategories.module.css'
import HTTPManager from "../assets/js/http_manager";

export default function ChooseCategories() : JSX.Element {
    const[input, setInput] = useState("");
    const [select, setSelect] = useState(false);
    const httpManager = new HTTPManager();
    const selectAll = () => {
        httpManager.selectAllCategories();
        setSelect(!select);
    }
    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.title}>
                    Choose Categories
                </div>
                <div className={styles.controls}>
                <button onClick={selectAll}>Add All</button>
                <input className={styles.input} value={input} placeholder="Search Category" onChange={(e)=>setInput(e.target.value)}></input>
                <button>Remove All</button>

                </div>
            </div>
            <CategoriesSelect input={input} select={select}></CategoriesSelect>
        </div>
        );
}