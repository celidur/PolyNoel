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
        let rgb:string;
        switch(level){
            case 6:
                rgb= "#f99898";
                break;
            case 5: 
                rgb= "#f9bb98";
                break;
            case 4:
                rgb= "#f9e498";
                break;
            case 3:
                rgb= "#e6f998";
                break;
            case 2:
                rgb= "#c9f998";
                break;
            case 1:
                rgb= "#98f9a2";
                break;
            default:
                return "#000000";
        }
        if(isOver){
            return rgb;
        }
        return rgb + "90";

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
                return "C";
            case 2:
                return "D";
            case 1:
                return "F";
            default:
                return "INVALID";
        }
    }

    return (
        <div className={styles.row}>
            <div className={styles.tierCell} style={{"backgroundColor":getColor()}}>
                <h1>{getLabel()}</h1>
            </div>
            <div ref={drop} className={styles.dropZone} style={isOver?{"backgroundColor":"lightgrey"}:{}}>
                {toys.map((toy) => {
                    return <DraggableToy key={toy.props.id} id={toy.props.id} rank={level}/>
                })}
            </div>
        </div>
    );
}