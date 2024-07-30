'use strict';

import {showHistory, showResults, setDate} from './modules/sunmodules.js';

// 
function getLocation() {
  // Formulari lloc geogràfic
  const locationForm = document.querySelector('#location-form');
  // Input on introduïm la ubicació
  const locationInput = document.querySelector('#location-input');
  // Botó cerca
  const searchButton = document.querySelector('.search-button');
  // Botó inicialment desactivat
  searchButton.disabled = true;

  // Events listeners per teclat(keyup) i per si triem opció amb ratolí, sense teclat (input)
  locationForm.addEventListener('keyup', buttonState);
  locationForm.addEventListener('input', buttonState);
  locationForm.addEventListener('blur', buttonState);

  /**
   * Funció que canvia l'estat del botó cerca segons hi hagi o no dades. (Eliminem espais inicials)
   */
  function buttonState() {
    searchButton.disabled = locationInput.value.trim() === "" ? true: false; 
  }

  // Listener pel submit, mostrem suggeriments de llocs si fem submit
  locationForm.addEventListener('submit', showResults);
  
  // Si encara no hem fet submit, mostrem l'historial, si n'hi ha
  showHistory();
}

// localStorage.clear()
getLocation();
setDate();






