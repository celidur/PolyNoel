import React, { useEffect, useState } from "react"
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { ItemTypes } from "../Constants";
import styles from "../assets/css/ToyCatalog.module.css"
import { ToyCardProps } from "../ToyCatalog/ToyCard";
import DraggableToyCard from "../ToyCatalog/DraggableToyCard";
import CustomDragLayer from "../ToyCatalog/CustomDragLayer";
import HTTPManager from "../assets/js/http_manager";
import image1 from "../assets/placeholder/toy1.webp"

const httpManager = new HTTPManager();
export default function ToyCatalog() : JSX.Element {
    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <TinderGame/>
        </DndProvider>
    );
}

async function loadToys(amount : number) : Promise<ToyCardProps[]> {
    const newToys : ToyCardProps[] = [];
    for(let i = 0; i < amount; i++) {
        const toy = await httpManager.getToyToSwipe();
        newToys.push({id:toy.id,title:toy.name, imgSrc:toy.image, difficulty:5});
    }
    return newToys;
}

function TinderGame() : JSX.Element {
    const initialLoad = async () =>{
        const newToys = await loadToys(2);
        setCards(newToys);
    }
    const [cards, setCards] = useState<ToyCardProps[]>(
        [{title:"Loading", imgSrc:"", id:"", difficulty:0},{title:"Loading", imgSrc:"", id:"", difficulty:0}]
    );
    const [switchFlag, setSwitchFlag] = useState<boolean>(false);
    useEffect(()=>{initialLoad()},[])
    useEffect(() => {
        const load = async() => {
            const newToys = await loadToys(2);
            cards.push(...newToys);
            setCards(cards);
        };
        if(switchFlag && cards) {
            console.log(cards);
            cards.shift();
            setCards(cards);
            setSwitchFlag(false);
            if (cards.length < 2) {
                load();
            }
        }
    }, [switchFlag]);

    return (
        <>
            <div className={styles.cardDragContainer}>
                <CustomDragLayer/>
                <RefuseSquare callback={setSwitchFlag} cards={cards}/>
                <div className={styles.cardStack}>
                    <DraggableToyCard {...cards[1]}/>
                    <DraggableToyCard {...cards[0]}/>
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
        <div ref={drop} className={styles.decisionSquare} style={
            {backgroundImage: `linear-gradient(to right,rgba(0,255,0,1),
                ${isOver?
                'rgba(0,255,0,1)': 'rgba(0,255,0,0)'}, 
                rgba(0,255,0,0)`}
        }/>
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
        <div ref={drop} className={styles.decisionSquare} style={            
            {backgroundImage: `linear-gradient(to right,rgba(255,0,0,0),
                ${isOver?
                'rgba(255,0,0,1)': 'rgba(255,0,0,0)'}, 
                rgba(255,0,0,1)`}
        }/>
            
    )
}