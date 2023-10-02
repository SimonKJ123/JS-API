
import { IGNORE } from "./modules/filter.js";

const swapiApp = (async function () {
  const SWAPIURL = "https://swapi.dev/api/";
  const NAVBAR = document.querySelector("#nav-bar");
  const CARDCONTAINER = document.querySelector(".card-container");

  let nextPageURL = null;
  let previousPageURL = null;

  try {
    
    const RESPONSE = await fetch(SWAPIURL);
    const JSONDATA = await RESPONSE.json();

    for (let key in JSONDATA) {
      let navItem = document.createElement("a");
      navItem.addEventListener("click", navClick);
      navItem.className = "nav-item";
      navItem.innerText = key;
      navItem.href = JSONDATA[key];
      NAVBAR.appendChild(navItem);
    }

    document.querySelectorAll(".nav-item")[0].click();
  } catch (error) {
    console.log(error);
  }

  async function navClick(e) {
    e.preventDefault();
    CARDCONTAINER.innerHTML = "";
    document.querySelector(".active")?.classList.remove("active");
    this.classList.add("active");
    let data = await getData(this.href);

    nextPageURL = data.next;
    previousPageURL = data.previous;
    document.getElementById("nextButton").disabled = !nextPageURL;
    document.getElementById("previousButton").disabled = !previousPageURL;

    showData(data);
  }

  const nextButton = document.getElementById("nextButton");
  nextButton.addEventListener("click", nextButtonClick);

  const previousButton = document.getElementById("previousButton");
  previousButton.addEventListener("click", previousButtonClick);

  function nextButtonClick() {
    if (nextPageURL) {
      fetchPageData(nextPageURL);
    }
  }

  function previousButtonClick() {
    if (previousPageURL) {
      fetchPageData(previousPageURL);
    }
  }

  async function fetchPageData(url) {
    CARDCONTAINER.innerHTML = "";
    const data = await getData(url);
    nextPageURL = data.next;
    previousPageURL = data.previous;
    document.getElementById("nextButton").disabled = !nextPageURL;
    document.getElementById("previousButton").disabled = !previousPageURL;
    showData(data);
  }

  async function getData(url) {
    const RESPONSE = await fetch(url);
    return await RESPONSE.json();
  }

  function showData(data) {
    data.results.forEach((dataItem) => {
      let card = document.createElement("div");
      card.className = "card";
      for (let [k, v] of Object.entries(dataItem)) {
        if (IGNORE.includes(k)) {
          continue;
        }
        card.insertAdjacentHTML(
          "beforeend",
          `<span class="key">${k.replaceAll(
            "_",
            " "
          )}: </span> <span class="val">${v}</span><br>`
        );
      }
         
      card.addEventListener("click", function () {
        showFullData(dataItem);
      });

      CARDCONTAINER.appendChild(card);
    });
  }
     
  function showFullData(dataItem) { 
    document.querySelectorAll('.card').forEach((card) => {
      card.removeEventListener('click', showFullData);
    });
       
    document.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('active');
    });
       
    const focusedView = document.createElement("div");
    focusedView.className = "focused-view";

    for (let [k, v] of Object.entries(dataItem)) {
      focusedView.insertAdjacentHTML(
        "beforeend",
        `<span class="key">${k.replaceAll("_", " ")}: </span> <span class="val">${v}</span><br>`
      );
    }
       
    document.querySelectorAll('.card').forEach((cardElement) => {
      cardElement.style.display = "none";
    });
       
    document.body.appendChild(focusedView);
       
    const exitButton = document.createElement("button");
    exitButton.className = "exit-button";
    exitButton.textContent = "Exit";
    exitButton.addEventListener("click", function () {
      focusedView.remove(); / 
      document.querySelectorAll('.card').forEach((card) => {
        card.style.display = "block";  
      });
      document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', showFullData);  
      });
    });
  
    focusedView.appendChild(exitButton);
  }
     
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', showFullData);
  });

})();

