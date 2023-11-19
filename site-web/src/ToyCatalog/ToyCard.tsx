import React, { useState } from "react"
import styles from "../assets/css/ToyCatalog.module.css"
import { useDrag } from "react-dnd";
import { ItemTypes } from "../Constants";


export interface ToyCardProps {
    id:string;
    title: string;
    imgSrc: string;
    difficulty: number;
}
export default function ToyCard({id, title, imgSrc, difficulty, preview} : any) : JSX.Element {
    return(
        <div className={styles.toyCard} role={preview ? 'ToyCardPreview' : 'ToyCard'}>
            <h1>{title}</h1>
            <img src={imgSrc} alt={title}></img>
            <DifficultySlider level={difficulty}/>
        </div>
    );
}

interface DifficultySliderProps {
    level:number;
}
function DifficultySlider({level}: DifficultySliderProps) : JSX.Element {
    return (
        <div className={styles.difficultySlider}>

        </div>
    )
}