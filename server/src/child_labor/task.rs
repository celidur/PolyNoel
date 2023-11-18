use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

type Day = u16;

#[derive(Serialize, Deserialize, JsonSchema)]
pub struct Task {
    name: String,
    recurrent: bool,
    /// This is a string representing a date
    deadline: String,
    recurrent_interval: Option<Day>,
}
