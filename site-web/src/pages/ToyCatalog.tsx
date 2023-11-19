import React, { useState } from "react"
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import { ItemTypes } from "../Constants";
import styles from "../assets/css/ToyCatalog.module.css"
import ToyCard, { ToyCardProps } from "../ToyCatalog/ToyCard";
//import nav bar

export default function ToyCatalog() : JSX.Element {
    return (
        <DndProvider backend={HTML5Backend}>
            <TinderGame/>
        </DndProvider>
    );
}


function TinderGame() : JSX.Element {

    const [current, setCurrent] = useState<ToyCardProps>(
        {id:"1",title:"Test", imgSrc:"test", difficulty:5});
    const [next, setNext] = useState<ToyCardProps>(
        {id:"2", title:"Test2", imgSrc:"test", difficulty:4}
    );
    const switchCards = () =>{
        const temp = current;
        setCurrent(next);
        setNext(temp);
    }

    return (
        <>
            <div className={styles.cardDragContainer}>
                <RefuseSquare/>
                <ToyCard {...current}/>
                <AcceptSquare callback={switchCards}/>
            </div>

        </>
    )
}

function accept(toy:ToyCardProps, callback : ()=>void) : void {
    console.log("Accepted : " + toy.title);
    callback();
}

function AcceptSquare({callback}: {callback: ()=>void}) : JSX.Element {
    const [,drop] = useDrop(
        () => ({
            accept: ItemTypes.TOYCARD,
            drop: (_,monitor) => accept(monitor.getItem(), callback),
        })
    )
    return(
        <div ref={drop} style={{width: "150px", backgroundColor: "limegreen"}}>

        </div>
    )
}

function refuse(toy:ToyCardProps) : void {
    console.log("Refused : " + toy.title)
}

function RefuseSquare() : JSX.Element {
    const [{isOver},drop] = useDrop(
        () => ({
            accept: ItemTypes.TOYCARD,
            drop: (_,monitor) => refuse(monitor.getItem()),
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        })
    )
    return(
        <div ref={drop} style={{width: "150px", backgroundColor: "red"}}>
            
        </div>
    )
}