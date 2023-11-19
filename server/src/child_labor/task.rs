use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

type Day = u16;

#[derive(Serialize, Deserialize, JsonSchema, Debug, Default, Clone)]
pub struct Task {
    pub id: String,
    pub name: String,
    pub need_review: bool,
    /// This is a string representing a date
    pub deadline: String,
    pub recurrent_interval: Option<Day>,
}

impl Task {
    const fn new(
        id: String,
        name: String,
        need_review: bool,
        deadline: String,
        recurrent_interval: Option<Day>,
    ) -> Self {
        Self {
            id,
            name,
            need_review,
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
        let need_review = false;
        Task::new(
            id.to_string(),
            self.name,
            need_review,
            self.deadline,
            self.recurrent_interval,
        )
    }
}
