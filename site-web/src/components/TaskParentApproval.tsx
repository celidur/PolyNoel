import styles from "./Task.module.css"
import { useState } from "react";

type TaskProp = { index: number, taskname : string, onTaskClick : (removeIndex : number) => void }

export default function TaskParentApproval(props: TaskProp) : JSX.Element {
    const [approved, setApproved] = useState<boolean>(false);

    const changeApproved = () : void => {
        setApproved(!approved);
    }

    return (
      <div className={styles.task_manage} onClick={ () => changeApproved()}>            
            <span>{props.taskname}</span>                                        
            {
                approved ? <span className={styles.approved_task}>Approved</span> : <span className={styles.approved_task}>Pending</span>                        
            }
      </div>
    );
}