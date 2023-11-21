import { useEffect, useState } from 'react';
import styles from './BattlePassParent.module.css'
import HTTPManager, { Toy } from '../assets/js/http_manager';

export default function BattlePassParent() : JSX.Element {
    const [toys, setToys] = useState<Toy[]>([]);
    //const [toysId, setToysId] = useState<string[]>([]);
    //const [test, setTest] = useState<string[]>([]);
    const httpManager = new HTTPManager();
    useEffect(()=>{
        httpManager.getToys().then((fetchedToys)=>{
            setToys(fetchedToys);
        });
            
    }, []);

    return (
        <div  >
            <div >
                {toys.map((toy, i)=>{
                    return <img key={i} className={styles.image} src={toy.image} alt="image"/>
                })}
            </div>
        </div>
        );
}