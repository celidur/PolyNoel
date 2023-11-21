import Tier from "./Tier";
import styles from "../../assets/css/rankToys.module.css";

const N_TIERS = 6;
export interface TierListProps{
    tierTable : JSX.Element[][];
    moveHandler : (id:string, origin:number, destination:number) => void;
}

export default function TierList({tierTable, moveHandler}:TierListProps) :  JSX.Element {
    return (
        <>
        <h1 className={styles.title}>Rank your wishes</h1>
        <div className={styles.table}>
            {[...Array(N_TIERS)].map((_, i) => <Tier key={N_TIERS-i} level={N_TIERS-i} toys={tierTable[N_TIERS-i-1]} moveHandler={moveHandler}/>)}
        </div>
        </>
    )
}