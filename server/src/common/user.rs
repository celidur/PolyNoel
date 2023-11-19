use crate::child_labor::tasks::Tasks;
use crate::toy_catalog::algorithm::analytics::Analytics;
use crate::toy_catalog::algorithm::categories::Categories;
use crate::toy_catalog::algorithm::category::Category;
use std::collections::HashSet;
use std::ops::Range;

pub struct User {
    pub tasks: Tasks,
    pub selected_item: HashSet<String>,
    pub disliked_item: HashSet<String>,
    pub price_born: Range<u32>,
    pub analytics: Analytics,
}

impl User {
    pub fn new(categories: &Categories) -> Self {
        Self {
            tasks: Tasks::default(),
            selected_item: HashSet::new(),
            disliked_item: HashSet::new(),
            price_born: 0..u32::MAX,
            analytics: Analytics::new(categories),
        }
    }

    pub fn add_category(&mut self, category: Category) {
        // TODO: add item only respect privce and does not exist in selected_item and disliked_item
        self.analytics.add_category(category);
    }

    pub fn remove_category(&mut self, category: &str) {
        self.analytics.remove_category(category);
    }

    pub fn modify_price_born(&mut self, price_born: Range<u32>) {
        // TODO: modify item in analytics to respect price_born
        self.price_born = price_born;
    }
}
