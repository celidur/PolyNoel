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
export default function ToyCard({id, title, imgSrc, difficulty} : ToyCardProps) : JSX.Element {
    const [{isDragging}, drag] = useDrag(() => ({
        type: ItemTypes.TOYCARD,
        item: {id, title, imgSrc, difficulty},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))
    return(
        <div ref={drag} className={styles.toyCard} style={{opacity: isDragging? "0": "1",}}>
            <h1>{title}</h1>
            <img src={imgSrc} alt="test"></img>
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