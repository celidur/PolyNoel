use serde::{Deserialize, Serialize};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Serialize, Deserialize, ToSchema, Debug, Clone, Copy, Default)]
pub enum TaskStatus {
    #[default]
    NotDone,
    Pending,
    Done,
}

#[derive(Serialize, Deserialize, ToSchema, Debug, Default, Clone)]
pub struct Task {
    pub id: String,
    pub name: String,
    pub status: TaskStatus,
    /// This is a string representing a date
    pub deadline: Option<String>,
    /// This represent a number of day
    pub recurrent_interval: Option<u16>,
}

impl Task {
    const fn new(
        id: String,
        name: String,
        status: TaskStatus,
        deadline: Option<String>,
        recurrent_interval: Option<u16>,
    ) -> Self {
        Self {
            id,
            name,
            status,
            deadline,
            recurrent_interval,
        }
    }
}

#[derive(Serialize, Deserialize, ToSchema, Debug, Default)]
pub struct CreateTask {
    name: String,
    deadline: Option<String>,
    recurrent_interval: Option<u16>,
}

impl CreateTask {
    pub fn build(self) -> Task {
        let id = Uuid::new_v4();
        let status = TaskStatus::NotDone;
        Task::new(
            id.to_string(),
            self.name,
            status,
            self.deadline,
            self.recurrent_interval,
        )
    }
}
