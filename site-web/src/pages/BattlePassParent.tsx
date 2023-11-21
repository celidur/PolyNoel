import { useEffect, useState } from 'react';
import styles from './BattlePassParent.module.css'
import HTTPManager, { Toy, ToyWithScore } from '../assets/js/http_manager';
import TierMaker from '../components/TierMaker';
import ChangePrice from '../components/ChangePrice';

type TierInfo = {
    score: number,
    toy? : Toy,
}

export default function BattlePassParent() : JSX.Element {
    const [toys, setToys] = useState<ToyWithScore[]>([]);
    const [tiers, setTiers] = useState<TierInfo[]>([])
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);
    
    const httpManager = new HTTPManager();
    useEffect(()=>{
        httpManager.getToys().then((fetchedToys)=>{
            setToys(fetchedToys);
        });

            
    }, []);

    const createTier = () => {

        setTiers([...tiers, {score : 1, toy : undefined}])
    }

    const onTierImageClick = (index : number) => {
        setSelectedIndex(index);
    }

    const onClickSwipedImage = (toy : Toy) => {
        if(selectedIndex !== -1){
            const newTiers = [...tiers];
            newTiers[selectedIndex].toy = toy;
            setTiers(newTiers);
            setSelectedIndex(-1);
            
        }
    }



    return (
        <div className={styles.container}  >
            <div className={styles.image_container}>
                {toys.map((toy, i)=>{
                    return <div className={styles.item}>
                            <img key={i} className={`${styles.image} ${selectedIndex === -1? "" : styles.select_image}`} 
                            src={toy.image} alt="image" onClick={()=>onClickSwipedImage(toy)}/>
                            <div className={styles.bonus_info}>
                                
                                {toy.price/100}$
                            </div>
                        </div> 
                })}
            </div>

            <div className={styles.tier_container}>
                <div className={styles.title}>Battle Pass Tiers</div>
                {
                    tiers.map((tier, index)=>{
                        return <TierMaker key={index} index={index} score={tier.score} toy={tier.toy} onImageClick={onTierImageClick} ></TierMaker>  
                    })
                }
                <button onClick={createTier}>Add new Tier</button>
            </div>
        </div>
        );
}