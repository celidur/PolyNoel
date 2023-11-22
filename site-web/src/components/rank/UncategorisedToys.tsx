import styles from "../../assets/css/rankToys.module.css";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../Constants";
import DraggableToy from "./DraggableToy";

export interface UncategorisedToysProps{
    toys : JSX.Element[];
    moveHandler : (id:string, origin:number, destination:number) => void;
}

export default function UncategorisedToys({toys, moveHandler}: UncategorisedToysProps) :  JSX.Element {
    const [{isOver}, drop] = useDrop(() => ({
        accept: ItemTypes.TOY_TO_RANK,
        drop: (item) => (processDrop(item)),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }));

    const processDrop = (item: any) => {
        moveHandler(item.id, item.rank, 0);
    }
    return (
        <div className={styles.wtfContainer}>
            <div ref={drop} className={styles.noTierZone}>
                {toys.map((toy) => {
                    return <DraggableToy key={toy.props.id} id={toy.props.id} rank={0}/>
                })}
            </div>
        </div>

    )
}