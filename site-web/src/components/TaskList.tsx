import TaskKid from "./TaskKid";
import styles from './TaskList.module.css'
import TaskEdit from "./TaskEdit";
import TaskCompleted from "./TaskCompleted";
import { Task } from "../assets/js/http_manager";

type TaskListProps = { taskNames : Task[], title : string, onTaskClick: (removeIndex : number) => void, taskType : string }


export default function TaskList(props : TaskListProps) : JSX.Element {
  return (
    <div className={styles.container}>
        <div className={styles.title}>
            {props.title}
        </div>
        <div className={styles.tasklist}>
            {props.taskNames.map((task, i) => {
              if(props.taskType === "view-task")
                return <TaskKid key={i} index={i} taskname={task.name} onTaskClick={props.onTaskClick}></TaskKid>
              else if(props.taskType === "edit-task")
                return <TaskEdit key={i} index={i} taskname={task.name} onTaskClick={props.onTaskClick}></TaskEdit>
              else if(props.taskType === "approve-task")
                return <TaskCompleted key={i} index={i} taskname={task.name} onTaskClick={props.onTaskClick}></TaskCompleted>
              return <TaskKid key={i} index={i} taskname={task.name} onTaskClick={props.onTaskClick}></TaskKid>
              
            }
            )}            
        </div>
    </div>
  );
}