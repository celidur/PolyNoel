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

import checkLogo from "../assets/img/check-mark.svg";
import crossLogo from "../assets/img/cross.svg";

const MINIMUM_STACK_SIZE = 3;
const parentPrice = 10000; //TODO implement parent price maximum

const clamp = (num:number, min:number, max:number) => Math.min(Math.max(num, min), max);

const httpManager = new HTTPManager();
export default function ToyCatalog() : JSX.Element {
    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <TinderGame/>
        </DndProvider>
    );
}

async function loadToys(amount : number =1) : Promise<ToyCardProps[]> {
    const newToys : ToyCardProps[] = [];

    try{
        for(let i = 0; i < amount; i++) {
            const toy = await httpManager.getToyToSwipe();

            // TO AJUST: once price range error is fixed
            // const priceBorn = await httpManager.getPriceBorn();
            // const priceMin = priceBorn.inferior;
            // const priceMax = priceBorn.superior;

            // let difficulty;
            // if (toy.price <= priceMax) {
            //     const range = priceMax - priceMin;
            //     difficulty = 1 + ((toy.price - priceMin) / range) * 4;
            // } else 
            //     difficulty = 5;
            // difficulty = Math.round(clamp(difficulty, 1, 5)); 

            const difficulty = Math.round(clamp((toy.price / parentPrice) * 5, 1, 5)); //TODO implement parent price maximum
            newToys.push({id:toy.id,title:toy.name, imgSrc:toy.image, difficulty:difficulty});
        }
        return newToys;
    }catch(e){
        return [];
    }
}

function TinderGame() : JSX.Element {
    const [cards, setCards] = useState<ToyCardProps[]>(
        [{title:"Loading", imgSrc:"", id:"", difficulty:0},{title:"Loading", imgSrc:"", id:"", difficulty:0}]
    );
    const initialLoad = async () =>{
        console.log("Initial load");
        const newToys = await loadToys(MINIMUM_STACK_SIZE);
        setCards(newToys);
    }

    const [switchFlag, setSwitchFlag] = useState<boolean>(false);
    useEffect(()=>{initialLoad()},[])
    useEffect(() => {
        const load = async() => {
            while(cards.length < MINIMUM_STACK_SIZE) {
                const newToys = await loadToys();
                cards.push(...newToys);
                setCards(cards);
            }
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
            <div className={styles.tinderGame}>
                <a className={styles.returnButton} href="/">Retour</a>
                
                <h1>Do you want this?</h1>
                <div className={styles.cardDragContainer}>
                    <CustomDragLayer/>
                    <RefuseSquare callback={setSwitchFlag} cards={cards}/>
                    <div className={styles.cardStack}>
                        <DraggableToyCard {...cards[1]}/>
                        <DraggableToyCard {...cards[0]}/>
                    </div>
                    <AcceptSquare callback={setSwitchFlag} cards={cards}/>
                </div>
                <div className={styles.buttonInterface}>
                    <button className={styles.refuseButton} onClick={()=>{refuse(cards[0], setSwitchFlag)}}><img src={crossLogo}/></button>
                    <button className={styles.acceptButton} onClick={()=>{accept(cards[0], setSwitchFlag)}}><img src={checkLogo}/></button>
                </div>
            </div>
        </>
    )
}

function accept(toy:ToyCardProps, callback :  (setSwitchFlag:boolean)=>void) : void {
    console.log("Accepted : " + toy.title);
    callback(true);
    httpManager.updateToyLike({item_id:toy.id,like:true}).catch(()=>{console.log("Update Toy Failed")});
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
    httpManager.updateToyLike({item_id:toy.id, like:false}).catch(()=>{console.log("Update Toy Failed")});
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