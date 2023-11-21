import { useEffect, useState } from "react";
import styles from './ChangePrice.module.css'
import HTTPManager from "../assets/js/http_manager";

export default function ChangePrice() : JSX.Element {
    const[min, setMin] =  useState(0);
    const[max, setMax] =  useState(Number.POSITIVE_INFINITY);

    useEffect(()=>{
        httpManager.getPriceBorn().then((priceBorn)=>{
            setMin(priceBorn.inferior/100);
            setMax(priceBorn.superior/100);
        }).catch(()=>{
            setMin(0);
            setMax(4294967295);
        });
    }, [])

    const httpManager = new HTTPManager();
    const changeMin = (min : number) => {
        if(!Number.isNaN(min) && !Number.isNaN(max)){
            httpManager.setPriceBorn({inferior : min*100, superior : max*100});
        }
        setMin(min);
    }

    const changeMax = (max : number) => {
        if(!Number.isNaN(min) && !Number.isNaN(max)){
            httpManager.setPriceBorn({inferior : min*100, superior : max*100});
        }
        setMax(max);
    }
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.subtitle}>Min Price</div>
                <input className={styles.input} type="number" value={min || min.toString()} onChange={(e)=>changeMin(parseInt(e.target.value))} min={0} ></input>
            </div>
            <div>
            <div className={styles.subtitle}>Max Price</div>
            <input className={styles.input} type="number" value={max || max.toString()} onChange={(e)=>changeMax(parseInt(e.target.value))} min={min} ></input>
            </div>
        </div>
        );
}