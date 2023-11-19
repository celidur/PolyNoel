import TaskList from "../components/TaskList";
import styles from "./ParentTaskPage.module.css"
import HTTPManager, { CreateTask, Task } from "../assets/js/http_manager";
import { useEffect, useState } from "react";
import { GroupTasksByCategories } from "../assets/js/utils";



export default function ParentTaskPage() : JSX.Element {
    const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
    const [generalTasks, setGeneralTasks] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);

    const [dailyInput, setDailyInput] = useState<string>("");
    const [generalInput, setGeneralInput] = useState<string>("");
    const httpManager = new HTTPManager();
    
    useEffect(() => {        
        httpManager.fetchAllTasks()
        .then((tasks : Task[]) => {
            const { daily , general, done } = GroupTasksByCategories(tasks);     
            setDailyTasks(daily);       
            setGeneralTasks(general);
            setDoneTasks(done);
        })

        // const dailyTasksMock : string[] = ["task 1", "task 2"];
        // const generalTasksMock : string[] = ["task 1", "task 2", "task 3", "task 4"];
        // const doneTasksMock : string[] = ["task 1", "task 2"];
        // setDailyTasks(dailyTasksMock);
        // setGeneralTasks(generalTasksMock);
        // setDoneTasks(doneTasksMock);
    }, [])

    const addGeneral = (taskName : CreateTask) => {        
        httpManager
            .createNewTask(taskName)
            .then((newTask : Task) => setGeneralTasks([...generalTasks, newTask]))
            .catch( () => setGeneralTasks([]) );
        setGeneralInput("");        
    }

    const addDaily = (taskName : CreateTask) => {        
        httpManager
            .createNewTask(taskName)
            .then((newTask : Task) => setDailyTasks([...dailyTasks, newTask]))
            .catch( () => setDailyTasks([]) );
        setDailyInput("");  
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
        <div className={styles.task_container}>
            <div className={styles.task_block}>
                <TaskList taskNames={dailyTasks} title="Daily Tasks" onTaskClick={removeDailyTask} taskType={"edit-task"}></TaskList>
                <div className={styles.add_task}>
                    <input className={styles.input} placeholder="New Daily Task" type="text" value={dailyInput} onChange={(e) => setDailyInput(e.target.value)}></input>                        
                    <button className={styles.add_task_button} 
                    onClick={() =>{
                        addDaily({name: dailyInput, reccurent_interval: 1});
                    }}>+</button>
                </div>
            </div>
            <div className={styles.task_block}>
                <TaskList taskNames={generalTasks} title="General Tasks" onTaskClick={removeGeneralTask} taskType={"edit-task"}></TaskList>
                <div className={styles.add_task}>
                    <input className={styles.input} placeholder="New General Task" type="text" value={generalInput} onChange={(e) => setGeneralInput(e.target.value)}></input>
                    <button className={styles.add_task_button} 
                    onClick={() =>{
                        addGeneral({name: dailyInput, reccurent_interval: 0});
                    }}>+</button>
                </div>
            </div>

            <div className={styles.task_block}>
                <TaskList taskNames={doneTasks} title="Completed Tasks" onTaskClick={removeDoneTask} taskType={"approve-task"}></TaskList>                    
            </div>
        </div>        
    );
}
