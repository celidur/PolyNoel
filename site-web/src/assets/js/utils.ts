import { Task, TaskStatus } from "./http_manager";
export interface TasksByCategories {
    daily : Task[],
    general : Task[],
    done : Task[]
}

export function GroupTasksByCategories(tasks : Task[]) : TasksByCategories  {
    const groupedTasks : TasksByCategories = {
        daily : [],
        general : [],
        done : []
    }

    tasks.forEach((task : Task)=> {
        if(task.status !== TaskStatus.NotDone){
            groupedTasks.done.push(task);
        }else if(task.recurrent_interval){
            groupedTasks.daily.push(task);
        }else {
            groupedTasks.general.push(task);
        }
    })

    return groupedTasks;
}