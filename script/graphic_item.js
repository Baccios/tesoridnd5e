load_magic_items();
load_equipment();

function generate_magic_item(types, rarity) {

    // filter out items that are not of the specified type
    let filtered_items = [];
    if (rarity < 4) {
        for (let i = 0; i < magic_items.length; i++) {
            // find all items whose type is in the types array
            if (types.includes(magic_items[i]['category']) && magic_items[i]["rarity"] === rarity) {
                filtered_items.push(magic_items[i]);
            }
        }
    }
    else {
        for (let i = 0; i < magic_items.length; i++) {
            // find all items whose type is in the types array
            if (types.includes(magic_items[i]['category']) && (magic_items[i]["rarity"] === rarity) || magic_items[i]["rarity"] === 5) {
                filtered_items.push(magic_items[i]);
            }
        }
    }

    if (filtered_items.length === 0) {
        return null;
    }

    // get a random item from the filtered items
    let item = filtered_items[Math.floor(Math.random() * filtered_items.length)];

    // create a new object
    let result = {};
    for (let field in item) {
        if (field !== 'default_instance') {
            result[field] = item[field];
        }
    }

    if (item['category'] === 'Arma' || item['category'] === 'Armatura') {
        let instance_id = roll_rand_table(item['default_instance'])['items'];
        result['instance'] = get_equipment_by_id(instance_id, item['category'].toLowerCase());
    }

    return result;
}

function rarity_to_string(rarity) {
    switch (rarity) {
        case 0:
            return 'Comune';
        case 1:
            return 'Non Comune';
        case 2:
            return 'Raro';
        case 3:
            return 'Molto Raro';
        case 4:
            return 'Leggendario';
        case 5:
            return 'Unico';
    }
}

function generate_item() {
    // remove all divs  with class 'item_container'
    let item_containers = document.getElementsByClassName('item_container');
    while (item_containers.length > 0) {
        item_containers[0].remove();
    }

    // get the types of items to generate
    let types = [];
    // get all checkboxes of name 'item'
    let type_checkboxes = document.getElementsByName('item');
    for (let i = 0; i < type_checkboxes.length; i++) {
        if (type_checkboxes[i].checked) {
            types.push(type_checkboxes[i].value);
        }
    }

    // get the rarity of items to generate
    let rarity = parseInt(document.querySelector('input[name="rarity"]:checked').value);

    // generate the items
    let item = generate_magic_item(types, rarity);

    // create a div
    let div = document.createElement('div');
    div.className = 'item_container';

    if (item === null) {
        let item_text = document.createElement('p');
        item_text.innerHTML = 'Nessun oggetto trovato';
        div.appendChild(item_text);
        div.style.textAlign = 'center';
        div.style.fontSize = '2em';
        // add the div to the page
        document.body.appendChild(div);
        return;
    }


    // create an unordered list in the div
    let ul = document.createElement('ul');

    // create an image
    let item_img = document.createElement('img');
    item_img.className = 'item_img';

    switch(item['category']) {
        case 'Pozione':
            item_img.src = './assets/potion_icon.png';
            break;
        case 'Oggetto Meraviglioso':
            item_img.src = './assets/wondrous_icon.png';
            break;
        case 'Scudo':
            item_img.src = './assets/shield_icon.png';
            break;
        case 'Arma':
            item_img.src = './assets/weapon_icon.png';
            break;
        case 'Armatura':
            item_img.src = './assets/armor_icon.png';
            break;
        case 'Anello':
            item_img.src = './assets/ring_icon.png';
            break;
        case 'Bacchetta':
            item_img.src = './assets/wand_icon.png';
            break;
        case 'Bastone':
            item_img.src = './assets/staff_icon.png';
            break;
        case 'Pergamena':
            item_img.src = './assets/scroll_icon.png';
            break;
        case 'Verga':
            item_img.src = './assets/rod_icon.png';
            break;
    }

    // create a div for the name
    let item_div = document.createElement('div');
    item_div.className = 'item_div';
    // add some text to the li
    item_div.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>";
    item_div.appendChild(ul);
    div.appendChild(item_div);

    // create a li in the ul for the category
    let item_li = document.createElement('li');
    // put a div in the li
    let item_li_div = document.createElement('div');
    item_li_div.className = 'item_li_div';
    item_li.appendChild(item_li_div);
    // add some text to the li
    item_li_div.innerHTML = item['category'] + ' (';
    item_li_div.appendChild(item_img);
    item_li_div.innerHTML += ')';
    ul.appendChild(item_li);

    if (item['category'] === 'Arma' || item['category'] === 'Armatura') {
        // create a li in the ul for the instance
        item_li = document.createElement('li');
        // put a div in the li
        item_li_div = document.createElement('div');
        item_li_div.className = 'item_li_div';
        item_li.appendChild(item_li_div);
        // add some text to the li
        item_li_div.innerHTML = "Oggetto: " + item['instance']['name'] + " (" + item['instance']['category'] + ")";
        ul.appendChild(item_li);
    }

    // create a li in the ul for the rarity
    item_li = document.createElement('li');
    // put a div in the li
    item_li_div = document.createElement('div');
    item_li_div.className = 'item_li_div';
    item_li.appendChild(item_li_div);
    // add some text to the li
    item_li_div.innerHTML = 'Rarit&agrave;: ' + rarity_to_string(item['rarity']);
    ul.appendChild(item_li);

    // create a li in the ul for the bond
    item_li = document.createElement('li');
    // put a div in the li
    item_li_div = document.createElement('div');
    item_li_div.className = 'item_li_div';
    item_li.appendChild(item_li_div);
    // add some text to the li
    let legame = (item['bond'] === true) ? "S&igrave;" : "No";
    item_li_div.innerHTML = 'Richiede legame: ' + legame;
    ul.appendChild(item_li);

    // add the div to the page
    document.body.appendChild(div);
}