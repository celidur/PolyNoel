import TaskList from "../components/TaskList";
import styles from "./ParentTaskPage.module.css"
import HTTPManager, { CreateTask, Task } from "../assets/js/http_manager";
import { useEffect, useState } from "react";
import { GroupTasksByCategories } from "../assets/js/utils";
import TreePattern from '../assets/img/patternarbres.png'; 

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
        }).catch(()=>{
            setDailyTasks([]);
            setGeneralTasks([]);
            setDoneTasks([]);
        });                
    }, [])

    const addGeneral = (taskName : CreateTask) => {        
        if(taskName.name === "")   
            return;
        httpManager
            .createNewTask(taskName)
            .then((newTask : Task) => setGeneralTasks([...generalTasks, newTask]))
            .catch( () => setGeneralTasks([]) );
        setGeneralInput("");        
    }

    const addDaily = (taskName : CreateTask) => {     
        if(taskName.name === "")   
            return;
        httpManager
            .createNewTask(taskName)
            .then((newTask : Task) => setDailyTasks([...dailyTasks, newTask]))
            .catch( () => setDailyTasks([]) );
        setDailyInput("");  
    }

    const removeDailyTask = (removeIndex : number) => {
        const taskToDelete : Task | undefined = dailyTasks.find((_, index) => {
            return index === removeIndex;
        });

        if(!taskToDelete)
            throw new Error("Couldn't delete task");

        httpManager.deleteTask(taskToDelete.id)            
        setDailyTasks(dailyTasks.filter(( _, index : number) => { 
            return index !== removeIndex;
        }));
    } 
    const removeGeneralTask = (removeIndex : number) => {
        const taskToDelete : Task | undefined = generalTasks.find((_, index) => {
            return index === removeIndex;
        });
        
        if(!taskToDelete)
            throw new Error("Couldn't delete task");

        httpManager.deleteTask(taskToDelete.id)            
        setGeneralTasks(generalTasks.filter(( _, index : number) => { 
            return index !== removeIndex;
        }));
    } 
    const approvePendingTask = (removeIndex : number) => {
        const taskToDelete : Task | undefined = doneTasks.find((_, index) => {
            return index === removeIndex;
        });
        
        if(!taskToDelete)
            throw new Error("Couldn't delete task");
        
        setDoneTasks(doneTasks);
    } 


    
    return (        
            <div className={styles.task_container}>
                <div className={styles.taskBlockContainer}>

                    <div className={styles.task_block}>
                        <TaskList tasks={dailyTasks} title="Daily Tasks" onTaskClick={removeDailyTask} taskType={"edit-task"}></TaskList>
                        <div className={styles.add_task}>
                            <input className={styles.input} placeholder="New Daily Task" type="text" value={dailyInput} 
                                onChange={(e) => setDailyInput(e.target.value)}
                                onKeyDown={(e)=>{
                                    if(e.key == "Enter")
                                        addDaily({name: dailyInput, recurrent_interval: 1})
                                }}></input>                        
                            <button className={styles.add_task_button} 
                            onClick={() =>{
                                addDaily({name: dailyInput, recurrent_interval: 1});
                            }}>+</button>
                        </div>
                    </div>
                    <div className={styles.task_block}>
                        <TaskList tasks={generalTasks} title="General Tasks" onTaskClick={removeGeneralTask} taskType={"edit-task"}></TaskList>
                        <div className={styles.add_task}>
                            <input className={styles.input} placeholder="New General Task" type="text" value={generalInput} 
                            onChange={(e) => setGeneralInput(e.target.value)}
                            onKeyDown={(e)=>{
                                if(e.key == "Enter")
                                    addDaily({name: dailyInput, recurrent_interval: 1})
                            }}></input>
                            <button className={styles.add_task_button} 
                            onClick={() =>{
                                addGeneral({name: generalInput, recurrent_interval: 0});
                            }}>+</button>
                        </div>
                    </div>

                    <div className={styles.task_block}>
                        <TaskList tasks={doneTasks} title="Completed Tasks" onTaskClick={approvePendingTask} taskType={"approve-task"}></TaskList>                    
                    </div>
                </div>
                <img className={styles.treePattern} src={TreePattern} alt="tree pattern"></img>
            </div>        
    );
}
