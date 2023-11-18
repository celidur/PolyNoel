import Task from "./Task";
import TaskListCSS from './TaskList.module.css'

type TaskListProps = { taskNames : string[], title : string }

export default function TaskList(props : TaskListProps) : JSX.Element {
  return (
    <div className={TaskListCSS.container}>
        <div className={TaskListCSS.title}>
            {props.title}
        </div>
        <div className={TaskListCSS.tasklist}>
            {props.taskNames.map((taskName, i) =>
                <Task key={i} taskname={taskName}></Task>
            )}
        </div>
    </div>
  );
}