// import HTTPManager from "../assets/js/http_manager";
import styles from "./WishlistImages.module.css";

// const httpManager = new HTTPManager();

export default function WishlistImage({image}: {image: string}) :  JSX.Element {

    return (
        <div className = {styles.toy}>
            <img src={image}/>
        </div>
    )

    
}