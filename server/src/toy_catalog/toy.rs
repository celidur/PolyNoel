use std::{fs, io::BufReader, path::Path};

use serde::{Deserialize, Deserializer};

#[derive(Default, Debug, Clone, PartialEq, Deserialize)]
pub struct Toy {
    pub id: String,
    pub name: String,
    pub description: String,
    #[serde(deserialize_with = "from_price")]
    pub price: u32,
    pub image: String,
}

fn from_price<'de, D>(deserializer: D) -> Result<u32, D::Error>
where
    D: Deserializer<'de>,
{
    let s: String = Deserialize::deserialize(deserializer)?;
    let price: String = s.replace("$", "");
    let price: String = price.replace(",", "");
    let price: String = price.replace(".", "");
    let price = price.parse().unwrap();
    Ok(price)
}

impl Toy {
    pub fn read_toy(path: &Path) -> Self {
        let file = fs::File::open(path).unwrap();
        let reader = BufReader::new(file);
        let toy: Toy = serde_json::from_reader(reader).unwrap();
        toy
    }
}
