import styles from "./TierMaker.module.css"
import { Toy } from '../assets/js/http_manager';
import { useState } from "react";

type TierProps = {
    index: number,
    score: number,
    toy? : Toy,
    onImageClick : (id : number) => void 
}

export default function TierMaker(props : TierProps) : JSX.Element {
    const [score, setScore] = useState<number>(props.score);
    const changeScore = (score : number) => {
        setScore(score)
    }
    return (
    <div className={styles.container}>
        <input type="number" value={score} className={styles.score} onChange={(e)=>{changeScore(parseInt(e.target.value))}}/>
        <img className={styles.image} src={props.toy?.image || ""} alt="no-image" onClick={()=>props.onImageClick(props.index)}></img>
    </div>
  );
}