load_stashes();
load_magic_tables();
load_magic_items();
load_art()
load_gems()
load_equipment()

function get_art_gems_container(art_gems_table) {
    // remove any div in the page with class 'art_gems_container'
    let art_gems_container = document.getElementsByClassName('art_gems_container');
    while (art_gems_container.length > 0) {
        art_gems_container[0].remove();
    }

    // create a div
    let div = document.createElement('div');
    div.className = 'art_gems_container';

    if (art_gems_table.length === 0) {
        return null;
    }

    for (let i in art_gems_table) {
        let item = art_gems_table[i];
        // create a div for each art or gem item
        let item_div = document.createElement('div');
        item_div.className = 'art_gems_item_container';
        if (item['type'] === 'art') {
            // put an image with source './assets/art.png' in the container
            let art_img = document.createElement('img');
            art_img.src = './assets/art_icon.png';
            art_img.className = 'art_gems_icon';
            item_div.appendChild(art_img);
        }
        else if (item['type'] === 'gem') {
            // put an image with source './assets/art.png' in the container
            let art_img = document.createElement('img');
            art_img.src = './assets/gem_icon.png';
            art_img.className = 'art_gems_icon';
            item_div.appendChild(art_img);
        }
        // put a text in the container
        let art_text = document.createElement('p');
        art_text.className = 'art_gems_text';
        art_text.innerHTML = item['name'] + ' (' + item['value'] + ' ' + 'mo)';
        item_div.appendChild(art_text);
        // put the container in the div
        div.appendChild(item_div);
    }
    return div;
}

function get_magic_items_container(magic_items_table) {
    // remove any div in the page with class 'magic_items_container'
    let magic_items_container = document.getElementsByClassName('magic_items_container');
    while (magic_items_container.length > 0) {
        magic_items_container[0].remove();
    }

    // create a div
    let div = document.createElement('div');
    div.className = 'magic_items_container';

    if (magic_items_table.length === 0) {
        return null;
    }

    for (let i in magic_items_table) {
        let item = magic_items_table[i];
        // create a div for each magic item
        let item_div = document.createElement('div');
        item_div.className = 'magic_items_item_container';

        // add an icon to the container
        let item_img = document.createElement('img');
        item_img.className = 'magic_items_icon';

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

        item_img.className = 'magic_items_icon';
        item_div.appendChild(item_img);

        // put a text in the container
        let item_text = document.createElement('p');
        item_text.className = 'magic_item_text';

        switch(item['category']) {
            case 'Pozione':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
            case 'Oggetto Meraviglioso':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
            case 'Scudo':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
            case 'Arma':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + item['instance']['name'] + ', ' +
                    rarity_to_string(item['rarity']) + ')';
                break;
            case 'Armatura':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + item['instance']['name'] + ', ' +
                    rarity_to_string(item['rarity']) + ')';
                break;
            case 'Anello':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
            case 'Bacchetta':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
            case 'Bastone':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
            case 'Pergamena':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
            case 'Verga':
                item_text.innerHTML = "<a href='./magic_item.html?id=" + item['id'] + "' target='_blank'>" + item['name'] + "</a>" + ' (' + rarity_to_string(item['rarity']) + ')';
                break;
        }

        item_div.appendChild(item_text);
        // put the container in the div
        div.appendChild(item_div);
    }
    return div;
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

function generate_stash() {
    // remove any list in the page with class 'stash_list'
    let stash_list = document.getElementsByClassName('stash_list');
    while (stash_list.length > 0) {
        stash_list[0].remove();
    }

    // get the value of the radio button in the page
    let stash_name = document.querySelector('input[name="grado"]:checked').value;

    let stash = roll_stash(stash_name);
    // alert(JSON.stringify(stash));

    // if radio button was not checked, return
    if (stash === null) {
        return;
    }

    // create an unordered list
    let ul = document.createElement('ul');
    ul.className = 'stash_list';

    // get the coins container
    let coins_container = get_coins_container(stash['coins']);

    // get the art gems container
    let art_gems_container = get_art_gems_container(stash['art_or_gems']);

    // get the magic items container
    let magic_items_container = get_magic_items_container(stash['magic_items']);

    // put the coins container in the unordered list
    if (coins_container !== null) {
        // create a list item
        let li = document.createElement('li');
        li.innerHTML = 'Monete:';
        li.appendChild(coins_container);
        ul.appendChild(li);
    }

    // put the art gems container in the unordered list
    if (art_gems_container !== null) {
        // create a list item
        let li = document.createElement('li');
        li.innerHTML = "Oggetti d'Arte e Gemme:";
        li.appendChild(art_gems_container);
        ul.appendChild(li);
    }

    // put the magic items container in the unordered list
    if (magic_items_container !== null) {
        // create a list item
        let li = document.createElement('li');
        li.innerHTML = "Oggetti Magici:";
        li.appendChild(magic_items_container);
        ul.appendChild(li);
    }

    // put the unordered list in the page
    document.body.appendChild(ul);

}

