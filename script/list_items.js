let magic_items = null;

function fetchJSONFile(path, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                let data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

function load_and_display_items() {
    fetchJSONFile('./script/json/magic_items.json', function (data) {
        magic_items = data;
        onload_display();
    });
}

function get_icon_name(category) {
    switch(category) {
            case 'Pozione':
                return './assets/potion_icon.png';

            case 'Oggetto Meraviglioso':
                return './assets/wondrous_icon.png';

            case 'Scudo':
                return './assets/shield_icon.png';
                
            case 'Arma':
                return './assets/weapon_icon.png';
                
            case 'Armatura':
                return './assets/armor_icon.png';
                
            case 'Anello':
                return './assets/ring_icon.png';
                
            case 'Bacchetta':
                return './assets/wand_icon.png';
                
            case 'Bastone':
                return './assets/staff_icon.png';
                
            case 'Pergamena':
                return './assets/scroll_icon.png';
                
            case 'Verga':
                return './assets/rod_icon.png';
                
        }
}

function onload_display() {
    if (magic_items === null) {
        return;
    }

    let items_list = document.getElementById("items_list");
    for (let i = 0; i < magic_items.length; i++) {
        // add a li to the list with a div with an image and a span with the item name as a link
        let li = document.createElement("li");
        let div = document.createElement("div");
        let img = document.createElement("img");
        let a = document.createElement("a");
        img.src = get_icon_name(magic_items[i]['category']);
        img.alt = magic_items[i]['category']
        a.href = "./magic_item.html?id=" + magic_items[i]['id'];
        a.target = "_self";
        a.innerHTML = magic_items[i]['name'];
        a.className = "rarity_" + magic_items[i]['rarity'];
        div.appendChild(img);
        div.appendChild(a);
        li.appendChild(div);
        li.className = "item_li";
        div.onclick = on_click_trigger_inner_a;
        items_list.appendChild(li);
    }
}

function search_bar() {
  // Declare variables
  let input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('search_bar');
  filter = input.value.toUpperCase();

  // first of all check if the input is the rarity of the item
    let target_rarity = -1;
    switch (filter) {
        case 'COMUNE':
            target_rarity = 0;
            break;
        case 'NON COMUNE':
            target_rarity = 1;
            break;
        case 'RARO':
            target_rarity = 2;
            break;
        case 'MOLTO RARO':
            target_rarity = 3;
            break;
        case 'LEGGENDARIO':
            target_rarity = 4;
            break;
    }
    if (target_rarity !== -1) {
        // if the input is the rarity of the item, filter the list by rarity
        let items_list = document.getElementById("items_list");
        let items = items_list.getElementsByTagName("li");
        for (let i = 0; i < items.length; i++) {
            let rarity = parseInt(items[i].getElementsByTagName("a")[0].className.split('_')[1]);
            if (rarity !== target_rarity && (target_rarity !== 4 || (target_rarity === 4 && rarity < 4))) {
                items[i].style.display = "none";
            }
            else {
                items[i].style.display = "";
            }
        }
        return;
    }

  ul = document.getElementById("items_list");
  li = ul.getElementsByTagName('li');

  if (filter.length === 1) {
      // if the input is a single character, filter the list by the first letter of the name
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.charAt(0) !== filter) {
        li[i].style.display = "none";
      } else {
        li[i].style.display = "";
      }
    }
    return;
  }

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    let found_idx = txtValue.toUpperCase().indexOf(filter)
    if (found_idx > -1 && (found_idx === 0 || txtValue[found_idx - 1] === ' ')) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function on_click_trigger_inner_a(event) {
    // get the event target. It should be a div with an a inside
    let target = event.target;
    if (target.tagName !== 'DIV') {
        return;
    }
    let a = target.getElementsByTagName('a')[0];
    if (a === undefined) {
        return;
    }
    // get the href of the a tag
    let href = a.getAttribute('href');
    // open the link in the same tab
    window.open(href, '_self');
}