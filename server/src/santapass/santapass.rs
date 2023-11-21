use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::toy_catalog::toy::Toy;

#[derive(Clone, Debug, Serialize, Deserialize, ToSchema)]
pub struct SantPass {
    pub toy: Toy,
    pub points: u32,
}

impl SantPass {
    pub fn new(toy: Toy, points: u32) -> Self {
        Self { toy, points }
    }
}
