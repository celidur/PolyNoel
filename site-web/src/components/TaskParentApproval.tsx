import TaskCSS from "./TaskParent.module.css"
import TrashIcon from '../assets/img/trash.svg'
import { useState } from "react";

type TaskProp = { index: number, taskname : string, onTaskClick : (removeIndex : number) => void }

export default function TaskParentApproval(props: TaskProp) : JSX.Element {
    const [approved, setApproved] : any = useState(false);

    const changeApproved = () => {
        setApproved(!approved);
    }

    return (
      <div className={TaskCSS.task} onClick={ () => changeApproved()}>            
            <span>{props.taskname}</span>                                        
            {
                approved ? <span>Approved</span> : <span>Pending</span>                        
            }
      </div>
    );
}