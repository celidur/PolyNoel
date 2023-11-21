import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import styles from '../assets/css/rankToys.module.css';
import TierList from '../components/rank/TierList';
import UncategorisedToys from '../components/rank/UncategorisedToys';
import DraggableToy from '../components/rank/DraggableToy';
import DeleteSquare from '../components/rank/DeleteSquare';
import HTTPManager from '../assets/js/http_manager';

const httpManager = new HTTPManager();

export default function RankToys() : JSX.Element {
    const [toys, setToys] = useState<JSX.Element[][]>([[],[],[],[],[],[],[]]);

    async function loadToys() : Promise<void> {
        const toysAndScore = await httpManager.getToys();
        const toysArray : JSX.Element[][] = [[],[],[],[],[],[],[]];
        for (const toy of toysAndScore) {
            const toyElement = <DraggableToy id={toy.id} rank={toy.score}/>;
            toysArray[toy.score].push(toyElement);
        }
        setToys(toysArray);
    }

    useEffect(() => {
        loadToys();
    }, []);

    const moveToys = (id:string, origin:number, destination:number) => {
        if (origin === destination) return;
        setToys(prevToys=>{
            const newToys = prevToys.map(row => [...row]); // to trigger a re-render

            const toyToMove = newToys[origin].find((toy) => toy.props.id === id);
    
            if (toyToMove) {
                newToys[destination] = [...newToys[destination], toyToMove];
                newToys[origin] = newToys[origin].filter((toy) => toy.props.id !== id);
            }
            httpManager.updateRank({item_id:id, rank:destination});
            return newToys;
    });
    }

    const deleteToy = (id:string, origin:number) => {
        setToys(prevToys=>{
            const newToys = prevToys.map(row => [...row]); // to trigger a re-render
            newToys[origin] = newToys[origin].filter((toy) => toy.props.id !== id);
            httpManager.removeLikeToy(id);
            return newToys;
        });
    }

    return(
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
            <div className={styles.mainPage}>
                <h1 className={styles.title}>Rank your wishes</h1>
                <div className={styles.content}>
                    <TierList tierTable={toys.slice(1)} moveHandler={moveToys}/>
                    <UncategorisedToys toys={toys[0]} moveHandler={moveToys}/>
                    <DeleteSquare deleteHandler={deleteToy}/>
                </div>
            </div>
        </DndProvider>
    );
}
