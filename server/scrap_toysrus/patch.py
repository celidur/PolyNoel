import os
import json

dict_categories = {}
for category_file in os.listdir('data/categories'):
    with open('data/categories/' + category_file, 'r', encoding='utf-8') as category_f:
        category = json.load(category_f)
        dict_categories[category['id']] = category['items']

for filename in os.listdir('data/items'):
    # open each file
    with open('data/items/' + filename, 'r', encoding='utf-8') as json_file:
        # load the json
        item = json.load(json_file)
        # print the name
        item['price'] = int(item['price'].replace('$', '').replace('.', '').replace(',', ''))
        item_id = item['id']

        categories = []

        for id_category, items in dict_categories.items():
            if item_id in items:
                categories.append(id_category)

        item['categories'] = categories

        with open('data/items/' + filename, 'w', encoding='utf-8') as item_f:
            json.dump(item, item_f, ensure_ascii=False, indent=4)
            print("Item modified: " + item['name'])
