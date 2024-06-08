const listaPokemon = document.querySelector("#listaPokemon");
const botonesHeader = document.querySelectorAll(".btn-header");
const searchInput = document.querySelector('#search');
const modal = document.getElementById('pokemon-info-modal');
const modalName = document.getElementById('pokemon-modal-name');
const modalDescription = document.getElementById('pokemon-modal-description');
const closeModalButton = document.getElementById('close-modal');
const compararBtn = document.getElementById('comparar-btn');  // Botón para comparar
const compararContainer = document.getElementById('comparar-container');  // Contenedor para la comparación
let URL = "https://pokeapi.co/api/v2/pokemon/";

let selectedPokemon = [];  // Lista de Pokémon seleccionados para comparar

searchInput.addEventListener('input', (event) => {
    const nombrePokemon = event.target.value.toLowerCase();

    listaPokemon.innerHTML = "";

    fetch(URL + nombrePokemon)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))
        .catch(error => console.log('No se encontró el Pokémon con el nombre: ' + nombrePokemon));
});

function mostrarPokemon(poke) {
    let tipos = poke.types.map((type) => `<p class="${type.type.name} tipo">${type.type.name}</p>`);
    tipos = tipos.join('');

    let pokeId = poke.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.dataset.pokemonId = poke.id;
    div.innerHTML = `
        <p class="pokemon-id-back">#${pokeId}</p>
        <div class="pokemon-imagen">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">#${pokeId}</p>
                <h2 class="pokemon-nombre">${poke.name}</h2>
            </div>
            <div class="pokemon-tipos">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stat">${poke.height}m</p>
                <p class="stat">${poke.weight}kg</p>
            </div>
        </div>
    `;
    listaPokemon.append(div);

    // Añadir event listener para seleccionar Pokémon
    div.addEventListener('click', () => {
        if (selectedPokemon.length < 2 && !selectedPokemon.includes(poke)) {
            selectedPokemon.push(poke);
            div.classList.add('selected');
            if (selectedPokemon.length === 2) {
                compararBtn.style.display = 'block';
            }
        }
    });
}

// Añadir funcionalidad de comparación
compararBtn.addEventListener('click', () => {
    if (selectedPokemon.length === 2) {
        compararPokemon(selectedPokemon[0], selectedPokemon[1]);
    }
});

function compararPokemon(pokemon1, pokemon2) {
    const stats1 = pokemon1.stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
    }, {});
    const stats2 = pokemon2.stats.reduce((acc, stat) => {
        acc[stat.stat.name] = stat.base_stat;
        return acc;
    }, {});

    const comparisonResults = `
        <table>
            <thead>
                <tr>
                    <th>Estadística</th>
                    <th>${pokemon1.name}</th>
                    <th>${pokemon2.name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>HP</td>
                    <td>${stats1.hp}</td>
                    <td>${stats2.hp}</td>
                </tr>
                <tr>
                    <td>Attack</td>
                    <td>${stats1.attack}</td>
                    <td>${stats2.attack}</td>
                </tr>
                <tr>
                    <td>Defense</td>
                    <td>${stats1.defense}</td>
                    <td>${stats2.defense}</td>
                </tr>
                <tr>
                    <td>Special Attack</td>
                    <td>${stats1['special-attack']}</td>
                    <td>${stats2['special-attack']}</td>
                </tr>
                <tr>
                    <td>Special Defense</td>
                    <td>${stats1['special-defense']}</td>
                    <td>${stats2['special-defense']}</td>
                </tr>
                <tr>
                    <td>Speed</td>
                    <td>${stats1.speed}</td>
                    <td>${stats2.speed}</td>
                </tr>
            </tbody>
        </table>
    `;

    compararContainer.innerHTML = comparisonResults;

    // Determinar el ganador basado en las estadísticas
    const total1 = Object.values(stats1).reduce((acc, stat) => acc + stat, 0);
    const total2 = Object.values(stats2).reduce((acc, stat) => acc + stat, 0);

    let winner;
    if (total1 > total2) {
        winner = pokemon1.name;
    } else if (total2 > total1) {
        winner = pokemon2.name;
    } else {
        winner = 'Empate';
    }

    compararContainer.innerHTML += `<h3>Ganador: ${winner}</h3>`;
}

closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
});

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    listaPokemon.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                if (botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.includes(botonId)) {
                        mostrarPokemon(data);
                    }
                }
            })
            .catch(error => console.log(error));
    }
}));

fetch(URL)
    .then(response => response.json())
    .then(data => data.results.forEach(pokemon => fetchPokemon(pokemon.url)));

function fetchPokemon(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => mostrarPokemon(data));
}
