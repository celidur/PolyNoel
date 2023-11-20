import styles from "./Task.module.css"
import TrashIcon from '../assets/img/trash.svg'
import { TaskProp } from "./TaskTypes";

export default function TaskEdit(props: TaskProp) : JSX.Element {
    return (
      <div className={styles.task_manage}>            
            <span>{props.task.name}</span>                                        
            <img className={styles.img} src={TrashIcon} alt="trash-icon" onClick={(e)=> props.onTaskClick(props.index)}/>
      </div>
    );
}