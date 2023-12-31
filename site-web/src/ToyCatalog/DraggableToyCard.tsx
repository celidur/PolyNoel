import React, { useEffect } from "react"
import styles from "../assets/css/ToyCatalog.module.css"
import { useDrag } from "react-dnd";
import { ItemTypes } from "../Constants";
import ToyCard from "../ToyCatalog/ToyCard";
import { ToyCardProps } from "../ToyCatalog/ToyCard";
import { getEmptyImage } from 'react-dnd-html5-backend'




export default function DraggableToyCard(props : ToyCardProps) : JSX.Element {
    const [{isDragging}, drag, preview] = useDrag(() => ({
        type: ItemTypes.TOYCARD,
        item: props,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }), [props]);

    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true })
      }, [])
    return(
        <div ref={drag} className={styles.toyCard} style={{opacity: isDragging? "0": "1",}}>
            <ToyCard {...props}/>
        </div>
    );
}
