import { useDrop } from "react-dnd";
import { ItemTypes } from "../../Constants";
import styles from "../../assets/css/rankToys.module.css";
import closedTrashLogo from "../../assets/img/closed-trash.svg";
import openedTrashLogo from "../../assets/img/open-trash.svg";


export default function DeleteSquare({deleteHandler}: {deleteHandler:(id:string, origin:number)=>void}): JSX.Element {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.TOY_TO_RANK,
        drop: (item : any) => {
            deleteHandler(item.id, item.rank);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }), [deleteHandler]);

    return (
        <div ref={drop} className={styles.deleteSquare} style={{backgroundColor: isOver ? "red" : "darkred"}}>
            <img 
                src={isOver ? openedTrashLogo : closedTrashLogo} 
                alt="delete" 
                className={isOver ? styles.openedTrashLogo : styles.closedTrashLogo}/>
        </div>
    );
}