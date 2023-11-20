import '../assets/css/indexStyles.css'
//import { NavLink } from "react-router-dom";

import React, { useEffect, useState } from "react"
import HTTPManager, { Task, TaskStatus } from '../assets/js/http_manager';
import TaskList from '../components/TaskList';

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