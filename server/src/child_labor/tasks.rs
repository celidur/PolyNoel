use super::task::{CreateTask, Task, TaskStatus};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct Tasks {
    pub tasks: Vec<Task>,
}

impl Tasks {
    pub fn push(&mut self, task: CreateTask) -> &Task {
        self.tasks.push(task.build());
        self.tasks.last().unwrap()
    }
    pub fn remove(&mut self, id: &str) -> bool {
        if let Some(i) = self.tasks.iter().position(|t| t.id == id) {
            self.tasks.remove(i);
            true
        } else {
            false
        }
    }
    pub fn mark(&mut self, id: &str, status: TaskStatus) -> bool {
        if let Some(task) = self.tasks.iter_mut().find(|t| t.id == id) {
            task.status = status;
            true
        } else {
            false
        }
    }
}
