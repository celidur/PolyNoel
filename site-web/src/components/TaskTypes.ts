import { Task } from "../assets/js/http_manager";

export type TaskProp = { index: number, task : Task , onTaskClick : (removeIndex : number) => void }