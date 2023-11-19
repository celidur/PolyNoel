import { SERVER_URL } from "./consts.js";

export const HTTPInterface = {
  SERVER_URL: SERVER_URL,

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

  PATCH: async function<T> (endpoint : string, data : T) : Promise<number> {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
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

interface LikeToy {
  item_id : string,
  like : boolean,
}

interface Toy {
  categories : string[],
  description: string,
  id : string,
  image : string,
  name : string,
  price : number
}

export default class HTTPManager {
    tasksURL : string;
    toysURL : string;
    parentURL : string;
    battlePass : string

    catalogCategoryURL : string;
    catalogSwipToysURL : string;
    catalogToyURL : string;
    catalogToysURL : string
    constructor() {
        //Main Endpoints
        this.tasksURL = "child_labor";
        this.toysURL = "toy_catalog"
        this.parentURL = "parent"
        this.battlePass = "battlePass"

        //Sub Endpoints
        this.catalogCategoryURL = "category";        
        this.catalogSwipToysURL = "swip";
        this.catalogToyURL = "toy";
        this.catalogToysURL = "toys";
    }

    /* TASK ENDPOINTS */

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
      await HTTPInterface.PATCH<{}>(`${this.tasksURL}/${id}`, {});        
    }
    
    /* TOY CATALOG ENDPOINTS */

    async createCategoryForUser(id : string) : Promise<string> {
      return await HTTPInterface.POST<{}, string>(`${this.toysURL}/${this.catalogCategoryURL}/${id}`, {});
    }

    async deleteCategoryForUser(id : string) {
      await HTTPInterface.POST(`${this.toysURL}/${this.catalogCategoryURL}/${id}`, {});
    }

    async getToyToSwipe() : Promise<Toy> {
      return await HTTPInterface.GET(`${this.toysURL}/${this.catalogSwipToysURL}`);
    }

    async updateToyLike(likeToy : LikeToy) : Promise<void> {
      await HTTPInterface.PATCH<LikeToy>(`${this.toysURL}/${this.catalogSwipToysURL}`, likeToy);
    }

    async getToyById(id : string) : Promise<Toy> {
      return await HTTPInterface.GET<Toy>(`${this.toysURL}/${this.catalogToyURL}/${id}`);
    }

    async getToys() : Promise<Toy[]> {
      return await HTTPInterface.GET<Toy[]>(`${this.toysURL}/${this.catalogToysURL}`);
    }


}
