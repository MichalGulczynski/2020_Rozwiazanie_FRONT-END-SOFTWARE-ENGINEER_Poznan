var pokemonObject;

function fetchPokemon() {
    const tab = [];
    for (i = 1; i < 400; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        tab.push(fetch(url)
            .then(result => {
                return result.json();
            }));

    }
    Promise.all(tab).then(result => {
        pokemonObject = result.map(data => ({
            "img": data.sprites.front_default,
            "name": data.name,
            "id": data.id,
            "types": data.types.map(types => {
                return types.type.name;
            }).join(", ")
        }));

        renderPokemons(pokemonObject);


        var types = getTypes();
        renderCheckbox(types);
    });
}
//wyswietlanie danych
function renderPokemons(pokemons) {
    document.getElementById("list").innerHTML = pokemons.map(pokemon => `
    <li typ="${pokemon.types}" data-active="1" class="display_box">
        <img id="poke_img" src="${pokemon.img}"/>
        <h2>${pokemon.id}. ${pokemon.name}</h2>
        <p>Type: ${pokemon.types}</p>
    </li>`

    ).join("");
}

fetchPokemon();

//szukanie po imieniu
const search_value = document.getElementById("inp_name");
const matchList = document.getElementById("match_list");
search_value.addEventListener("input", () => serchName(search_value.value));


function serchName(searchText) {
    let matches = pokemonObject.filter(pokeName => {
        const rx = new RegExp(`^${searchText}`, "gi");
        return pokeName.name.match(rx);
    });

    if (searchText.length === 0) {
        matches = [];
        matchList.innerHTML = "";
    }
    output(matches);
}

function output(matches) {
    if (matches.length > 0) {
        const html = matches.map(matches => `
        <div class="card">
            <h4>${matches.name}</h4>
        </div>
        `).join("");
        matchList.innerHTML = html;
    }
}

function enter(event) {
    if (event.keyCode == 13) {
        if (search_value.value != "") filtrPokemons(search_value.value);
        else renderPokemons(pokemonObject);
    }
}


function getTypes() {
    var types = pokemonObject.map(typ => {
        return typ.types;
    });
    return types.filter((typ, index) => {
        return types.indexOf(typ) === index;
    });
}
var renderCheckbox = function(types) {
    types.sort();
    document.getElementById("checklist").innerHTML += types.map(type => {
        var html = `<label class="chklist"><input name="${type}" type="checkbox" checked/>${type}</label>`;
        return html;
    }).join(" ");
};

document.getElementById("checklist").addEventListener("click", clickHandler, false);

function clickHandler(event) {
    var filter = event.target.getAttribute('name');
    if (!filter) return;
    var types = Array.from(document.querySelectorAll(`.display_box[typ='${filter}']`));
    console.log(types);
    if (event.target.checked) {
        types.forEach(pokemon => {
            pokemon.style.display = "inline-block";
        });
    } else {
        types.forEach(pokemon => {
            pokemon.style.display = "none";
        });
    }
}


function filtrPokemons(nazwa) {
    var filtr = pokemonObject.filter(object => {
        return object.name == nazwa;
    })
    renderPokemons(filtr);
}