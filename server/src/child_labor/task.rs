use chrono::{DateTime, Duration, Local};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
struct Task {
    name: String,
    recurrent: bool,
    deadline: DateTime<Local>,
    // recurrent_interval: Duration,
}
