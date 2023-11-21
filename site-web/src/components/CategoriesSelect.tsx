import styles from './CategoriesSelect.module.css'
import { useEffect, useState } from 'react';
import HTTPManager, { SimpleCategory } from '../assets/js/http_manager';

type CategoriesSearch  = { input : string, select: boolean }

export default function CategoriesSelect(props : CategoriesSearch) : JSX.Element {
    const httpManager = new HTTPManager();
    const [categories, setCategories] = useState<SimpleCategory[]>([]);

    const fetchCategories = () => {
        httpManager.getAllCategories().then((fetchedCategories)=>{
            if(props.input === ""){
                setCategories(fetchedCategories);
            }else{
                const filtered = fetchedCategories.filter((category)=>{
                    return category.name.includes(props.input);
                })
                setCategories(filtered);
            }
        }).catch(()=>{setCategories([])});
    }

    useEffect(()=> {
        fetchCategories();
    }, [props.input, props.select])


    const unselectCategory = (category: SimpleCategory) => {
        const copy = category
        if(category.is_selected){
            httpManager.deleteCategoryForUser(category.id).then(()=>{

                fetchCategories();
            }).catch(()=>setCategories([]));
        }else{
            httpManager.createCategoryForUser(category.id).then(()=>{
                fetchCategories();
            }).catch(()=>setCategories([]));
        }
    };

  return (
    <div className={styles.container}>
        {categories.map((category)=>{
            return <div className={`${styles.category} ${category.is_selected ? styles.selected : styles.not_selected}`}
                    onClick={ ()=>unselectCategory(category) }>
                    {category.name}
                    </div>

        })}
    </div>
  );
}