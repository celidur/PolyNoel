use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

type Day = u16;

#[derive(Serialize, Deserialize, JsonSchema, Debug, Default)]
pub struct Task {
    pub id: String,
    pub name: String,
    /// This is a string representing a date
    pub deadline: String,
    pub recurrent_interval: Option<Day>,
}

impl Task {
    const fn new(
        id: String,
        name: String,
        deadline: String,
        recurrent_interval: Option<Day>,
    ) -> Self {
        Self {
            id,
            name,
            deadline,
            recurrent_interval,
        }
    }
}

#[derive(Serialize, Deserialize, JsonSchema, Debug, Default)]
pub struct CreateTask {
    name: String,
    deadline: String,
    recurrent_interval: Option<Day>,
}

impl CreateTask {
    pub fn build(self) -> Task {
        let id = Uuid::new_v4();
        Task::new(
            id.to_string(),
            self.name,
            self.deadline,
            self.recurrent_interval,
        )
    }
}
