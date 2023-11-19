from bs4 import BeautifulSoup
import requests
import json
import os

if not os.path.exists('data'):
    os.makedirs('data')

base = 'https://www.toysrus.ca'
# URL de la page à récupérer
url = base + '/fr/home'

def routine_category(li_item, default_category):
    categories = []
    dict_ = {}
    for link in li_item.find_all('a'):
        category_name = link.get_text(strip=True).replace('\n', '')
        category_name = ' '.join(category_name.split())
        category_id = link.get('id', None)
        category = link.get('href', default_category).split('/')
        print(category_name)
        # remove fr and toysrus items
        category = [x for x in category if x != 'fr' and x != 'toysrus' and x != '']
        if category_id is None and category_name != 'VOIR TOUT':
            url = base + link.get('href', None)
            response = requests.get(url)
            if response.ok:
                soup = BeautifulSoup(response.text, 'html.parser')
                category_id = soup.find('body').get('data-querystring', None).replace('cgid=', '')

        if category_name != 'VOIR TOUT':
            item = {}
            item['name'] = category_name
            item['id'] = category_id
            dict_[category[-1]] = item['id']
            item['category'] = [dict_[x] for x in category[:-1]]
            categories.append(item)
    return categories


# Effectuer une requête GET
response = requests.get(url)
dict_ = {}
if response.ok:
    soup = BeautifulSoup(response.text, 'html.parser')
    # Recherche du <li> spécifique
    li_items = soup.find_all('li', {'role': 'none', 'class': 'n-main_menu-item'})
    # print(li_items)

    category_id_ = 'YoWnZV46QhOKwjAMbt3Ibw'
    age_id_ = 'MdvawtJvSomMvUa1KjQc_A'

    categories = []
    for li_item in li_items:
        first_a = li_item.find('a') if li_item else None
        if first_a and first_a.get('id') == category_id_:  # ID of category
            categories.extend(routine_category(li_item, 'Categorie'))
        elif first_a and first_a.get('id') == age_id_:
            categories.extend(routine_category(li_item, 'age'))

    print(categories)
    # Écrire les données dans un fichier JSON
    with open('data/categories.json', 'w', encoding='utf-8') as json_file:
        json.dump(categories, json_file, ensure_ascii=False, indent=4)
else:
    print('Error')
