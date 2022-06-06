let single_treasures = null;

let magic_tables = null;

let magic_items = null;

let equipment = null;

let gems = null;

let art = null;

let stashes = null;

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

function load_single_treasures() {
    fetchJSONFile('./script/json/single_treasure.json', function (data) {
        single_treasures = data;
    });
}

function load_magic_tables() {
    fetchJSONFile('./script/json/magic_tables.json', function (data) {
        magic_tables = data;
    });
}

function load_magic_items() {
    fetchJSONFile('./script/json/magic_items.json', function (data) {
        magic_items = data;
    });
}

function load_equipment() {
    fetchJSONFile('./script/json/equipment.json', function (data) {
        equipment = data;
    });
}

function load_gems() {
    fetchJSONFile('./script/json/gems.json', function (data) {
        gems = data;
    });
}

function load_art() {
    fetchJSONFile('./script/json/art.json', function (data) {
        art = data;
    });
}

function load_stashes() {
    fetchJSONFile('./script/json/stashes.json', function(data) {stashes = data;});
}


function roll_die(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function roll_die_str(formatted_str) {
  // get the number of dice as the first number until letter "d"
  let num_dice = parseInt(formatted_str.substring(0, formatted_str.indexOf("d")));
  // get the number of sides as the last number
  let num_sides = parseInt(formatted_str.substring(formatted_str.lastIndexOf("d") + 1));

  let result = 0;
  for (let i = 0; i < num_dice; i++) {
      result += roll_die(num_sides);
  }

  // if then there is character "x" multiply the value of the result by the number after "x"
  if (formatted_str.indexOf("x") !== -1) {
      result *= parseInt(formatted_str.substring(formatted_str.indexOf("x") + 1));
  }

  return result;
}

function roll_coins(coin_table) {
  //for all attributes in coin_table, roll the die
  let result = {};
  for (let attribute in coin_table) {
      result[attribute] = roll_die_str(coin_table[attribute]);
  }
  return result;
}

function roll_rand_table(table, item_fields=["items"]) {

  // if table is not an object or its attribute 'obj_type' is not 'rand_table', return table
  if (typeof table !== 'object' || table['obj_type'] !== 'rand_table') {
      return {"items": table};
  }

  let picker = Math.floor(Math.random() * table['die']) + 1;

  let target_index;
  // get the corresponding index in the 'die_map' attribute
  for (const [index, element] of table['die_map'].entries()) {
    if (picker <= element) {
      target_index = index;
      break;
    }
  }

  let result = {};
  for (let field of item_fields) {
    result[field] = table[field][target_index];
  }

  if (item_fields.length === 1 && item_fields[0] === "items") {
      // recursive call, as the result may be a rand table itself
      return roll_rand_table(result["items"], item_fields);
  }
  return result;
}

function roll_single_treasure(gs) {
    if (single_treasures === null) {
        load_single_treasures();
    }
    let res;
    switch (gs) {
    case '0-4':
      res = roll_rand_table(single_treasures[0]);
      break;
    case '5-10':
      res = roll_rand_table(single_treasures[1]);
      break;
    case '11-16':
      res = roll_rand_table(single_treasures[2]);
      break;
    case '17-20':
      res = roll_rand_table(single_treasures[3]);
      break;
    }
    return roll_coins(res['items']);
}

function get_magic_item_by_id(id) {
    if (magic_items === null) {
        load_magic_items();
    }

    // find magic item with id equal to id
    let res = magic_items.find(table => table["id"] === id);

    if (res === undefined) {
        window.alert("No magic item with id " + id);
        return null;
    }
    return res;
}

function get_equipment_by_id(id, type) {
    if (equipment === null) {
        load_equipment();
    }
    // if equipment is not 'armatura', 'arma' or 'scudo' raise an error
    if (type !== 'armatura' && type !== 'arma' && type !== 'scudo') {
        window.alert("Invalid equipment type " + type);
        return null;
    }

    if (type === 'scudo') {
      return equipment[type][id];
    }

    else {
        for (let category in equipment[type]) {
            let obj = equipment[type][category].find(item => item["id"] === id);
            if (obj !== undefined) {
                let result = {};
                for (let field in obj) {
                    result[field] = obj[field];
                }
                result['category'] = category;
                return result;
            }
      }
    }

    window.alert("No " + type + " with id " + id);
    return null;
}

function roll_magic_table(letter) {
    if (magic_tables === null) {
        load_magic_tables();
    }

  // find the table whose name is letter
    let table = magic_tables.find(table => table["table_name"] === letter);
    if (table === undefined) {
        window.alert("No magic table with letter " + letter);
        return null;
    }

    let item = roll_rand_table(table)['items'];

    if (item['id'] === undefined) {
        alert("No id in item " + JSON.stringify(item) + " in table " + letter);
    }

    // retrieve the magic item from the id
    let magic_item = get_magic_item_by_id(item['id']);

    // retrieve the category from the magic item
    let category = magic_item['category'];

    // get a copy of magic_item except for field 'default_instance'
    let result = {};
    for (let field in magic_item) {
        if (field !== 'default_instance') {
            result[field] = magic_item[field];
        }
    }

    // if the category is 'armatura', 'arma' or 'scudo'
    if (category === 'Armatura' || category === 'Arma' || category === 'Scudo') {
        // if the instance attribute is set on item, use it, otherwise use the default
        let instance = item['instance'] !== undefined ? item['instance'] : magic_item['default_instance'];
        instance = roll_rand_table(instance);
        // if instance is an object
        if (typeof instance === 'object') {
            instance = instance['items'];
        }
        result['instance'] = get_equipment_by_id(instance, category.toLowerCase());
    }

    return result;
}

function roll_art_or_gem(name) {
    if (gems === null) {
        load_gems()
    }
    if (art === null) {
        load_art()
    }
  // if name starts with 'gems', return a gem
  if (name.startsWith('gems')) {
    // find table whose 'table_name' is name
    let table = gems.find(table => table["table_name"] === name);
    if (table === undefined) {
        window.alert("No gem table with name " + name);
        return null;
    }
    let item_name = roll_rand_table(table)['items'];
    return {
        "name": item_name,
        "type": "gem",
        "value": parseInt(name.substring(name.indexOf("_") + 1))
    }
  }
  // if name starts with 'art', return an art
  else if (name.startsWith('art')) {
    // find table whose 'table_name' is name
    let table = art.find(table => table["table_name"] === name);
    if (table === undefined) {
        window.alert("No art table with name {}".format(name));
        return null;
    }
    let item_name = roll_rand_table(table)['items'];
    return {
        "name": item_name,
        "type": "art",
        "value": parseInt(name.substring(name.indexOf("_") + 1))
    }
  }

    window.alert("Invalid name {} for a gem or art item".format(name));
}

function roll_stash(stash_name) {
    if (stashes === null) {
        load_stashes();
    }

    // find table whose 'table_name' is stash_name
    let table = stashes.find(table => table["table_name"] === stash_name);
    if (table === undefined) {
        window.alert("No stash table with name " + stash_name);
        return null;
    }
    let picked_stash = roll_rand_table(table, ["art_or_gems", "magic_tables"]);

    // copy the picked stash
    let result = {};
    result['coins'] = roll_coins(table['coins']);

    let art_or_gems = []
    if (picked_stash['art_or_gems']['how_many'] !== undefined) {
      let how_many = roll_die_str(picked_stash['art_or_gems']['how_many']);
      for (let i = 0; i < how_many; i++) {
        art_or_gems.push(roll_art_or_gem(picked_stash['art_or_gems']['name']));
      }
    }

    let magic_items = []
    if (picked_stash['magic_tables']['how_many'] !== undefined) {
        for (let j in picked_stash['magic_tables']['how_many']) {
          let how_many = roll_die_str(picked_stash['magic_tables']['how_many'][j]);
          for (let i = 0; i < how_many; i++) {
            magic_items.push(roll_magic_table(picked_stash['magic_tables']['name'][j]));
          }
        }
    }

    result['art_or_gems'] = art_or_gems;
    result['magic_items'] = magic_items;

    return result;
}