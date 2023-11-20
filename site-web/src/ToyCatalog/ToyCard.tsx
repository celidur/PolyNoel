import styles from "../assets/css/ToyCatalog.module.css"
import starLogo from "../assets/img/star.svg"

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
 function getDifficultyClassName(level: number) : string{
    switch(level) {
        case 1:
            return styles.color1;
        case 2:
            return styles.color1;
        case 3:
            return styles.color2;
        case 4:
            return styles.color2;
        case 5:
            return styles.color3;
        default:
            return styles.color1;
    }
}

function getStars(difficulty: number) : JSX.Element[] {
    const stars = [];
    for(let i = 0; i < difficulty; i++) {
        stars.push(<img key={i} src={starLogo} alt="star" className={getDifficultyClassName(difficulty)}/>);
    }
    return stars;
}

interface DifficultySliderProps {
    level:number;
}
function DifficultySlider({level}: DifficultySliderProps) : JSX.Element {
    return (
        <div className={styles.difficultySlider}>
            <h2>Difficulty : </h2>
            {getStars(level)}
        </div>
    )
}