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
  ul = document.getElementById("items_list");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
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