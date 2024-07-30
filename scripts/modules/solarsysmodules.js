
const APIplanets = {
  "bodies": [
    {
      "id": "uranus",
      "englishName": "Uranus",
      "semimajorAxis": 2870658186,
      "perihelion": 2734998229,
      "aphelion": 3006318143,
      "eccentricity": 0.0457,
      "inclination": 0.772,
      "density": 1.27,
      "gravity": 8.87,
      "escape": 21380,
      "meanRadius": 25362,
      "sideralOrbit": 30685.4,
      "sideralRotation": -17.24,
      "avgTemp": 76,
    },
    {
      "id": "neptune",
      "englishName": "Neptune",
      "semimajorAxis": 4498396441,
      "perihelion": 4459753056,
      "aphelion": 4537039826,
      "eccentricity": 0.0113,
      "inclination": 1.769,
      "density": 1.638,
      "gravity": 11.15,
      "escape": 23560,
      "meanRadius": 24622,
      "sideralOrbit": 60189,
      "sideralRotation": 16.11,
      "avgTemp": 55,
    },
    {
      "id": "jupiter",
      "englishName": "Jupiter",
      "semimajorAxis": 778340821,
      "perihelion": 740379835,
      "aphelion": 816620000,
      "eccentricity": 0.0489,
      "inclination": 1.304,
      "density": 1.3262,
      "gravity": 24.79,
      "escape": 60200,
      "meanRadius": 69911,
      "sideralOrbit": 4332.589,
      "sideralRotation": 9.925,
      "avgTemp": 165,
    },
    {
      "id": "mars",
      "englishName": "Mars",
      "semimajorAxis": 227939200,
      "perihelion": 206700000,
      "aphelion": 249200000,
      "eccentricity": 0.0935,
      "inclination": 1.85,
      "density": 3.9341,
      "gravity": 3.71,
      "escape": 5030,
      "meanRadius": 3389.5,
      "sideralOrbit": 686.98,
      "sideralRotation": 24.6229,
      "avgTemp": 210,
    },
    {
      "id": "mercure",
      "englishName": "Mercury",
      "semimajorAxis": 57909050,
      "perihelion": 46001200,
      "aphelion": 69816900,
      "eccentricity": 0.2056,
      "inclination": 7,
      "density": 5.4291,
      "gravity": 3.7,
      "escape": 4250,
      "meanRadius": 2439.4,
      "sideralOrbit": 87.969,
      "sideralRotation": 1407.6,
      "avgTemp": 440,
    },
    {
      "id": "saturne",
      "englishName": "Saturn",
      "semimajorAxis": 1426666422,
      "perihelion": 1349823615,
      "aphelion": 1503509229,
      "eccentricity": 0.0565,
      "inclination": 2.485,
      "density": 0.6871,
      "gravity": 10.44,
      "escape": 36090,
      "meanRadius": 58232,
      "sideralOrbit": 10759.22,
      "sideralRotation": 10.656,
      "avgTemp": 134,
    },
    {
      "id": "terre",
      "englishName": "Earth",
      "semimajorAxis": 149598023,
      "perihelion": 147095000,
      "aphelion": 152100000,
      "eccentricity": 0.0167,
      "inclination": 0,
      "density": 5.5136,
      "gravity": 9.8,
      "escape": 11190,
      "meanRadius": 6371.0084,
      "sideralOrbit": 365.256,
      "sideralRotation": 23.9345,
      "avgTemp": 288,
    },
    {
      "id": "venus",
      "englishName": "Venus",
      "semimajorAxis": 108208475,
      "perihelion": 107477000,
      "aphelion": 108939000,
      "eccentricity": 0.0067,
      "inclination": 3.39,
      "density": 5.243,
      "gravity": 8.87,
      "escape": 10360,
      "meanRadius": 6051.8,
      "sideralOrbit": 224.701,
      "sideralRotation": -5832.5,
      "avgTemp": 737,
    }
  ]
}
// ordenem els planetes que ens retorna l'API segons la distància al Sol
const planets = [ ...APIplanets.bodies].sort(
  (p1, p2) => p1.semimajorAxis - p2.semimajorAxis);

// Funcions addicionals **********************************************

/** Funció que omple el comparison-container
 *  @param {number} planetIndex index de l'array planets que hem seleccionat
 */
function fillComparisonContainer(planetIndex) {
  
  // div que conté el planeta principal de la comparació (dins de comparison-container)
  const referenceContainer = document.querySelector('.reference-container');
  // mostrem el planets[planetIndex] clicat en el container corresponent 
  showReferencePlanet(referenceContainer, planetIndex);

  // div que conté les slides (dins de comparison-container)
  const slidesContainer = document.querySelector('.slides-container');
  // mostrem tots els planetes menys el planets[planetIndex] clicat en el container d'slides
  showSlidePlanets(slidesContainer, planetIndex);

  
}

/** Funció que esborra el contingut d'un conteiner
 *  @param {Node} parent element pare del elements que volem esborrar
 */
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

/** Funció que mostra el planeta de referència de la comparació
 *  @param {Node} container node on volem inserir la informació
 *  @param {number} index index de l'array planets del planeta que mostrarem
 */
function showReferencePlanet(container, index) {
  // eliminem possible informació anterior
  removeAllChildNodes(container);

  // Fem ús de templates per crear el contingut
  const template = document.querySelector('#planet-template').content;
  const fragment = document.createDocumentFragment();
  
  const clone = template.cloneNode(true);
  clone.querySelector('div').className = 'planet'
  clone.querySelector('img').src = `./images/planets/${planets[index].englishName.toLocaleLowerCase()}_320x240.jpg`;
  clone.querySelector('img').alt = planets[index].englishName;
  clone.querySelector('p.planet-name').textContent = planets[index].englishName;
  clone.querySelector('p.planet-radi').textContent = 'Radi: ' + Math.round(planets[index].meanRadius) + ' km';
  clone.querySelector('p.planet-dist').textContent = 'Distància al Sol: ' + planets[index].semimajorAxis + ' km';
  clone.querySelector('p.planet-dens').innerHTML = 'Densitat: ' + planets[index].density.toFixed(2) + ' g/cm<sup>3</sup>';
  clone.querySelector('p.planet-g').innerHTML = 'Gravetat: ' + planets[index].gravity + ' m/s<sup>2</sup>';
  fragment.appendChild(clone);
  container.appendChild(fragment);
}

/** Funció que crea i mostra (amb funcions suplementàries) els slides
 *  @param {Node} container node on volem inserir la informació
 *  @param {number} index index de l'array planets del planeta de referència
 */
function showSlidePlanets(container, index) {
  // eliminem possible informació anterior
  removeAllChildNodes(container);

  // Fem ús de templates per crear el contingut
  const template = document.querySelector('#planet-template').content;
  const fragment = document.createDocumentFragment();

  for (const planet of planets) {
    if (planets[index].englishName !== planet.englishName) {
      const clone = template.cloneNode(true);
      clone.querySelector('div').className = 'planet slides fade'
      clone.querySelector('img').src = `./images/planets/${planet.englishName.toLocaleLowerCase()}_320x240.jpg`;
      clone.querySelector('img').alt = planet.englishName;
      clone.querySelector('p').textContent = planet.englishName;
      clone.querySelector('p.planet-radi').textContent = 'Radi: ' + Math.round(planet.meanRadius) + ' km';
      clone.querySelector('p.planet-dist').textContent = 'Distància al Sol: ' + planet.semimajorAxis + 'km';
      clone.querySelector('p.planet-dens').innerHTML = 'Densitat: ' + planet.density.toFixed(2) + ' g/cm<sup>3</sup>';
      clone.querySelector('p.planet-g').innerHTML = 'Gravetat: ' + planet.gravity + ' m/s<sup>2</sup>';
      fragment.appendChild(clone);
    }
  }
  const linkPrev = document.createElement('a');
  const linkNext = document.createElement('a');
  linkPrev.classList.add('prev');
  linkNext.classList.add('next');
  linkPrev.textContent = '❮';
  linkNext.textContent = '❯';
  fragment.appendChild(linkPrev);
  fragment.appendChild(linkNext);
  container.appendChild(fragment);

  let slideIndex = 0;
  const main = index;
  changeSlide(main, 0);
  slideControlListeners(main, slideIndex);
}

/** Funció que dona funcionalitat als controls prev i next
 *  @param {number} main index del planeta de referència
 *  @param {number} index index del planeta dels slides
 */
function slideControlListeners(main ,index) {

  // prev, next controls
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');

  prev.addEventListener('click', () => index = changeSlide(main, --index));
  next.addEventListener('click', () => index = changeSlide(main, ++index));
}

/** Funció que canvia l'slide
 *  @param {number} main index del planeta de referència
 *  @param {number} index index del planeta dels slides
 */
function changeSlide(main, n) {
  let indexSlide = n;
  let indexPlaneta = n;
  // console.log('MAIN=' + main + ' n=' + n)
  const slides = document.querySelectorAll('.slides');
  
  // comprovem si estem fora de l'index de slides
  if (n > slides.length -1) {
    indexSlide = indexPlaneta = 0;
  }    
  if (n < 0) {
    indexSlide = indexPlaneta = slides.length -1
  }
  
  // inicialment totes les slides no visibles
  for (const slide of slides) {
    slide.style.display = 'none';  
  }
  // comprovem si estem per sobre del planeta de referència per poder accedir les seves propietats
  if (indexPlaneta >= main) {
    indexPlaneta = indexSlide + 1;
  }
  // console.log(`length=${slides.length} n=${n} indexSlide=${indexSlide} indexPlaneta = ${indexPlaneta}`);

  // radis i relació entre els radis del planeta de referència i el de l'slide 
  let mainRadius = planets[main].meanRadius;
  let slideRadius = planets[indexPlaneta].meanRadius;
  let radiusRelation = mainRadius / slideRadius;
  
  const referencePlanet = document.querySelector('.reference-container .planet-img');
  if (radiusRelation > 1) {
    
    referencePlanet.style.transform = 'scale(1)';
    slides[indexSlide].children[0].style.transform = `scale(${1/radiusRelation})`;
  } else {
    slides[indexSlide].children[0].style.transform ='scale(1)';
    referencePlanet.style.transform = `scale(${radiusRelation})`;
  }
  slides[indexSlide].style.display = 'block';
  
  return indexSlide;  
}

export { planets, fillComparisonContainer }