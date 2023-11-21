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
            const sorted= fetchedToys.sort((a : ToyWithScore,b : ToyWithScore) : number =>{
                if(a.score > b.score)
                    return  -1;
                else if(a.score < b.score)
                    return 1;
                else 
                    return 0;
                })
            setToys(sorted);
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

    function getColor(score: number) :string{
        switch(score){
            case 6:
                return "#f99898";
            case 5: 
                return "#f9bb98";
            case 4:
                return "#f9e498";
            case 3:
                return "#e6f998";
            case 2:
                return "#c9f998";
            case 1:
                return "#98f9a2";
            default:
                return "#000000";
        }
    };



    return (
        <div className={styles.container}  >
            <div className={styles.image_container}>
                {toys.map((toy, i)=>{
                    return <div style={{"backgroundColor": getColor(toy.score)}} className={styles.item}>
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