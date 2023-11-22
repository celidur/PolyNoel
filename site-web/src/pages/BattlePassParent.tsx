import { useEffect, useState } from 'react';
import styles from './BattlePassParent.module.css'
import HTTPManager, { Toy, ToyWithScore } from '../assets/js/http_manager';
import TierMaker from '../components/TierMaker';
import ChangePrice from '../components/ChangePrice';
import Index from './Index';

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

        httpManager.getSantaPass().then((santapasses)=>{
            const tierInfo : TierInfo[] = santapasses.map((pass)=> { return {score: pass.points, toy : pass.toy}  });
            setTiers(tierInfo);
        }).catch(()=>{console.log("tiers load failed")});

            
    }, []);

    const createTier = () => {

        setTiers([...tiers, {score : 1, toy : undefined}])
    }

    const onTierImageClick = (index : number) => {
        setSelectedIndex(index);
    }

    const onTierDeleteClick = (index : string | undefined) => {
        if(!index)
            return;
        httpManager.deleteInSantaPass(index).then(()=>{
            httpManager.getSantaPass().then((santapasses)=>{
                const tierInfo : TierInfo[] = santapasses.map((pass)=> { return {score: pass.points, toy : pass.toy}  });
                setTiers(tierInfo);
            }).catch(()=>{console.log("tiers load failed")});
        }).catch(()=>{console.log("delete failed")});
    }

    const onClickSwipedImage = (toy : Toy) => {
        if(selectedIndex !== -1){
            const newTiers = [...tiers];
            newTiers[selectedIndex].toy = toy;
            setTiers(newTiers);
            setSelectedIndex(-1);

            httpManager.addToSantaPass({toy : toy.id, points: newTiers[selectedIndex].score}).then(()=>{
                console.log("created pass");
            }).catch(()=>{console.log("failed create pass")});

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
                return "#AAAAAA";
        }
    };

    function getTier(score: number) :string{
        switch(score){
            case 6:
                return "S";
            case 5: 
                return "A";
            case 4:
                return "B";
            case 3:
                return "C";
            case 2:
                return "D";
            case 1:
                return "E";
            default:
                return "F";
        }
    };



    return (
        <div className={styles.container}  >
            <div className={styles.image_container}>
                {toys.map((toy, i)=>{
                    return <div style={{"backgroundColor": getColor(toy.score)}} className={`${styles.item} ${selectedIndex === -1? "" : styles.grow_image}`}
                            onClick={()=>onClickSwipedImage(toy)}>
                            <div className={styles.tier_title}>{getTier(toy.score)} Tier</div>
                            <div className={`${styles.draggableToy}`}>
                            <img key={i} className={`${styles.image}`} 
                            src={toy.image} alt="image"/>
                                </div>
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
                        return <TierMaker key={index} index={index} score={tier.score} toy={tier.toy} 
                        onImageClick={onTierImageClick}
                        onDeleteClick={onTierDeleteClick} ></TierMaker>  
                    })
                }
                <button className={styles.add_button} onClick={createTier}>Add new Tier</button>
            </div>
        </div>
        );
}