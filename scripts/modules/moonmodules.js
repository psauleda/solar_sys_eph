import { moonPhasesQuery } from './moonqueries.js'  

//------------------------------------------------------------------------------------------------

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
  //const dateForm = document.querySelector('#date-form');
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

// Funció que afegeix un listener a botó calcular
function calculateMoonPhase() {
  
    const container = document.querySelector('.moon-calendar')
    if (container) removeAllChildNodes(container);
    
    const calc = document.querySelector('#date-form')
    calc.addEventListener('submit', callMoon);
}


function callMoon(e) {
    e.preventDefault();
    getMoon();
    // situem la posició a on es mostren les dades
  window.location.href = '#lluna';
}

async function getMoon() {
  const data = document.querySelector('#date-input').value;
  const day = new Date(data).getDate();
  const month = new Date(data).getMonth() + 1;
  const year = new Date(data).getFullYear();

  const moon = await moonPhasesQuery(month, year)

  const dayWeekPar = document.querySelector('.day-week');
  const dayWeekNum = moon.phase[day].dayWeek
  dayWeekPar.textContent = moon.nameDay[dayWeekNum];

  const fullDatePar = document.querySelector('.full-date');
  fullDatePar.textContent = day + " " + moon.monthName + " " + moon.year;
  
  const moonImageDiv = document.querySelector('.moon-image');
  moonImageDiv.innerHTML = moon.phase[day].svg;

  const moonPhasePar = document.querySelector('.moon-phase');
  moonPhasePar.textContent = moon.phase[day].phaseName + " " + ((moon.phase[day].isPhaseLimit ) ? "" : Math.round(moon.phase[day].lighting) + "%");

  

  let lunarDay = 0;
  let i = 0;
  let inc = 0;

  // canvia el valor d'aquesta constant a true perquè el primer dia de la setmana sigui Diumenge
  const firstDayWeekSunday = false 
  if (firstDayWeekSunday) {
      inc = 1
      moon.nameDay.unshift(moon.nameDay.pop())        
  }
  const emptyInicialBoxes = Number(moon.phase[1].dayWeek) + inc     
  const numberDaysMonth = Number(moon.daysMonth)
  const totalBoxes = Math.ceil((emptyInicialBoxes + numberDaysMonth) /7) * 7
  
  const titleCalendar = document.querySelector('.title-calendar');
  titleCalendar.textContent = moon.monthName + ' ' + moon.year;

  const namesDays = document.querySelector('.names-days');
  namesDays.textContent = '';
  const moonCalendarDiv = document.querySelector('.moon-calendar');
  removeAllChildNodes(moonCalendarDiv);

  for (i=0; i<7; i++){
      namesDays.innerHTML += '<div class="name-day">' + moon.nameDay[i] + '</div>'
  } 

  for (i=0; i < totalBoxes; i++){
      const day = i - emptyInicialBoxes
      const box = document.createElement('div')
      box.className="day_box" 
       if (day>=0 && day < numberDaysMonth){
          lunarDay = day + 1
          if (moon.year ==  (new Date).getFullYear() && moon.month == (new Date).getMonth()+1 && lunarDay == (new Date).getDate()) box.id="isToDay"
          box.innerHTML = '<div>' +
           '<span>' + lunarDay + '</span>' +
           '<div>' +moon.phase[lunarDay].svg +'</div>' +
           '</div>'
          if (moon.phase[lunarDay].isPhaseLimit){           
              const url="data:image/svg+xml;utf8, " + moon.phase[lunarDay].svgMini 
              box.firstChild.style.backgroundImage ='url("' + url +'")'
              box.title= moon.phase[lunarDay].phaseName  
          }
       }        
      moonCalendarDiv.appendChild(box)
      }
}


//------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------


export { setDate, getMoon, calculateMoonPhase };