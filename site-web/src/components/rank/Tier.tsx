import DraggableToy from "./DraggableToy"
import styles from "../../assets/css/rankToys.module.css"
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../Constants";


export interface TierProps{
    level: number;
    toys : JSX.Element[];
    moveHandler : (id:string, origin:number, destination:number) => void;
}

export default function Tier({level, toys, moveHandler}:TierProps) :  JSX.Element {
    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.TOY_TO_RANK,
        drop: (item) => (processDrop(item)),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    function processDrop(item: any){
        console.log("Dropped : " + item.id + " in level " + level);
        moveHandler(item.id, item.rank, level);
    }

    function getColor() :string{
        switch(level){
            case 6:
                return "#f99898";
            case 5: 
                return "#f9bb98";
            case 4:
                return "#f9e498";
            case 3:
                return "#e6f998";
            case 2:
                return "#c9f998";
            case 1:
                return "#98f9a2";
            default:
                return "#000000";
        }
    };

    function getLabel(){
        switch(level){
            case 6:
                return "S";
            case 5: 
                return "A";
            case 4:
                return "B";
            case 3:
                return "B";
            case 2:
                return "C";
            case 1:
                return "D";
            default:
                return "F";
        }
    }

    return (
        <div className={styles.row}>
            <div className={styles.tierCell} style={{"backgroundColor":getColor()}}>
                <h1>{getLabel()}</h1>
            </div>
            <div ref={drop} className={styles.dropZone}>
                {toys.map((toy) => {
                    return <DraggableToy key={toy.props.id} id={toy.props.id} rank={level}/>
                })}
            </div>
        </div>
    );
}