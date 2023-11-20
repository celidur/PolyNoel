import './indexStyles.css'
import styles from './Index.module.css';

import React, { useEffect, useState } from "react"
import HTTPManager, { Task, TaskStatus } from '../assets/js/http_manager';
import TaskList from '../components/TaskList';
import { NavLink } from 'react-router-dom';

export default function Index() : JSX.Element {
    const [tasks, setTasks] = useState<Task[]>([]);
    const httpManager = new HTTPManager();
    useEffect(()=> {
        httpManager.fetchAllTasks()
        .then((fetchedTasks : Task[]) => {
            const filtered = fetchedTasks.filter((task : Task)=> { return task.status !== TaskStatus.Done});                        
            setTasks(filtered);
        });  
    }, []);

    const changeTaskState = (changeIndex : number) : void => {                
        const taskToDelete : Task | undefined = tasks[changeIndex];
        if(!taskToDelete) return;

        let status : TaskStatus = TaskStatus.NotDone;
        if(taskToDelete.status === TaskStatus.NotDone)
            status = TaskStatus.Pending
        else if(taskToDelete.status === TaskStatus.Pending)
            status = TaskStatus.NotDone;

        httpManager.updateTaskStatus(taskToDelete.id, status).then(()=> {
            httpManager.fetchAllTasks()
            .then((fetchedTasks : Task[]) => {
                const filtered = fetchedTasks.filter((task : Task)=> { return task.status !== TaskStatus.Done});        
                setTasks(filtered)
            });  
        })
    };

    return (
        <div className={styles.container}>
           {/* Hello World! */}
           <div className={styles.battlepass_container}>
                <div className='countdown'>
                    <p>Time left to complete tasks</p>
                    <p>xx:xx:xx</p>
                </div>
                <div id="battleBarContainer">
                    <div className='battleBar'></div>
                    <div id="labelsContainer">
                        <p className="naughty">Naughty</p>
                        <p className="nice">Nice</p>
                    </div>
                </div>
           </div>

            <div className={styles.bottomContainer}>
                <div className={styles.wishlistContainer}>
                    <div className={styles.title}>My wishlist</div>
                    <div className={styles.toys_container}>Something</div>

                    <div className={styles.button_container}>
                        <NavLink to="/toycatalog">
                            <button className={styles.button}>Add Ideas</button>
                        </NavLink>
                        <NavLink to="/ranktoys">
                            <button className={styles.button}>Rank Ideas</button>   
                        </NavLink>                   
                    </div>
                </div>
                <div className={styles.tasklistContainer}>
                    <TaskList tasks={tasks} title="Tasks" taskType={"view-task"} onTaskClick={ changeTaskState }></TaskList>
                </div>
            </div>
        </div>
    );
}