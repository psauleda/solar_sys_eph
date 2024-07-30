async function moonPhasesQuery(month, year){

  // data en segons des de 1970  
  const LDZ =new Date(year, month-1, 1) / 1000;

  const url = 'https://www.icalendar37.net/lunar/api/?lang=ca&month=' + month + '&year=' + year +
    'size=250&lightColor=rgb(183%2C%20183%2C%20180)&shadeColor=blackt&texturize=true&LDZ=' + LDZ;
  
  const response = await fetch(url);
  const dades = await response.json();
  
  return dades;

}

export { moonPhasesQuery }