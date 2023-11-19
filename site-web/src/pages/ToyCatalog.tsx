import React, { useEffect, useState } from "react"
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

function loadToys(amount : number) : ToyCardProps[] {
    return [
        {id:"1",title:"Test1", imgSrc:"test", difficulty:5},
        {id:"2", title:"Test2", imgSrc:"test", difficulty:4},
        {id:"3", title:"Test3", imgSrc:"test", difficulty:4}
    ]
}

function TinderGame() : JSX.Element {
    const [cards, setCards] = useState<ToyCardProps[]>(loadToys(2));
    const [switchFlag, setSwitchFlag] = useState<boolean>(false);
    useEffect(() => {
        console.log("Switch flag changed");
        if(switchFlag) {
            console.log("Switching cards");
            console.log(cards);
            cards.shift();
            if (cards.length < 2) {
                cards.push(...loadToys(5));
            }
            setCards(cards);
            setSwitchFlag(false);
        }
    }, [switchFlag]);

    return (
        <>
            <div className={styles.cardDragContainer}>
                <RefuseSquare callback={setSwitchFlag} cards={cards}/>
                <div className={styles.cardStack}>
                    <ToyCard {...cards[1]}/>
                    <ToyCard {...cards[0]}/>
                </div>
                <AcceptSquare callback={setSwitchFlag} cards={cards}/>
            </div>

        </>
    )
}

function accept(toy:ToyCardProps, callback :  (setSwitchFlag:boolean)=>void) : void {
    console.log("Accepted : " + toy.title);
    callback(true);
}
interface DecisionSquareProps {
    callback: (setSwitchFlag:boolean)=>void,
    cards: ToyCardProps[]
}
function AcceptSquare({callback, cards}: DecisionSquareProps) : JSX.Element {
    const [{isOver},drop] = useDrop(
        () => ({
            accept: ItemTypes.TOYCARD,
            drop: () => accept(cards[0], callback),
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        })
    )
    return(
        <div ref={drop} style={{width: "150px", backgroundColor: isOver?"limegreen" : "lightgreen"}}>

        </div>
    )
}

function refuse(toy:ToyCardProps, callback : (setSwitchFlag:boolean)=>void) : void {
    console.log("Refused : " + toy.title);
    callback(true);
}

function RefuseSquare({callback, cards} : DecisionSquareProps) : JSX.Element {
    const [{isOver},drop] = useDrop(
        () => ({
            accept: ItemTypes.TOYCARD,
            drop: () => refuse(cards[0], callback),
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            })
        })
    )
    return(
        <div ref={drop} style={{width: "150px", backgroundColor: isOver?"red":"pink"}}>
            
        </div>
    )
}