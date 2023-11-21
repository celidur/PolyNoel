import { useDrag } from "react-dnd";
import { useState, useEffect } from "react";
import HTTPManager from "../../assets/js/http_manager";
import { ItemTypes } from "../../Constants";
import styles from "../../assets/css/rankToys.module.css";

const httpManager = new HTTPManager();

export interface DraggableToyProps {
    id : string;
    rank? : number;
}
export default function DraggableToy({id, rank}: DraggableToyProps) :  JSX.Element {
    const [image, setImage] = useState<string>("");
    const [{isDragging}, drag] = useDrag(() => ({
        type: ItemTypes.TOY_TO_RANK,
        item: {id, rank},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }), [id]);

    useEffect(() => {
        getImage();
    }, [id]);

    const getImage : () => void = async() => {
        const toy = await httpManager.getToyById(id);
        setImage(toy.image);
    }
    return (
        <div className={styles.draggableToy} ref={drag} style={{opacity:isDragging? 0:1}}>
            <img src={image}/>
        </div>
    )
}