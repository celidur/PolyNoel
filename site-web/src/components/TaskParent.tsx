import TaskCSS from "./TaskParent.module.css"
import TrashIcon from '../assets/img/trash.svg'

type TaskProp = { index: number, taskname : string, onTaskClick : (removeIndex : number) => void }

export default function TaskParent(props: TaskProp) : JSX.Element {
    return (
      <div className={TaskCSS.task}>            
            <span>{props.taskname}</span>                                        
            <img className={TaskCSS.img} src={TrashIcon} alt="trash-icon" onClick={(e)=> props.onTaskClick(props.index)}/>
      </div>
    );
}