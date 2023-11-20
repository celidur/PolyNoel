import styles from "./Task.module.css"
import { TaskProp } from "./TaskTypes";

export default function TaskKid(props: TaskProp) : JSX.Element {
    const changeNeedReview = () : void => {
      if(!props.task.need_review)
        props.onTaskClick(props.index)
    };
    return (
      <div className={styles.task}>
            <label className={styles.task__label}>
                <input type="checkbox"                  
                  onClick={ changeNeedReview }
                  defaultChecked={props.task.need_review}
                  disabled={props.task.need_review}
                ></input>
                <i className={styles.check}></i>
                <span>{props.task.name}</span>
            </label>
      </div>
    );
}