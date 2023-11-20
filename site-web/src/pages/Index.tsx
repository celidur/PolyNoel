import '../assets/css/indexStyles.css'
//import { NavLink } from "react-router-dom";

import React, { useEffect, useState } from "react"
import HTTPManager, { Task } from '../assets/js/http_manager';
import TaskList from '../components/TaskList';

export default function Index() : JSX.Element {
    const [tasks, setTasks] = useState<Task[]>([]);
    const httpManager = new HTTPManager();
    useEffect(()=> {
        httpManager.fetchAllTasks()
        .then((fetchedTasks : Task[]) => setTasks(fetchedTasks));  
    }, []);

    const changeTaskState = (changeIndex : number) : void => {                
        const taskToDelete : Task | undefined = tasks[changeIndex];
        if(!taskToDelete) return;

        httpManager.updateTaskStatus(taskToDelete.id).then(()=> {
            httpManager.fetchAllTasks()
            .then((fetchedTasks : Task[]) => setTasks(fetchedTasks));  
        })
    };

    return (
        <div>
           {/* Hello World! */}
            <div className='countdown'>
                <p>Time left to complete tasks</p>
                <p>xx:xx:xx</p>
            </div>
            <div id="battleBarContainer">
                <span>naughty</span>
                <div className='battleBar'></div>
                <span>nice</span>
            </div>
            <TaskList tasks={tasks} title="Tasks" taskType={"view-task"} onTaskClick={ changeTaskState }></TaskList>
        </div>
    );
}