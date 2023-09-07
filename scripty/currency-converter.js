const dropList = document.querySelectorAll("form select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getButton = document.querySelector("form button"),
  exchangeIcon = document.querySelector("form .icon i");

dropList.forEach((drop, i) => {
  for (let currency_code in country_list) {
    let selected = i === 0 ? (currency_code === "EUR" ? "selected" : "") : (currency_code === "CZK" ? "selected" : "");
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    drop.insertAdjacentHTML("beforeend", optionTag);
  }

  console.log(dropList);

  drop.addEventListener("change", e => {
    loadFlag(e.target);
  });
});

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", e => {
  e.preventDefault();
  getExchangeRate();
});

exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector("form input");
  const exchangeRateText = document.querySelector("form .exchange-rate");

  let amountVal = amount.value;

  if (amountVal == "" || amountVal == "0") {
    amount.value = "1";
    amountVal = 1;
  }
  exchangeRateText.innerText = "Zjisťuji hodnotu...";
  let url = `https://v6.exchangerate-api.com/v6/fad1741335ce29bedfa81cd6/latest/${fromCurrency.value}`;
  fetch(url)
    .then(response => response.json())
    .then(result => {
      let exchangeRate = result.conversion_rates[toCurrency.value];
      let totalExRate = (amountVal * exchangeRate).toFixed(2);
      exchangeRateText.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangeRateText.innerText = "Něco se pokazilo!";
    });
}
