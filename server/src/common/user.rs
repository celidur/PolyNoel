use crate::child_labor::tasks::Tasks;
use crate::toy_catalog::algorithm::analytics::Analytics;
use crate::toy_catalog::algorithm::categories::Categories;
use crate::toy_catalog::algorithm::category::Category;
use crate::toy_catalog::toys::Toys;
use std::collections::{HashMap, HashSet};
use std::ops::Range;

pub struct User {
    pub tasks: Tasks,
    pub selected_item: HashMap<String, u32>,
    pub disliked_item: HashSet<String>,
    pub price_born: Range<u32>,
    pub analytics: Analytics,
}

impl User {
    pub fn new(categories: &Categories) -> Self {
        Self {
            tasks: Tasks::default(),
            selected_item: HashMap::new(),
            disliked_item: HashSet::new(),
            price_born: 0..u32::MAX,
            analytics: Analytics::new(categories),
        }
    }

    pub fn add_category(&mut self, mut category: Category, toys: &Toys) {
        category.items.retain(|item| {
            !self.selected_item.contains_key(item.as_str())
                && !self.disliked_item.contains(item.as_str())
                && !self.selected_item.contains_key(item.as_str())
                && self
                    .price_born
                    .contains(&toys.get(item.as_str()).unwrap().price)
        });
        self.analytics.add_category(category);
    }

    pub fn remove_category(&mut self, category: &str) {
        self.analytics.remove_category(category);
    }

    pub fn modify_price_born(
        &mut self,
        all_categories: &Categories,
        price_born: Range<u32>,
        toys: &Toys,
    ) {
        self.analytics.limit_prices(
            all_categories,
            &self.price_born,
            &price_born,
            &self.disliked_item,
            &self.selected_item,
            toys,
        );
        self.selected_item.retain(|key, _| {
            price_born.contains(&toys.get(key.to_uppercase().as_str()).unwrap().price)
        });

        self.price_born = price_born;
    }

    pub fn remove_toy(&mut self, item_id: &str) -> bool {
        self.selected_item.remove(item_id).is_some()
    }
}
