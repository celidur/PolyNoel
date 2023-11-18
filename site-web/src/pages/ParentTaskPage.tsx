import TaskList from "../components/TaskLIst";
import TaskPageCSS from "./ParentTaskPage.module.css"

import { useEffect, useState } from "react";

export default function ParentTaskPage() : JSX.Element {
    const [dailyTasks, setDailyTasks] : any = useState([]);
    const [generalTasks, setGeneralTasks] : any = useState([]);
    const [doneTasks, setDoneTasks] : any = useState([]);

    const [dailyInput, setDailyInput] : any = useState("")
    const [generalInput, setGeneralInput] : any = useState("")

    
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
        //send to api
    }

    const addDaily = (taskName : string) => {        
        setDailyTasks([...dailyTasks, taskName])
        //send to api
    }

    const removeDailyTask = (removeIndex : number) => {
        setDailyTasks(dailyTasks.filter(( _ : any, index : number) => { 
            return index !== removeIndex;
        }));
    } 
    const removeGeneralTask = (removeIndex : number) => {
        setGeneralTasks(generalTasks.filter(( _ : any, index : number) => { 
            return index !== removeIndex;
        }));
    } 
    const removeDoneTask = (removeIndex : number) => {
        setDoneTasks(doneTasks.filter(( _ : any, index : number) => { 
            return index !== removeIndex;
        }));
    } 


    
    return (
        <div className={TaskPageCSS.container}>
            <div className={TaskPageCSS.task_container}>
                <div className={TaskPageCSS.task_block}>
                    <TaskList taskNames={dailyTasks} title="Daily Tasks" onTaskClick={removeDailyTask} isParent={true}></TaskList>
                    <div className={TaskPageCSS.add_task}>
                        <input className={TaskPageCSS.input} placeholder="New Daily" type="text" onChange={(e) => setDailyInput(e.target.value)}></input>                        
                        <button className={TaskPageCSS.add_task_button} 
                        onClick={() =>{
                            addDaily(dailyInput);
                        }}>+</button>
                    </div>
                </div>
                <div className={TaskPageCSS.task_block}>
                    <TaskList taskNames={generalTasks} title="General Tasks" onTaskClick={removeGeneralTask} isParent={true}></TaskList>
                    <div className={TaskPageCSS.add_task}>
                        <input className={TaskPageCSS.input} placeholder="New General" type="text" onChange={(e) => setGeneralInput(e.target.value)}></input>
                        <button className={TaskPageCSS.add_task_button} 
                        onClick={() =>{
                            addGeneral(generalInput);
                        }}>+</button>
                    </div>
                </div>

                <div className={TaskPageCSS.task_block}>
                    <TaskList taskNames={doneTasks} title="Done Tasks" onTaskClick={removeDoneTask} isParent={true}></TaskList>                    
                </div>
            </div>
        </div>
    );
}
