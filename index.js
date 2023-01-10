const elMarket = document.getElementById('inputMarket')
const elStop = document.getElementById('inputStop')
const elTake = document.getElementById('inputTake')
const elDeposit = document.getElementById('inputDeposit')
const elRisk = document.getElementById('inputRisk')

const elResult = document.getElementById('result')


function show(msg) {
  elResult.innerHTML = msg;
}

function round(val, precision = 4) {
  if (val > Math.pow(10, precision - 1)) {
    return parseFloat(val.toFixed(0)).toLocaleString()
  }

  return parseFloat(val.toPrecision(precision)).toLocaleString()
}

function recount() {
  localStorage.setItem('market', elMarket.value)
  localStorage.setItem('stop', elStop.value)
  localStorage.setItem('take', elTake.value)
  localStorage.setItem('deposit', elDeposit.value)
  localStorage.setItem('risk', elRisk.value)

  const priceMarket = +elMarket.value
  const priceStop = +elStop.value
  const priceTake = +elTake.value
  const deposit = +elDeposit.value
  const risk = +elRisk.value

  let output;

  if (priceMarket === priceTake) {
    show('Market price should differ from Take')
    return
  }

  if (priceMarket === priceStop) {
    show('Market price should differ from Stop')
    return
  }

  if ((priceMarket > priceTake && priceMarket > priceStop) ||
     (priceMarket < priceTake && priceMarket < priceStop)) {
    show('Market price should be between Take and Stop')
    return
  }

  if (deposit <= 0) {
    show('Deposit should be > 0')
    return
  }

  if (risk <= 0) {
    show('Risk should be > 0')
    return
  }

  try {
    const riskMoney = deposit * risk / 100

    const entryCoins = riskMoney / Math.abs(priceMarket-priceStop)

    const entryMoney = entryCoins * priceMarket;

    const winMoney = entryCoins * Math.abs(priceTake - priceMarket)

    const rr = winMoney / riskMoney

    const leverage = entryMoney / deposit

    const riskPercent = Math.abs(priceMarket-priceStop) / priceMarket * 100;
    const winPercent = Math.abs(priceMarket-priceTake) / priceMarket * 100;

    show([
      `<b>${ priceStop < priceMarket ? 'long' : 'short'} `,
      `${round(entryMoney)}</b> (${round(entryCoins)} coins)</br>`,
      `leverage ${round(leverage, 2)}</br>`,
      `win = ${round(winMoney)} / loss = ${round(riskMoney)}</br>`,
      `RR = 1:${round(rr, 2)} (${round(riskPercent, 3)}% / ${round(winPercent, 3)}%)`
    ].join(''))
  } catch (err) {
    console.log(err)
    show('???')
  }
}

elMarket.value = localStorage.getItem('market')
elStop.value = localStorage.getItem('stop')
elTake.value = localStorage.getItem('take')
elDeposit.value = localStorage.getItem('deposit')
elRisk.value = localStorage.getItem('risk')

elMarket.addEventListener('input', recount)
elStop.addEventListener('input', recount)
elTake.addEventListener('input', recount)
elDeposit.addEventListener('input', recount)
elRisk.addEventListener('input', recount)

recount()
