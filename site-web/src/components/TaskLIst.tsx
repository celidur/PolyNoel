import Task from "./Task";
import TaskListCSS from './TaskList.module.css'
import TaskParent from "./TaskParent";
import TaskParentApproval from "./TaskParentApproval";
type TaskListProps = { taskNames : string[], title : string, onTaskClick: (removeIndex : number) => void, taskType : string }


export default function TaskList(props : TaskListProps) : JSX.Element {
  return (
    <div className={TaskListCSS.container}>
        <div className={TaskListCSS.title}>
            {props.title}
        </div>
        <div className={TaskListCSS.tasklist}>
            {props.taskNames.map((taskName, i) =>{
              if(props.taskType == "view-task")
              return <Task key={i} index={i} taskname={taskName} onTaskClick={props.onTaskClick}></Task>
              else if(props.taskType == "edit-task")
                return <TaskParent key={i} index={i} taskname={taskName} onTaskClick={props.onTaskClick}></TaskParent>
              else if(props.taskType == "approve-task")
                return <TaskParentApproval key={i} index={i} taskname={taskName} onTaskClick={props.onTaskClick}></TaskParentApproval>
            }
            )}            
        </div>
    </div>
  );
}