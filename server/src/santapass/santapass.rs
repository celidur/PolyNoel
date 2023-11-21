use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

#[derive(Clone, Debug, Serialize, Deserialize, ToSchema)]
pub struct SantPass {
    pub toy: String,
    pub points: u32,
}

impl SantPass {}
