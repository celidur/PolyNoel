import './indexStyles.css'
import styles from './Index.module.css';
import CandyCane from '../assets/img/pattern.jpg'
import CandyCaneProjected from '../assets/img/patterngris.jpg'

import React, { useEffect, useState } from "react"
import HTTPManager, { Task, TaskStatus } from '../assets/js/http_manager';
import TaskList from '../components/TaskList';
import { NavLink } from 'react-router-dom';
import { delay } from 'q';

export default function Index() : JSX.Element {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [realPercentage, setReal] = useState(0);
    const [projectedPercentage, setProjected] = useState(0);
    const httpManager = new HTTPManager();
    useEffect(()=> {
        httpManager.fetchAllTasks()
        .then((fetchedTasks : Task[]) => {
            const barLength = 700;
            const filtered = fetchedTasks.filter((task : Task)=> { return task.status !== TaskStatus.Done});
            const pending = fetchedTasks.filter((task : Task)=> { return task.status === TaskStatus.Pending});                        
            setTasks(filtered);

            let realData;
            let projectedData;
            if (fetchedTasks.length == 0) {
                realData = 0;
                projectedData = 0;
            }
            else {
                realData = (barLength/fetchedTasks.length)*(fetchedTasks.length-filtered.length);
                projectedData = realData + (barLength/fetchedTasks.length)*(pending.length);
            }
            setReal(realData);
            setProjected(projectedData);
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
                const barLength = 700;
                const filtered = fetchedTasks.filter((task : Task)=> { return task.status !== TaskStatus.Done});
                const pending = fetchedTasks.filter((task : Task)=> { return task.status === TaskStatus.Pending}); 
                setTasks(filtered)

                let realData;
                let projectedData;
                if (fetchedTasks.length === 0) {
                    realData = 0;
                    projectedData = 0;
                }
                else {
                    realData = (barLength/fetchedTasks.length)*(fetchedTasks.length-filtered.length);
                    projectedData = realData + (barLength/fetchedTasks.length)*(pending.length);
                }
                setReal(realData);
                setProjected(projectedData);
            });  
        })
    };

    return (
        <div className={styles.container}>
           <div className={styles.battlepass_container}>
            <div className={styles.countdownContainer}>
                <p className="timerTitle">Time left to complete tasks</p>
                <div className='countdown'>
                    <Countdown month={"December"} day={21} year={2023}></Countdown>
                </div>
            </div>
                <div id="battleBarContainer">
                    <div className='battleBar'>
                        <ProgressBar projectedProgress={projectedPercentage} realProgress={realPercentage} ></ProgressBar>
                    </div>
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

interface progressBarProps{
    projectedProgress: number;
    realProgress: number;
}
function ProgressBar({projectedProgress, realProgress}:progressBarProps):JSX.Element {
    const barLength = 700;
    if (barLength === realProgress) {
        return (
            <>
                <img className={styles.patternDone} src={CandyCane} alt="candycane pattern" width={realProgress}></img>
            </>
        );
    }

    else if (realProgress === 0 && projectedProgress === 0) {
        return (
            <>
            <div className={styles.noPattern}></div>
            </>
        );
    }

    else if (barLength === projectedProgress) {
        return (
            <>
                <img className={styles.patternProjectedDone} src={CandyCaneProjected} width={projectedProgress} alt="candycane pattern projected"></img>
                <img className={styles.pattern} src={CandyCane} alt="candycane pattern" width={realProgress}></img>
            </>
        );
    }
    else {
        return (
        <>
            <img className={styles.patternProjected} src={CandyCaneProjected} width={projectedProgress} alt="candycane pattern projected"></img>
            <img className={styles.pattern} src={CandyCane} alt="candycane pattern" width={realProgress}></img>
        </>
    );}
}

interface countDownProps{
    month: string;
    day: number;
    year: number;
}
function Countdown({month, day, year}:countDownProps):JSX.Element {
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const countdownTo = `${month} ${day}, ${year}`;

    const getTime = () => {
        const time = Date.parse(countdownTo) - Date.now();
        setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
        setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
    };

    useEffect(() => {
        const milliseconds = setInterval(getTime, 1000);

        return () => clearInterval(milliseconds);
    }, []);

    return (
        <div className='countDownDiv'>
            <p className={styles.days}>{days} day(s): </p>
            <p className={styles.hours}>{hours} hour(s): </p>
            <p className={styles.minutes}>{minutes} minute(s): </p>
            <p className={styles.seconds}>{seconds} second(s)</p>
        </div>
    );
};
    