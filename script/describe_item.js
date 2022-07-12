
let magic_items_description = null

let images_folder = "./items_assets/";

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

function load_and_display_item() {
    fetchJSONFile('./script/json/magic_items_with_description.json', function (data) {
        magic_items_description = data;
        onload_display();
    });
}

function get_item_by_id(id) {
    for (let i = 0; i < magic_items_description.length; i++) {
        if (magic_items_description[i]["id"] === id) {
            return magic_items_description[i];
        }
    }
    return null;
}

function get_image_name(item) {
    // if item["image_name"] is present, return it
    if (item["image_name"] !== undefined) {
        if (item["image_name"] !== "None") {
            return item["image_name"];
        }
        return null;
    }

    // get item name and replace accents with normal letters
    let item_name = item["name"].replace(/[áàäâ]/g, "a").replace(/[éèëê]/g, "e").replace(/[íìïî]/g, "i").
        replace(/[óòöô]/g, "o").replace(/[úùüû]/g, "u");

    // escape apostrophes and replace spaces with hyphens
    item_name = item_name.replace(/'/g, "").replace(/ /g, "-");

    // append jpeg extension
    return item_name + ".jpeg";
}

function get_rarity_string(rarity) {
    switch (rarity) {
        case 0:
            return "Comune";
        case 1:
            return "Non Comune";
        case 2:
            return "Raro";
        case 3:
            return "Molto Raro";
        case 4:
            return "Leggendario";
        case 5:
            return "Unico";
        default:
            return "Sconosciuta";
    }
}

function display_item(item_id) {
    // Get the item
    let item = get_item_by_id(item_id);
    if (item === null) {
        document.body.innerHTML = "<h2>404: Ops! Un mago ha fatto sparire questo oggetto magico</h2>";
        return;
    }

    // set the title
    document.title = item["name"] + " | DnD 5e Generatore di tesori";

    // set page keywords
    let keywords = item["name"] + ", " + item["category"] + ", " + get_rarity_string(item["rarity"]) + ", D&D, 5e, dnd, oggetto magico";
    document.querySelector("meta[name='keywords']").setAttribute("content", keywords);

    // set page description
    let description = "Descrizione dell'oggetto magico " + item["name"] + ", appartenente alla categoria " +
        item["category"] + ", di rarità " + get_rarity_string(item["rarity"]) + ", da D&D quinta edizione (5e).";
    document.querySelector("meta[name='description']").setAttribute("content", description);

    let html = "<div class='header-container'>"

    // get the image
    let image_name = get_image_name(item);
    if (image_name !== null) {
        html += "<img src='" + images_folder + image_name + "' alt='" + item["name"] + "' class='item_image'>";
    }

    // Display the item
    html += "<h2>" + item["name"] + "</h2></div>";

    html += "<div class='description_container'>";

    // display the type of the item with format "<b>Categoria</b>: <type>"
    html += "<p><b>Categoria:</b> " + item["category"] + "</p>";

    // display the rarity of the item with format "<b>Rarità</b>: <rarity>"
    html += "<p><b>Rarit&agrave;:</b> " + get_rarity_string(item["rarity"]) + "</p>";

    // display whether or not the item requires a bond with the item with format "<b>Richiede legame</b>: <bond>"
    if (item["bond"] === true) {
        html += "<p><b>Richiede legame</b>: S&igrave;</p>";
    }
    else {
        html += "<p><b>Richiede legame</b>: No</p>";
    }

    html += "<div class='effetto_container'>"
    // display the description of the item with format "<b>Effetto</b>: <div><description></div>"
    html += "<p><b>Effetto:</b></p>"
    html += item["description"];

    html += "</div></div>";

    // add the html to the body
    document.body.innerHTML += html;
}

function get_id_from_url_get_parameters() {
    let url_get_parameters = new URLSearchParams(window.location.search);
    let item_id = parseInt(url_get_parameters.get("id"));

    if (item_id === null) {
        document.body.innerHTML = "<h2>404: Non hai specificato un oggetto magico!</h2>";
        return null;
    }

    return item_id;
}

function onload_display() {
    let item_id = get_id_from_url_get_parameters();
    if (item_id === null) {
        return;
    }
    display_item(item_id);
}
