import { SERVER_URL } from "./consts.js";

export const HTTPInterface = {
  SERVER_URL: `${SERVER_URL}/api`,

  GET: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`);
    return await response.json();
  },

  POST: async function (endpoint, data) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    return await response.json();
  },

  DELETE: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "DELETE",
    });
    return response.status;
  },

  PATCH: async function (endpoint) {
    const response = await fetch(`${this.SERVER_URL}/${endpoint}`, {
      method: "PATCH",
    });
    return response.status;
  },

  PUT: async function (endpoint, data) {
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

export default class HTTPManager {
    constructor() {
        //Main Endpoints
        this.tasksURL = "tasks";
        this.toysURL = "toys"
        this.parentURL = "parent"
        this.battlePass = "battlePass"

        //Sub Endpoints
        this.chosenToysURL = "chosen";        
        this.randomToysURL = "random";
    }

    async fetchAllTasks() {
        const tasks = await HTTPInterface.GET(`${this.tasksURL}`);
        return tasks;
    }

    async fetchAllChosenToys() {
        const toys = await HTTPInterface.GET(`${this.toysURL}/${this.chosenToysURL}`);
        return toys;
    }

    async fetchRandomToys() {
        const toys = await HTTPInterface.GET(`${this.toysURL}/${this.randomToysURL}`);
        return toys;
    }
}
