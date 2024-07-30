'use strict';

import { planets, fillComparisonContainer } from "./modules/solarsysmodules.js";

function comparePlanets(){

  // eventListeners als botons
  const compareButtons = document.querySelectorAll('.button-comparar');
  for (const [index, compareButton] of compareButtons.entries()) {
    compareButton.addEventListener('click', () => fillComparisonContainer(index));
  }
}

comparePlanets();
