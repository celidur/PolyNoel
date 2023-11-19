import styles from "../assets/css/ToyCatalog.module.css"


export interface ToyCardProps {
    id:string;
    title: string;
    imgSrc: string;
    difficulty: number;
}
export default function ToyCard({id, title, imgSrc, difficulty, preview} : any) : JSX.Element {
    return(
        <div className={styles.toyCard} role={preview ? 'ToyCardPreview' : 'ToyCard'}>
            <h1>{title}</h1>
            <div className={styles.imageContainer}>
                <img src={imgSrc} alt={title}></img>
            </div>
            <DifficultySlider level={difficulty}/>
        </div>
    );
}

interface DifficultySliderProps {
    level:number;
}
function DifficultySlider({level}: DifficultySliderProps) : JSX.Element {
    return (
        <div className={styles.difficultySlider}>
            <p/>
        </div>
    )
}