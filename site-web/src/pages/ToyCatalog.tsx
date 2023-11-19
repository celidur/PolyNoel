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

const MINIMUM_STACK_SIZE = 3;
const LOAD_AMOUNT = 5;

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
    const [cards, setCards] = useState<ToyCardProps[]>(
        [{title:"Loading", imgSrc:"", id:"", difficulty:0},{title:"Loading", imgSrc:"", id:"", difficulty:0}]
    );
    const initialLoad = async () =>{
        console.log("Initial load");
        const newToys = await loadToys(LOAD_AMOUNT);
        setCards(newToys);
    }

    const [switchFlag, setSwitchFlag] = useState<boolean>(false);
    useEffect(()=>{initialLoad()},[])
    useEffect(() => {
        const load = async() => {
            const newToys = await loadToys(LOAD_AMOUNT);
            cards.push(...newToys);
            setCards(cards);
        };
        if(switchFlag && cards) {
            cards.shift();
            if (cards.length < MINIMUM_STACK_SIZE) {
                load();
            }
            setCards(cards);
            setSwitchFlag(false);
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
    httpManager.updateToyLike({item_id:toy.id,like:true});
}
interface DecisionSquareProps {
    callback: (setSwitchFlag:boolean)=>void,
    cards: ToyCardProps[]
}
function AcceptSquare({callback, cards}: DecisionSquareProps) : JSX.Element {
    const [{isOver},drop] = useDrop(
        () => ({
            accept: ItemTypes.TOYCARD,
            drop: (item:ToyCardProps) => accept(item, callback),
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
    httpManager.updateToyLike({item_id:toy.id,like:false});
}

function RefuseSquare({callback, cards} : DecisionSquareProps) : JSX.Element {
    const [{isOver},drop] = useDrop(
        () => ({
            accept: ItemTypes.TOYCARD,
            drop: (item:ToyCardProps) => refuse(item, callback),
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