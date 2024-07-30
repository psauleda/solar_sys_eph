// consulta a nominatim, retorna un límit de 5 opcions
async function arrayQueryResults(inputSearch){
  // Variables de la consulta a la API
  const limitResults = 5;
  const formatResult = 'json';
  const apiQuery = 'https://nominatim.openstreetmap.org/search.php?q=';
  const endpointParams = `&limit=${limitResults}&format=${formatResult}`;
  let location = inputSearch.value;
  
  // resposta en format json
  const response = await fetch(apiQuery + location + endpointParams);
  const data = await response.json();
  
  return data;
}


//------------------------------------------------------------------------------------------------

// AQUESTA CRIDA NO LA FEM SERVIR

// async function arrayQuerySun(lat, lon, data) {
//   const formatResult = 'json';
//   const apiQuery = 'https://ssp.imcce.fr/webservices/miriade/api/rts.php?';
//   const body = `-body=11`; // el sol
//   const observer = `-observer=${lat},${lon}`;
//   const ep = `-ep=${data}`;
//   const tz = `-tz=1`
//   const endpointParams = `${body}&${observer}&${ep}&-extrap=2&-mime=${formatResult}`;
//   console.log(apiQuery + endpointParams)

//   const response = await fetch(apiQuery + endpointParams);
//   const dades = await response.json();
  
//   return dades;

// }

//------------------------------------------------------------------------------------------------


async function arrayQuery12Suns(lat, lon, data) {
  const formatResult = 'json';
  const apiQuery = 'https://ssp.imcce.fr/webservices/miriade/api/rts.php?';
  const body = `-body=11`; // el sol
  const observer = `-observer=${lat},${lon}`;
  const ep = `-ep=${data}`;
  //const tz = `-tz=1`
  const endpointParams = `${body}&${observer}&${ep}&-nbd=12&-step=30&-extrap=2&-mime=${formatResult}`;
  console.log(apiQuery + endpointParams)

  const response = await fetch(apiQuery + endpointParams);
  const dades = await response.json();
  
  return dades;

}


export {arrayQueryResults, arrayQuery12Suns};