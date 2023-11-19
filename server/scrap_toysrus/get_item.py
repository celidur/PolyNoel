import json
import requests
from bs4 import BeautifulSoup
import os

# make directoy data if not exists
if not os.path.exists('data'):
    os.makedirs('data')

if not os.path.exists('data/categories'):
    os.makedirs('data/categories')

if not os.path.exists('data/items'):
    os.makedirs('data/items')

base = 'https://www.toysrus.ca/fr/search-updategrid?cgid={}&start={}&sz=48'

with open('data/categories.json', 'r', encoding='utf-8') as f:
    categories = json.load(f)

    for i in categories:
        if os.path.exists('data/categories/{}.json'.format(i['id'])):
            continue

        new_item = {'name': i['name'], 'id': i['id'], 'category': i['category']}

        print(new_item['name'])
        items = []
        i = 0
        while True:
            url = base.format(new_item['id'], i)
            response = requests.get(url)
            if response.ok:
                soup = BeautifulSoup(response.text, 'html.parser')
                items_ = soup.find_all('div', {'role': 'article'})
                for item_ in items_:
                    item = {'id': item_.get("data-pid", None)}
                    max_items = item_.get("aria-setsize", None)
                    current = item_.get("aria-posinset", None)

                    item['image'] = img.get('src', None).split('?')[0]
                    if not item['image'].startswith('https://www.toysrus.ca'):
                        continue

                    items.append(item['id'])

                    if os.path.exists('data/items/{}.json'.format(item['id'])):
                        continue

                    img = item_.find('img', {'class': "tile-image"})
                    h2 = item_.find('h2', {'class': 'b-product_tile-title'})

                    item['name'] = ' '.join(h2.get_text(strip=True).split())
                    item['price'] = item_.find('span', {'class': 'b-price-value'}).get_text(strip=True)

                    item['description'] = ' '.join(img.get('alt', None).split())
                    item['url'] = "https://www.toysrus.ca" + h2.find('a').get('href', None)

                    with open('data/items/{}.json'.format(item['id']), 'w', encoding='utf-8') as json_file:
                        json.dump(item, json_file, ensure_ascii=False, indent=4)

                print(int(current) / int(max_items))
                i += 48
                if current == max_items:
                    break
            else:
                print("Error")

        new_item['items'] = items

        with open('data/categories/{}.json'.format(new_item['id']), 'w', encoding='utf-8') as json_file:
            json.dump(new_item, json_file, ensure_ascii=False, indent=4)
