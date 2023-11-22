import TaskList from "../components/TaskList";
import styles from "./ParentTaskPage.module.css"
import HTTPManager, { CreateTask, Task } from "../assets/js/http_manager";
import { useEffect, useState } from "react";
import { GroupTasksByCategories } from "../assets/js/utils";
import TreePattern from '../assets/img/patternarbres.png'; 
import { NavLink } from "react-router-dom";
const httpManager = new HTTPManager();

export default function ParentTaskPage() : JSX.Element {
    const [dailyTasks, setDailyTasks] = useState<Task[]>([]);
    const [generalTasks, setGeneralTasks] = useState<Task[]>([]);
    const [doneTasks, setDoneTasks] = useState<Task[]>([]);

    const [dailyInput, setDailyInput] = useState<string>("");
    const [generalInput, setGeneralInput] = useState<string>("");


    
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
                    <NavLink className={styles.returnButton} to="/parent">Retour</NavLink>
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


function dayOfYearToMonthDay(dayOfYear: number): { month: number, day: number } {
    if (dayOfYear < 0 || dayOfYear > 365) {
        throw new Error('Invalid day of year. It should be between 0 and 365.');
    }

    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    let month = 1;
    while (dayOfYear > daysInMonth[month]) {
        dayOfYear -= daysInMonth[month];
        month++;
    }

    return { month, day: dayOfYear };
}

function monthDayToDayOfYear(month: number, day: number): number {
    if (month < 1 || month > 12 || day < 1) {
        throw new Error('Invalid month or day.');
    }

    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (day > daysInMonth[month]) {
        throw new Error(`Invalid day for month ${month}.`);
    }

    let dayOfYear = day;
    for (let i = 1; i < month; i++) {
        dayOfYear += daysInMonth[i];
    }

    return dayOfYear;
}

interface MonthsLeftProps {
    setCountdownData: React.Dispatch<React.SetStateAction<{ month: number; day: number }>>;
}

export function MonthsLeft({ setCountdownData }: MonthsLeftProps): JSX.Element {
    const [months, setMonths] = useState<string[]>([]);
    const [monthDays, setDaysInMonth] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [selectedDay, setSelectedDay] = useState(1);
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);

    async function loadDeadline() : Promise<void> {
        const days = await httpManager.getDeadline();
        const { month, day } = dayOfYearToMonthDay(days);
        setSelectedMonth(month);
        setSelectedDay(day);
    }

    useEffect(() => {
        loadDeadline();
    }, []);

    useEffect(() => {
        const currentMonth = new Date().getMonth();
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const nextMonths = months.slice(currentMonth);
        setMonths(nextMonths);

        const currentMonthIndex = months.findIndex(month => month === months[currentMonth]);
        setCurrentMonthIndex(currentMonthIndex);

    }, []);


    useEffect(() => {
        if (selectedMonth !== 0) {
            const daysInMonth = getDays(selectedMonth);
            const days = Array.from({length: daysInMonth}, (_, i) => i + 1);
            setDaysInMonth(days);  
        }
        else {
            const days = Array.from({length: 0}, (_, i) => i + 1);
            setDaysInMonth(days); 
        }
    }, [selectedMonth]);

    const changeMonth = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const chosenMonth = parseInt(event.target.value, 10);
        setSelectedMonth(chosenMonth);
    };

    const changeDay = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const chosenDay = parseInt(event.target.value, 10);
        setSelectedDay(chosenDay);
    };

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedMonth !== 0 && selectedDay !== 0) {
            setCountdownData({ month: selectedMonth, day: selectedDay });
            const dayOfYear = monthDayToDayOfYear(selectedMonth, selectedDay);
            httpManager.setDeadline(dayOfYear);
        }
    };

    return (
        <div className={styles.dateInpute}>
            <form className={styles.countDownForm} onSubmit={handleFormSubmit}>
                <p className={styles.formTitle}>Change the deadline:&nbsp;</p>
                <div className={styles.month}>
                    <label htmlFor="monthInput">Month:&nbsp;</label>
                    <select id="monthInput" onChange={changeMonth}>
                        <option value="0">Select a month</option>
                        {months.map((month, index) => (
                                <option key={index + 1} value={index + 1 + currentMonthIndex}>
                                    {month}
                                </option>
                            ))}
                    </select>
                </div>
                
                <div className={styles.day}>
                    <label htmlFor="dayInput">Day:&nbsp;</label>
                    <select id="dayInput" onChange={changeDay}>
                        <option value="">Select a day</option>
                        {monthDays.map((day, index) => (
                                <option key={index + 1} value={index + 1}>
                                    {day}
                                </option>
                            ))}
                    </select>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

function getDays(month: number) {
    const year = new Date().getFullYear();
    return new Date(year, month, 0).getDate();
}

interface childCountdownProps {
    countdownData: { month: number; day: number };
}

export function ChildCountdown({ countdownData }: childCountdownProps): JSX.Element {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const year = new Date().getFullYear();

    useEffect(() => {
        const countdownDate = new Date(year, countdownData.month-1, countdownData.day);

        const timer = setInterval(() => {
            const time = countdownDate.getTime() - Date.now();
            setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
            setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
            setMinutes(Math.floor((time / 1000 / 60) % 60));
            setSeconds(Math.floor((time / 1000) % 60));
        }, 1000);

        return () => clearInterval(timer);
    }, [countdownData]);

    if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
        return (
            <div className='countDownDiv'>
                <p > The countdown is over! </p>
            </div>
        );
    }
    else if (days == 0) {
        return (
            <div className='countDownDiv'>
                <p className={styles.hours}>{hours} hour(s) &nbsp;</p>
                <p className={styles.minutes}>{minutes} minute(s) &nbsp;</p>
                <p className={styles.seconds}>{seconds} second(s)</p>
            </div>
        );
    }

    else if (hours == 0) {
        return (
            <div className='countDownDiv'>
                <p className={styles.minutes}>{minutes} minute(s) &nbsp;</p>
                <p className={styles.seconds}>{seconds} second(s)</p>
            </div>
        );
    }

    else if (minutes == 0) {
        return (
            <div className='countDownDiv'>
                <p className={styles.seconds}>{seconds} second(s)</p>
            </div>
        );
    }

    else {
        return (
            <div className='countDownDiv'>
                <p className={styles.days}>{days} day(s) &nbsp;</p>
                <p className={styles.hours}>{hours} hour(s) &nbsp;</p>
                <p className={styles.minutes}>{minutes} minute(s) &nbsp;</p>
                <p className={styles.seconds}>{seconds} second(s)</p>
            </div>
        );
    }

};