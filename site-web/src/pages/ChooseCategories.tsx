import { useState } from "react";
import CategoriesSelect from "../components/CategoriesSelect";
import styles from './ChooseCategories.module.css'

export default function ChooseCategories() : JSX.Element {
    const[input, setInput] =  useState("");
    return (
        <div className={styles.container}>
            <div className={styles.header_container}>

                <div className={styles.title}>
                    Choose Categories
                </div>
                <input className={styles.input} value={input} placeholder="Search Category" onChange={(e)=>setInput(e.target.value)}></input>
            </div>
            <CategoriesSelect input={input}></CategoriesSelect>
        </div>
        );
}