use super::categories::Categories;
use super::category::Category;
use crate::toy_catalog::toys::Toys;
use rand::seq::SliceRandom;
use rand::Rng;
use std::ops::Range;

pub struct Analytics {
    pub categories: Categories,
    score: f32,
}

type ItemId<'a> = String;

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
        for c in self.categories.iter() {
            total -= c.score;
            if total <= 0.0 {
                let items: Vec<_> = c.items.iter().cloned().collect();
                return items.choose(&mut rng).unwrap().to_string();
            }
        }

        let items: Vec<_> = self
            .categories
            .last()
            .unwrap()
            .items
            .iter()
            .cloned()
            .collect();
        return items.choose(&mut rng).unwrap().to_string();
    }

    pub fn add_review(&mut self, item_id: &str, categories: &Vec<String>, liked: bool) -> bool {
        let base_factor = if liked { 2.0 } else { 0.4 };

        if self.categories.iter().all(|c| !c.items.contains(item_id)) {
            return false;
        }

        for category in self
            .categories
            .iter_mut()
            .filter(|Category { id, .. }| categories.contains(&id.to_string()))
        {
            let depth_factor = 1.0 + (category.depth() as f32 * 0.1);
            let adjustment_factor = base_factor * depth_factor;

            self.score += (category.score * adjustment_factor) - category.score;

            category.score *= adjustment_factor;
        }

        self.remove_item(item_id);
        true
    }

    pub fn add_category(&mut self, category: Category) {
        self.categories.push(category);
        self.score += 1.0;
    }

    pub fn remove_item(&mut self, item_id: &str) {
        self.categories.retain_mut(|c| {
            c.items.remove(item_id);
            if c.items.is_empty() {
                self.score -= c.score;
            }
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
                return true;
            } else {
                c.items = c
                    .items
                    .difference(&removed_items)
                    .into_iter()
                    .cloned()
                    .collect();
                false
            }
        });
    }

    pub fn limit_prices(
        &mut self,
        all_categories: &Categories,
        old_price_born: &Range<u32>,
        price_born: &Range<u32>,
        toys: &Toys,
    ) {
        if old_price_born.start <= price_born.start && old_price_born.end >= price_born.end {
            self.categories.retain_mut(|c| {
                c.items.retain(|toy_id| {
                    let toy = toys.get(toy_id.as_str()).unwrap();
                    price_born.contains(&toy.price)
                });
                if c.items.is_empty() {
                    self.score -= c.score;
                }
                !c.items.is_empty()
            });
        } else {
            self.categories.retain_mut(|c| {
                let toy_ids = &all_categories.get(&c.id).unwrap().items;
                c.items = toy_ids
                    .iter()
                    .filter(|toy_id| price_born.contains(&toys.get(toy_id.as_str()).unwrap().price))
                    .cloned()
                    .collect();
                if c.items.is_empty() {
                    self.score -= c.score;
                }
                !c.items.is_empty()
            });
        }
    }
}
