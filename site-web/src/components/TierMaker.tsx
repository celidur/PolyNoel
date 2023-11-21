import styles from "./TierMaker.module.css"
import { Toy } from '../assets/js/http_manager';
import { useState } from "react";

type TierProps = {
    index: number,
    score: number,
    toy? : Toy,
    onImageClick : (id : number) => void 
    onDeleteClick : (id : string | undefined) => void 
}

export default function TierMaker(props : TierProps) : JSX.Element {
    const [score, setScore] = useState<number>(props.score);
    const changeScore = (score : number) => {
        setScore(score)
    }
    return (
    <div className={styles.container}>
        <div className={styles.point_styles}>
            <div className={styles.points_title}>Points Needed</div>
            <div className={styles.control}>
                <div className={styles.control_button} onClick={()=>{changeScore(score-1)}}>&#x25C0;</div>
                <div className={styles.control_score}>{score}</div>
                {/* <input type="number" value={score} className={styles.score} /> */}
                <div className={styles.control_button} onClick={()=>{changeScore(score+1)}}>&#x25B6;</div>


            </div>
        </div>
        {/* <button onClick={()=>props.onDeleteClick(props.toy?.id)} >delete</button> */}
        <div className={styles.draggableToy}>
            <img className={styles.image} src={props.toy?.image || ""} alt="no-image" onClick={()=>props.onImageClick(props.index)}></img>
        </div>
    </div>
  );
}