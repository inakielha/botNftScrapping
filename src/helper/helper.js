const moment = require('moment');

function delay(ms) {
    const delayTime = ms + Math.floor(Math.random() * 500);
    return new Promise(resolve => setTimeout(resolve, delayTime));
  }

  function obtenerFechaHaceUnaSemana() {
    const fechaHoy = moment();
    const fechaHaceUnaSemana = fechaHoy.subtract(1, 'week');
  
    return fechaHaceUnaSemana.format('YYYY-MM-DD');
  }
  
  const fechaResultado = obtenerFechaHaceUnaSemana();
  console.log('Fecha hace una semana:', fechaResultado);

  const puppeteer = require('puppeteer');

async function scrollUpWithRandomValue(page) {


  const randomScrollValue = Math.floor(Math.random() * 500) + 100; // Valor aleatorio entre 100 y 600 (ajusta según sea necesario)

  await page.evaluate(`window.scrollBy(0, -${randomScrollValue})`);
  await page.waitForTimeout(1000); // Espera unos segundos para que se complete el desplazamiento (ajusta según sea necesario)

  const currentHeight = await page.evaluate('document.body.scrollHeight');

  if (currentHeight < previousHeight) {
    console.log(`La página se desplazó hacia arriba ${randomScrollValue}px.`);
  } else {
    console.log('No se pudo realizar el desplazamiento hacia arriba.');
  }
}

  module.exports = {
    delay,
    obtenerFechaHaceUnaSemana,
    scrollUpWithRandomValue
  }