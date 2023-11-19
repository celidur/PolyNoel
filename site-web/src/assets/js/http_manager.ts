import { SERVER_URL } from "./consts.js";

export const HTTPInterface = {
  SERVER_URL: `${SERVER_URL}/api`,

  GET: async function<T>(endpoint : string) : Promise<T> {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function<T, U> (endpoint : string, data : T) : Promise<U> {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint : string) : Promise<number> {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
    });
    return response.status;
  },

  PATCH: async function (endpoint : string) : Promise<number> {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
    });
    return response.status;
  },

  PUT: async function <T>(endpoint : string, data : T) : Promise<number> {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
    return response.status;
  },
};


interface CreateTask {
  deadline?: string,
  name : string,
  reccurent_interval? : number
}

interface Task extends CreateTask {  
  id : string,  
  need_review : boolean,  
}

export default class HTTPManager {
    tasksURL : string;
    toysURL : string;
    parentURL : string;
    battlePass : string

    chosenToysURL : string;
    randomToysURL : string;

    constructor() {
        //Main Endpoints
        this.tasksURL = "child_labor";
        this.toysURL = "toys"
        this.parentURL = "parent"
        this.battlePass = "battlePass"

        //Sub Endpoints
        this.chosenToysURL = "chosen";        
        this.randomToysURL = "random";
    }

    async fetchAllTasks() : Promise<Task[]> {
        const tasks = await HTTPInterface.GET<Task[]>(`${this.tasksURL}`);        
        return tasks;
    }

    async createNewTask(data : Task) : Promise<string> {
        const newTaskId = await HTTPInterface.POST<CreateTask, string>(`${this.tasksURL}`, data);
        return newTaskId;
    }

    async deleteTask(id : string) : Promise<void> {
        await HTTPInterface.DELETE(`${this.tasksURL}/${id}`);        
    }

    async updateTaskStatus(id : string) : Promise<void> {
      await HTTPInterface.PATCH(`${this.tasksURL}/${id}`);        
  }
}
