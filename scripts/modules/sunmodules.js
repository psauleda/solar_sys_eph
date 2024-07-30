import { arrayQueryResults, arrayQuery12Suns } from "./sunqueries.js";

/** Funció que esborra tots els elements d'un element pare (Traversy Media)
 *  @param {Node} parent node pare
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}


//------------------------------------------------------------------------------------------------


// Inicialitzem amb la data actual
function setDate() {
  // Formulari data
  // const dateForm = document.querySelector('#date-form');
  // input de la data
  const data = document.querySelector('#date-input');

  // hi posem per defecte avui
  const avui = new Date();
  const any = avui.getFullYear();
  const mes = avui.getMonth() + 1 < 10 ? '0' + (avui.getMonth() + 1) : avui.getMonth() + 1;
  const dia = avui.getDate() < 10 ? '0' + avui.getDate() : avui.getDate();
  const defaultValue = `${any}-${mes}-${dia}`;
  data.value = defaultValue;
}

//------------------------------------------------------------------------------------------------

// DOM element: div de sun.html on es mostren els resultats
const searchResults = document.querySelector('.search-results');

// Botó calcular desactivat per defecte
const calcButton = document.querySelector('.calc-button');
calcButton.disabled = true;

//------------------------------------------------------------------------------------------------


/** Funció que crea elements del DOM: lloc i les coordenades que hem triat dels suggeriments
 *  o de l'historial i els mostra a sota l'input. 
 *  Crida a la funció per afegir l'element triat a l'historial, si cal.
 * Un cop mostrada la info, habilita el botó de cerca, ja que la data hi és per defecte, si
 * no és que n'hem triat una altre.
 *  @param {number} i index de l'array
 *  @param {array} arrayLoc array de llocs 
 */
function getMyLocation(i, arrayLoc) {
  
  // eliminem info anterior si n'hi ha
  removeAllChildNodes(searchResults);
  const canvas = document.querySelector('canvas');
  canvas.width = 0; 
  setDate();
  

  // Elements a afegir al DOM fem servir data- atributs per desar nom, lat i lon
  const pLocation = document.createElement('p');
  pLocation.classList.add('chosen-loc');
  pLocation.setAttribute('data-name', arrayLoc[i].display_name);
  pLocation.textContent = `Ubicació: ${arrayLoc[i].display_name}`;
  const pLat = document.createElement('p');
  pLat.classList.add('chosen-lat');
  pLat.setAttribute('data-lat', arrayLoc[i].lat)
  pLat.textContent = `Latitud: ${arrayLoc[i].lat}`;
  const pLon = document.createElement('p');
  pLon.classList.add('chosen-lon');
  pLon.setAttribute('data-lon', arrayLoc[i].lon)
  pLon.textContent = `Longitud: ${arrayLoc[i].lon}`;

  searchResults.appendChild(pLocation);
  searchResults.appendChild(pLat);
  searchResults.appendChild(pLon);

  // crida a la funció per afegir el lloc a l'historial
  addLocationToHistory(arrayLoc[i].display_name, arrayLoc[i].type, arrayLoc[i].lat, arrayLoc[i].lon);
  calcButton.disabled = false;
  calculateRiseSet();
}

//------------------------------------------------------------------------------------------------


/** Funció que afegeix un lloc cercat a l'historial. (No s'exporta)
 *  @param {string} location Nom del lloc
 *  @param {string} type Categoria del lloc
 *  @param {number} latitude Latitud del lloc
 *  @param {number} longitude Longitud del lloc
 * 
 */
function addLocationToHistory(location, type, latitude, longitude) {

  // Limit de llocs a guardar a l'historial
  const MAX_LOCATIONS = 3

  // Recuperem l'historial (format JSON)
  let history = localStorage.getItem('history');

  // Comprovem si està buit, si si l'inicialitzem com un array
  if (history === null) {
    history = [];
  } else {
    // si no és buit el transformem a objecte JavaScript
    history = JSON.parse(history);
  }

  // comprovem si ja el tenim
  for (const item of history) {
    if (item.display_name === location) return;
  }

  // nova dada que desem a l'array de l'historial
  const newObj = {
    display_name: location,
    type: type,
    lat: latitude,
    lon: longitude
  };
    
  // Si no superem el límit desem la dada, si el superem eliminem el primer i desem la dada
  if (history.length < MAX_LOCATIONS) {
    history.push(newObj);

  } else {
    history.push(newObj);
    history.shift();
  }
  // Actualitzem l'historial, el desem en format JSON
  localStorage.setItem('history', JSON.stringify(history));
}

//------------------------------------------------------------------------------------------------

// Botó cerca
const searchButton = document.querySelector('.search-button');

//------------------------------------------------------------------------------------------------


/** Funció que crea elements div on es mostren o bé els suggeriments o l'historial
 *  @param {array} locations array amb llocs geogràfics
 *  @param {string} title conté 'Suggeriments' o 'Historial' segons el que volem mostrar
 */
function addResultDivs(locations, title) {
  // Botó calcular i de cerca deshabilitats
  calcButton.disabled = true;
  searchButton.disabled = true;
  // contenidor fragment
  const fragment = document.createDocumentFragment();
  // paràgraf del títol
  const pTitle = document.createElement('p')
  pTitle.textContent = title;
  fragment.appendChild(pTitle);
  // cada un dels divs amb el lloc geogràfic (nom i tipus)
  for (let location of locations) {
    const divResult = document.createElement('div');
    divResult.classList.add('location-result');
    // nom del lloc
    const pName = document.createElement('p')
    pName.classList.add('location-name');
    pName.textContent = location.display_name;
    // tipus o categoria del lloc
    const pType = document.createElement('p');
    pType.classList.add('location-type');
    pType.textContent = location.type;
    
    divResult.appendChild(pName);
    divResult.appendChild(pType);
    fragment.appendChild(divResult);
  }
  // searchResults és l'element del DOM definit anteriorment
  searchResults.appendChild(fragment);   
}

//------------------------------------------------------------------------------------------------


/** Funció que mostra l'historial de cerques */
function showHistory() {
  let history = localStorage.getItem('history');
  
  if (history) {
    history = JSON.parse(history);
    addResultDivs(history, 'History:');
    // Triem l'opció que ens interessa
    const locationList = document.querySelectorAll('.location-result');

    for (const [index, location] of locationList.entries()) {
      location.addEventListener('click', () => getMyLocation(index, history));
    }
  }
}

//------------------------------------------------------------------------------------------------


// Input on introduïm la ubicació
const locationInput = document.querySelector('#location-input');

//------------------------------------------------------------------------------------------------


// Consulta a Nominatim per obtenir suggeriments de llocs
//(async pq cridem a una funció async, amb això evitem que ens retorni una promise)
async function showResults(e) {
  e.preventDefault();

  // array de dades amb els resultats de la consulta, li passem el que entrem a l'input
  const dades = await arrayQueryResults(locationInput);

  // Comprovem si rebem dades
  if (dades.length === 0) {
    // Eliminem informació anterior i mostrem missatge que no hi ha dades
    removeAllChildNodes(searchResults);
    const pNoResult = document.createElement('p');
    pNoResult.textContent = 'No s\'han trobat resultats. Comprova el nom o introdueix un codi postal.';
    searchResults.appendChild(pNoResult);
  } else {
    // Eliminem informació anterior i refresquem amb la nova informació
    removeAllChildNodes(searchResults);
    addResultDivs(dades, 'Suggeriments:');

    // Llista d'opcions
    const locationList = document.querySelectorAll('.location-result');
    
    // Add events listerners per cada lloc suggerit, triem el lloc
    for (const [index, location] of locationList.entries()) {
      location.addEventListener('click', () => getMyLocation(index, dades));
    }
    // reset de l'input
    locationInput.value = '';
  }

}

//------------------------------------------------------------------------------------------------

// Funció que afegeix un listener a botó calcular
function calculateRiseSet() {
  
  const container = document.querySelector('.suns-result')
  if (container) removeAllChildNodes(container);
  
  const calc = document.querySelector('#date-form')
  calc.addEventListener('submit', calcQuery);
}


//------------------------------------------------------------------------------------------------

// Crida a l'API, ho fem en una sola crida
async function calcQuery(e) {
  e.preventDefault();
  
  // recuperem les dades del lloc triat: nom, lat, lon, data
  const loc = document.querySelector('.chosen-loc').dataset.name;
  const lat = document.querySelector('.chosen-lat').dataset.lat;
  const lon = document.querySelector('.chosen-lon').dataset.lon;  
  const data = document.querySelector('#date-input').value;

  // fem una consulta per la data actual i 11 valors més
  const dades12Sols = await arrayQuery12Suns(lat, lon, data); 
  // console.log(dades12Sols['11'][0].rising)
  // console.log([...dades['11'][0]]); // NO FUNCIONA, AIXÒ NO ES POT FER !
  
  // icones que mostrem a les cards
  const sunIcons = ['sunrise.png', 'migdia.png', 'sunset.png'];

  // variable on desem les dades de la sortida, posta i altura, si existeixen 
  let sunStatus = [];
  let dayLong = 0;


  if (dades12Sols['11'][0].rising) {
    // array amb les dades de sortida, altura i posta de Sol (objectes amb propietats coord i hour)
    sunStatus = [dades12Sols['11'][0].rising[0], dades12Sols['11'][0]['transit-sup'][0], dades12Sols['11'][0].setting[0]];

    // Càlcul de la duració del dia = hora set - hora rise
    const horaMinutsSet = dades12Sols['11'][0].setting[0].hour.split(':');
    const horaMinutsRise = dades12Sols['11'][0].rising[0].hour.split(':');
    const dayLongInMinutes = ((+horaMinutsSet[0] * 60) + (+horaMinutsSet[1])) -  ((+horaMinutsRise[0] * 60) + (+horaMinutsRise[1]));
    const dayLongHours = Math.floor(dayLongInMinutes/60);
    const dayLongRemainingMinutes = dayLongInMinutes % 60;
    dayLong = dayLongHours + ' h ' + dayLongRemainingMinutes + ' min';
  } 

  // cridem a la funció que ens mostra les cards
  showRiseSet(loc, dayLong, sunStatus, sunIcons);

  // array de totes les altures d'un any
  let arraySuns = dades12Sols['11'].map((sol) => sol['transit-sup'][0].coord);

  // mes que hem triat
  const month = (new Date(data)).getMonth()

  // fem un shift per posar el gener davant
  arraySuns = arraySuns.concat(arraySuns.splice(0, arraySuns.length - month));

  // cridem a la funció per mostrar l'altura del sol al llarg de l'any
  showYearSuns(month, arraySuns)
  // situem la posició a on es mostren les dades
  window.location.href = '#rst';
  
  // Resetegem la cerca de llocs
  removeAllChildNodes(searchResults);
  showHistory()
}


//------------------------------------------------------------------------------------------------


// Funció que crea les cards de sunrise, sunset i altura
// Li passem el lloc que hem escollit, la duració del dia i també
// li passem un array amb les hores dels fenòmens i un array amb les respectives icones
function showRiseSet(lloc, duradaDia, matiMigdiaVespre, icones) {
  const container = document.querySelector('.suns-result')
  console.log('container ', container)
  // Netegem info anterior si n'hi ha
  removeAllChildNodes(container);

  // Referència a la template de la card
  const template = document.querySelector('#template-sun').content;

  // Fragment per evitar reflow
  const fragment = document.createDocumentFragment();

  const ubicacio = document.createElement('p');
  ubicacio.textContent = lloc;
  fragment.appendChild(ubicacio);

  if (matiMigdiaVespre.length !== 0) {
    const durada = document.createElement('p');
    durada.textContent = 'Hores de llum: ' + duradaDia;
    fragment.appendChild(durada);
    const divSuns = document.createElement('div');
    divSuns.classList.add('suns');
    // Per cada fenòmen (sunrise, migdia, sunset)
    for (let i = 0; i < matiMigdiaVespre.length; i++) {
      // Create a clone
      const clone = template.cloneNode(true)
      
      //console.log(window.location.href);
      
      // Propietats per cada un
      clone.querySelector('img.sun').src = `./images/sun/${icones[i]}`;
      clone.querySelector('img.sun').alt = icones[i];

      // recuperem el nom de cada fenòmen del fitxer de la icona eliminant-li l'extensió
      clone.querySelector('.sun-status').textContent = icones[i].slice(0, -4).toUpperCase();
          clone.querySelector('.hour').innerHTML = `<span><b>Hora (UTC): </b></span> ${matiMigdiaVespre[i].hour}`;

      // la card del mig (index i=1) ha de mostrar Altura, les altres Azimut
      if (i == 1) {
        clone.querySelector('.coord').innerHTML = `<span><b>Altura:</b></span> ${matiMigdiaVespre[i].coord}\xB0`; 
      } else {
        clone.querySelector('.coord').innerHTML = `<span><b>Azimut:</b></span> ${matiMigdiaVespre[i].coord}\xB0`; 
      }
      // Afegim el clone al freagment
      divSuns.appendChild(clone)
    }
    // Afegim el fragment al container.
    fragment.appendChild(divSuns);
  } else {
    const noSunrise = document.createElement('p');
  noSunrise.textContent = 'Per aquestes dates no hi ha Sunrise ni Sunset.';
  fragment.appendChild(noSunrise);
  }
  container.appendChild(fragment)
}


//------------------------------------------------------------------------------------------------

// Funció que crida a dibuixar l'altura del sol al llarg de l'any
// Li passem el més que hem triat a la consulta i l'array d'altures (ordenat)
function showYearSuns(month, arraySuns) {
  
  //const sunsContainer = document.querySelector('.all-year-suns');
  const canvas = document.getElementById('canvas');

  // amplada del canvas, inicialment és a zero perquè no es mostri
  canvas.width = window.innerWidth * 0.7;

  // width del container on es mostra el resultat
  let fieldWidth = canvas.clientWidth;
  // height del container on es mostra el resultat
  let fieldHeight = canvas.clientHeight;

  // mesos de referència de l'eix horitzontal
  const months = ['GEN', 'FEBR', 'MARÇ', 'ABR', 'MAIG', 'JUNY', 'JUL', 'AG', 'SET', 'OCT', 'NOV', 'DES'];

  // Altures de referència de l'eix vertical
  const heights = ['0', '', '15', '', '30', '', '45', '', '60', '', '75', ''];

  // dibuixa
  drawSuns(canvas,fieldWidth, fieldHeight, month, arraySuns, months, heights);
  
  // Ajustem la vista si fem un resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth * 0.7;
    fieldWidth = canvas.clientWidth;
    fieldHeight = canvas.clientHeight;
    drawSuns(canvas,fieldWidth, fieldHeight, month, arraySuns, months, heights);
  });
}


//------------------------------------------------------------------------------------------------


// dibuixa
function drawSuns(canvas, amplada, altura, currentMonth, arraySols, arrayMonths, arrayHeights) {
  
  // offsets per ajustar el que dibuixem
  let leftOffset = amplada / 24;
  // pels mesos i altures de referència dels eixos 
  let offsetX = 15;
  let offsetY = 5;
  
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    
    // dibuixem els sols, el del mes escollit més gran
    for (let i = 0; i < arraySols.length; i++) {
      ctx.fillStyle = '#e4b942';
      let radius = 10;
      ctx.beginPath();
      // ajustem l'escala
      const centerX = Math.round(i * amplada / 12) + leftOffset;
      const centerY =  Math.round(altura * (1 - (+arraySols[i]) / 90));
      i === currentMonth ? radius = 20 : radius = 10; 
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke(); 
      ctx.fillStyle = '#000';
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(arrayMonths[i], centerX - offsetX, altura - offsetY)
      ctx.fillText((arrayHeights[i] !== '' ? arrayHeights[i] +  'º' : ''), offsetY, Math.round(altura * (1 - (+arrayHeights[i]) / 90))-offsetY)  
    }
  }
}
 

export {showHistory, showResults, setDate};
// export {removeAllChildNodes, getMyLocation, addResultDivs, showHistory, showResults};