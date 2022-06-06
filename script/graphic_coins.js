load_single_treasures()

function get_coins_container(coin_table) {
    // remove any div in the page with class 'coin_treasure_container'
    let coin_treasure_container = document.getElementsByClassName('coin_treasure_container');
    while (coin_treasure_container.length > 0) {
        coin_treasure_container[0].remove();
    }

    // create a div
    let div = document.createElement('div');
    div.className = 'coin_treasure_container';

    for (let coin_type in coin_table) {
        // create a div for each coin type
        let coin_div = document.createElement('div');
        coin_div.className = 'coin_container';
        //put an image in the container
        let coin_img = document.createElement('img');
        coin_img.src = './assets/' + coin_type + '.png';
        coin_img.className = 'coin_img';
        coin_div.appendChild(coin_img);
        //put a text in the container
        let coin_text = document.createElement('p');
        coin_text.className = 'coin_text';
        coin_text.innerHTML = coin_table[coin_type] + ' ' + coin_type;
        coin_div.appendChild(coin_text);
        //put the container in the div
        div.appendChild(coin_div);
    }
    return div;
}

function display_coins(coin_table) {

    let div = get_coins_container(coin_table);

    // add the div to the page at the end of the body
    document.body.appendChild(div);

}

function generate_single_treasure() {

    // get the value of the radio button in the page
    let grado_sfida = document.querySelector('input[name="grado"]:checked').value;

    // if radio button was not checked, alert the user and return
    if (grado_sfida === undefined) {
        return;
    }

    // generate the coins
    let coin_table = roll_single_treasure(grado_sfida);
    display_coins(coin_table);
}