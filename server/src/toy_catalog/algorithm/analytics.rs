use super::categories::Categories;
use super::category::Category;
use rand::Rng;

type CategoryId = String;

pub struct Analytics {
    categories: Categories,
    score: f32,
}

type ItemId<'a> = &'a str;

impl Analytics {
    pub fn new(categories: &Categories) -> Self {
        let score = categories.len() as f32;
        Self {
            categories: categories.clone(),
            score,
        }
    }

    pub fn select(&self) -> ItemId {
        let mut rng = rand::thread_rng();
        let mut total = rng.gen_range(0.0..self.score);
        for Category { id, score, .. } in self.categories.iter() {
            total -= score;
            if total <= 0.0 {
                break;
            }
        }
        unreachable!("We shouldn't not run out of item before the end");
    }

    pub fn add_review(&mut self, category: &[&str], liked: bool) {
        let factor = if liked { 2.0 } else { 0.5 };
        let factor = factor / category.len() as f32;
        for Category { score, .. } in self
            .categories
            .iter_mut()
            .filter(|Category { id, .. }| category.contains(&id.as_str()))
        {
            self.score += (*score * factor) - *score;
            *score *= factor;
        }
    }

    pub fn add_category(&mut self, category: Category) {
        self.categories.push(category);
        self.score += 1.0;
    }

    pub fn remove_item(&mut self, item_id: &str) {
        self.categories.retain_mut(|c| {
            c.items.remove(item_id);
            !c.items.is_empty()
        })
    }

    pub fn remove_category(&mut self, category_id: &str) {
        let Some(category) = self.categories.iter().find(|c| c.id == category_id) else {
            return;
        };
        let removed_items = category.items.clone();
        self.categories.retain_mut(|c| {
            if c.id != category_id {
                return false;
            } else {
                c.items = c
                    .items
                    .difference(&removed_items)
                    .into_iter()
                    .cloned()
                    .collect();
                true
            }
        });
    }
}
