import TaskKid from "./TaskKid";
import styles from './TaskList.module.css'
import TaskEdit from "./TaskEdit";
import TaskCompleted from "./TaskCompleted";
import { Task } from "../assets/js/http_manager";

type TaskListProps = { tasks : Task[], title : string, onTaskClick: (removeIndex : number) => void, taskType : TaskUIType }

type TaskUIType = "view-task" | "edit-task" | "approve-task";

export default function TaskList(props : TaskListProps) : JSX.Element {
  return (
    <div className={styles.container}>
        <div className={styles.title}>
            {props.title}
        </div>
        <div className={props.taskType === "view-task" ? styles.tasklist : styles.tasklist_no_scroll}>
            { 
              props.tasks.length === 0 ?
                <div className={styles.no_task}>
                    { props.taskType === "view-task" ? "You Finished Your Tasks!!!" : "No Tasks"}
                  </div>
              : 
              props.tasks.map((task, i) => {
              if(props.taskType === "view-task")
                return <TaskKid key={i} index={i} task={task} onTaskClick={props.onTaskClick}></TaskKid>
              else if(props.taskType === "edit-task")
                return <TaskEdit key={i} index={i} task={task} onTaskClick={props.onTaskClick}></TaskEdit>
              else if(props.taskType === "approve-task")
                return <TaskCompleted key={i} index={i} task={task} onTaskClick={props.onTaskClick}></TaskCompleted>
              return <TaskKid key={i} index={i} task={task} onTaskClick={props.onTaskClick}></TaskKid>
              
            }
            )}            
        </div>
    </div>
  );
}