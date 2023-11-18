import Task from "./Task";
import TaskListCSS from './TaskList.module.css'
import TaskParent from "./TaskParent";
type TaskListProps = { taskNames : string[], title : string, onTaskClick: (removeIndex : number) => void, isParent : boolean }


export default function TaskList(props : TaskListProps) : JSX.Element {
  return (
    <div className={TaskListCSS.container}>
        <div className={TaskListCSS.title}>
            {props.title}
        </div>
        <div className={TaskListCSS.tasklist}>
            {props.taskNames.map((taskName, i) =>{
              if(props.isParent)
                return <TaskParent key={i} index={i} taskname={taskName} onTaskClick={props.onTaskClick}></TaskParent>
              else
                return <Task key={i} index={i} taskname={taskName} onTaskClick={props.onTaskClick}></Task>
            }
            )}            
        </div>
    </div>
  );
}