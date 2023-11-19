import {type CSSProperties} from 'react'
import { XYCoord } from 'react-dnd';
import ToyCard, { ToyCardProps } from './ToyCard'
import styles from "../assets/css/ToyCatalog.module.css"

const getStyles: (initial:XYCoord|null, final:XYCoord|null)=>CSSProperties = (initial, final) => {
    let rotationAngle = 0;
    if(initial && final) {
        const deltaX = final.x - initial.x;
        rotationAngle = (deltaX/ window.screen.width) *90;
    }

    return{
        display: 'inline-block',
        transformOrigin:'center',
        transform: `rotate(${rotationAngle}deg)`,
        WebkitTransform: `rotate(${rotationAngle}deg)`,
    }
}
interface BoxDragPreviewProps {
    props: ToyCardProps;
    initialOffset: XYCoord | null;
    currentOffset: XYCoord | null;
}
export default function BoxDragPreview({props, initialOffset, currentOffset}: BoxDragPreviewProps) : JSX.Element  {
    console.log(props);
    return (
      <div className={styles.cardStack} style={getStyles(initialOffset, currentOffset)}>
        <ToyCard {...props} preview/>
      </div>
    )
};
