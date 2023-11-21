import { Http2ServerRequest } from "http2";
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
  POST_NO_RESPONSE: async function<T> (endpoint : string, data : T) : Promise<void> {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
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
        'accept': '*/*'
      },
    });
    return response.status;
  },
};


export interface CreateTask {
  deadline?: string,
  name : string,
  recurrent_interval? : number
}

export interface Task extends CreateTask {  
  id : string,  
  status : TaskStatus,  
}

export interface LikeToy {
  item_id : string,
  like : boolean,
}

export interface Toy {
  categories : string[],
  description: string,
  id : string,
  image : string,
  name : string,
  price : number
}

export interface ToyWithScore extends Toy {
  score: number
}

export enum TaskStatus {
  NotDone = "NotDone",
  Pending = "Pending",
  Done = "Done",
}

export interface NewPrice {
  inferior: number,
  superior : number,
}

export interface SimpleCategory{
  id :	string
  is_selected :	boolean
  name :	string
}

export interface Category {
  category : string[]
  id : string
  items : string[]
  name : string
  score: number
  }

  export interface UpdateRank {
    item_id :	string
    rank : number
  }

  interface SantaPassId {
    points: number,
    toy: string
  }

  export interface SantaPass {
    points: number,
    toy: Toy
  }

export default class HTTPManager {
    tasksURL : string;
    toysURL : string;
    parentURL : string;
    battlePassURL : string

    catalogCategoryURL : string;
    catalogSwipToysURL : string;
    catalogToyURL : string;
    catalogToysURL : string;
    priceBornURL : string;
    rankURL : string;

    constructor() {
        //Main Endpoints
        this.tasksURL = "child_labor";
        this.toysURL = "toy_catalog"
        this.parentURL = "parent"
        this.battlePassURL = "santapass"

        //Sub Endpoints
        this.catalogCategoryURL = "category";        
        this.catalogSwipToysURL = "swip";
        this.catalogToyURL = "toy";
        this.catalogToysURL = "toys";
        this.priceBornURL = "price_born";
        this.rankURL = "rank";
    }

    /* TASK ENDPOINTS */

    async fetchAllTasks() : Promise<Task[]> {
        const tasks = await HTTPInterface.GET<Task[]>(`${this.tasksURL}/`);                
        return tasks;
    }

    async createNewTask(data : CreateTask) : Promise<Task> {
        const newTaskId = await HTTPInterface.POST<CreateTask, string>(`${this.tasksURL}/`, data);                

        const newTask = data as Task;
        newTask.id = newTaskId;
        newTask.status = TaskStatus.NotDone;

        return newTask;
    }

    async deleteTask(id : string) : Promise<void> {
        await HTTPInterface.DELETE(`${this.tasksURL}/${id}`);        
    }

    async updateTaskStatus(id : string, status : TaskStatus) : Promise<void> {
      await HTTPInterface.PATCH<{}>(`${this.tasksURL}/${id}/${status}`, {});        
    }
    
    /* TOY CATALOG ENDPOINTS */
    
    async createCategoryForUser(id : string) : Promise<void> {
      await HTTPInterface.POST_NO_RESPONSE<{}>(`${this.toysURL}/${this.catalogCategoryURL}/${id}`, {});
    }

    async selectAllCategories() : Promise<void> {
      await HTTPInterface.PUT<{}>(`${this.toysURL}/${this.catalogCategoryURL}`, {});
    }
    
    async deleteCategoryForUser(id : string) {
      await HTTPInterface.DELETE(`${this.toysURL}/${this.catalogCategoryURL}/${id}`);
    }

    async getAllCategories() : Promise<SimpleCategory[]> {
      const simpleCategories = await HTTPInterface.GET<SimpleCategory[]>(`${this.toysURL}/${this.catalogCategoryURL}`);                
      return simpleCategories;
    }

    async getCategoryOfToy(id : string) : Promise<Category> {
      const category = await HTTPInterface.GET<Category>(`${this.toysURL}/${this.catalogCategoryURL}/${id}`);                
      return category;
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

    async getToyIds() : Promise<{[key:string] : number}> {
      return await HTTPInterface.GET<{[key:string] : number}>(`${this.toysURL}/${this.catalogToysURL}`);
    }

    async getToys() : Promise<ToyWithScore[]> {
      const toyIds = await this.getToyIds();
      const toys : ToyWithScore[] = [];
      for(let [id, score] of Object.entries(toyIds)){
        const toy = await this.getToyById(id);
        const toyWithScore = toy as ToyWithScore;
        toyWithScore.score = score;
        toys.push(toyWithScore);
      }
      return toys;
    }

    /* Rank */

    async getRankById(id : string) : Promise<number> {
      return await HTTPInterface.GET<number>(`${this.toysURL}/${this.rankURL}/${id}`);
    }

    async updateRank(rankUpdate : UpdateRank) : Promise<void> {
      await HTTPInterface.PATCH<UpdateRank>(`${this.toysURL}/${this.rankURL}`, rankUpdate);
    } 
    
    async removeLikeToy(id : string) : Promise<void> {
      await HTTPInterface.DELETE(`${this.toysURL}/${this.catalogToyURL}/${id}`);
    }

    /* Prices */

    async getPriceBorn() : Promise<NewPrice> {
      return await HTTPInterface.GET(`${this.toysURL}/${this.priceBornURL}`);
    }

    async setPriceBorn(price : NewPrice) : Promise<void> {
      await HTTPInterface.PUT<NewPrice>(`${this.toysURL}/${this.priceBornURL}`, price);
    }

    /* SantaPass */

    async getSantaPass() : Promise<SantaPass[]> {
      const santapasses : SantaPass[] = [];
      const santapassIds = await HTTPInterface.GET<SantaPassId[]>(`${this.battlePassURL}/`);
      for(let santapassId of santapassIds) {
        const toy = await this.getToyById(santapassId.toy);
        santapasses.push({points: santapassId.points, toy : toy});
      }
      return santapasses;
    }

    async addToSantaPass(santapassId : SantaPassId) : Promise<void> {
      await HTTPInterface.POST_NO_RESPONSE<SantaPassId>(`${this.battlePassURL}/`, santapassId);
    }

    async deleteInSantaPass(id : string) : Promise<void> {
      await HTTPInterface.DELETE(`${this.battlePassURL}/${id}`);
    }
}
