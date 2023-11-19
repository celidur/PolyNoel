use crate::toy_catalog::categories::Categories;

type CategoryId = String;

struct Analytics {
    categories_probability: Vec<(CategoryId, f32)>,
}

impl Analytics {
    pub fn new(categories: &Categories) -> Self {
        let categories_probability = categories
            .categories
            .keys()
            .map(|c| (c.clone(), 1.0))
            .collect();
        Self {
            categories_probability,
        }
    }

    pub fn select() -> CategoryId {
        todo!()
    }

    pub fn add_review(category: String, liked: bool) {
        todo!()
    }
}
