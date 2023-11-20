import styles from "./Task.module.css"
import { useState } from "react";
import { TaskProp } from "./TaskTypes";
import HTTPManager, { TaskStatus } from "../assets/js/http_manager";

export default function TaskCompleted(props: TaskProp) : JSX.Element {
    const [status, setStatus] = useState<TaskStatus>(props.task.status);
    const httpManager = new HTTPManager();

    const changeApproved = () : void => {
        const newStatus : TaskStatus = status === TaskStatus.Pending ? TaskStatus.Done : TaskStatus.Pending;
        setStatus(newStatus);
        httpManager.updateTaskStatus(props.task.id, newStatus);
    }

    return (
      <div className={styles.task_manage} onClick={ () => changeApproved()}>            
            <span>{props.task.name}</span>                                        
            {
                status === TaskStatus.Done  ? <span className={styles.approved_task}>Approved</span> : <span className={styles.approved_task}>Pending</span>                        
            }
      </div>
    );
}