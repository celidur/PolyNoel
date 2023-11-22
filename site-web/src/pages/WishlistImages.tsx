import { useState, useEffect } from "react";
import HTTPManager from "../assets/js/http_manager";
// import styles from "../../assets/css/rankToys.module.css";

const httpManager = new HTTPManager();

export default function WishlistImage({image}: {image: string}) :  JSX.Element {

    return (
        <div>
            <img src={image}/>
        </div>
    )

    
}