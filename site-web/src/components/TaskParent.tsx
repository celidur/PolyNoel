import styles from "./Task.module.css"
import TrashIcon from '../assets/img/trash.svg'

type TaskProp = { index: number, taskname : string, onTaskClick : (removeIndex : number) => void }

export default function TaskParent(props: TaskProp) : JSX.Element {
    return (
      <div className={styles.task_manage}>            
            <span>{props.taskname}</span>                                        
            <img className={styles.img} src={TrashIcon} alt="trash-icon" onClick={(e)=> props.onTaskClick(props.index)}/>
      </div>
    );
}