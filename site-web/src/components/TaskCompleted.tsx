import styles from "./Task.module.css"
import { useState } from "react";
import { TaskProp } from "./TaskTypes";

export default function TaskCompleted(props: TaskProp) : JSX.Element {
    const [approved, setApproved] = useState<boolean>(false);

    const changeApproved = () : void => {
        setApproved(!approved);
    }

    return (
      <div className={styles.task_manage} onClick={ () => changeApproved()}>            
            <span>{props.task.name}</span>                                        
            {
                approved ? <span className={styles.approved_task}>Approved</span> : <span className={styles.approved_task}>Pending</span>                        
            }
      </div>
    );
}