import TaskCSS from "./Task.module.css"

type TaskProp = { taskname : string }

export default function Task(props: TaskProp) : JSX.Element {
    return (
      <div className={TaskCSS.task}>
            <label className={TaskCSS.task__label}>
                <input type="checkbox"></input>
                <i className={TaskCSS.check}></i>
                <span>{props.taskname}</span>
            </label>
      </div>
    );
}