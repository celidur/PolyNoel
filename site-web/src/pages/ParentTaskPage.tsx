import TaskList from "../components/TaskList";
import TaskPageCSS from "./ParentTaskPage.module.css"

import { useEffect, useState } from "react";

export default function ParentTaskPage() : JSX.Element {
    const [dailyTasks, setDailyTasks] = useState<string[]>([]);
    const [generalTasks, setGeneralTasks] = useState<string[]>([]);
    const [doneTasks, setDoneTasks] = useState<string[]>([]);

    const [dailyInput, setDailyInput] = useState<string>("");
    const [generalInput, setGeneralInput] = useState<string>("");

    
    useEffect(() => {
        //fetch from api
        const dailyTasksMock : string[] = ["task 1", "task 2"];
        const generalTasksMock : string[] = ["task 1", "task 2", "task 3", "task 4"];
        const doneTasksMock : string[] = ["task 1", "task 2"];
        setDailyTasks(dailyTasksMock);
        setGeneralTasks(generalTasksMock);
        setDoneTasks(doneTasksMock);
    }, [])

    const addGeneral = (taskName : string) => {        
        setGeneralTasks([...generalTasks, taskName])
        setGeneralInput("");
        //send to api
    }

    const addDaily = (taskName : string) => {        
        setDailyTasks([...dailyTasks, taskName])
        setDailyInput("");
        //send to api
    }

    const removeDailyTask = (removeIndex : number) => {
        setDailyTasks(dailyTasks.filter(( _, index : number) => { 
            return index !== removeIndex;
        }));
    } 
    const removeGeneralTask = (removeIndex : number) => {
        setGeneralTasks(generalTasks.filter(( _, index : number) => { 
            return index !== removeIndex;
        }));
    } 
    const removeDoneTask = (removeIndex : number) => {
        setDoneTasks(doneTasks.filter(( _, index : number) => { 
            return index !== removeIndex;
        }));
    } 


    
    return (        
        <div className={TaskPageCSS.task_container}>
            <div className={TaskPageCSS.task_block}>
                <TaskList taskNames={dailyTasks} title="Daily Tasks" onTaskClick={removeDailyTask} taskType={"edit-task"}></TaskList>
                <div className={TaskPageCSS.add_task}>
                    <input className={TaskPageCSS.input} placeholder="New Daily Task" type="text" value={dailyInput} onChange={(e) => setDailyInput(e.target.value)}></input>                        
                    <button className={TaskPageCSS.add_task_button} 
                    onClick={() =>{
                        addDaily(dailyInput);
                    }}>+</button>
                </div>
            </div>
            <div className={TaskPageCSS.task_block}>
                <TaskList taskNames={generalTasks} title="General Tasks" onTaskClick={removeGeneralTask} taskType={"edit-task"}></TaskList>
                <div className={TaskPageCSS.add_task}>
                    <input className={TaskPageCSS.input} placeholder="New General Task" type="text" value={generalInput} onChange={(e) => setGeneralInput(e.target.value)}></input>
                    <button className={TaskPageCSS.add_task_button} 
                    onClick={() =>{
                        addGeneral(generalInput);
                    }}>+</button>
                </div>
            </div>

            <div className={TaskPageCSS.task_block}>
                <TaskList taskNames={doneTasks} title="Completed Tasks" onTaskClick={removeDoneTask} taskType={"approve-task"}></TaskList>                    
            </div>
        </div>        
    );
}
