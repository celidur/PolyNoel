import styles from "./Task.module.css"

type TaskProp = { index: number, taskname : string, onTaskClick : (removeIndex : number) => void }

export default function Task(props: TaskProp) : JSX.Element {
    return (
      <div className={styles.task}>
            <label className={styles.task__label}>
                <input type="checkbox"                  
                  onClickCapture={ (e)=> props.onTaskClick(props.index)}
                ></input>
                <i className={styles.check}></i>
                <span>{props.taskname}</span>
            </label>
      </div>
    );
}