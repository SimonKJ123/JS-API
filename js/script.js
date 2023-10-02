// Importing the IGNORE constant from the filter.js module
import { IGNORE } from "./modules/filter.js";

// Immediately invoked async function expression (IIFE)
const swapiApp = (async function () {
  const SWAPIURL = "https://swapi.dev/api/";
  const NAVBAR = document.querySelector("#nav-bar");
  const CARDCONTAINER = document.querySelector(".card-container");

  // Variables to store URLs for pagination
  let nextPageURL = null;
  let previousPageURL = null;

  try {
    // Fetching data from SWAPIURL
    const RESPONSE = await fetch(SWAPIURL);
    const JSONDATA = await RESPONSE.json();

    // Creating navigation items based on the keys in JSONDATA
    for (let key in JSONDATA) {
      let navItem = document.createElement("a");
      navItem.addEventListener("click", navClick);
      navItem.className = "nav-item";
      navItem.innerText = key;
      navItem.href = JSONDATA[key];
      NAVBAR.appendChild(navItem);
    }

    // Programmatically triggering a click on the first navigation item
    document.querySelectorAll(".nav-item")[0].click();
  } catch (error) {
    console.log(error);
  }

  // Event handler for navigation item click
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

  // Event handlers for next and previous buttons
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

  // Fetch data for a given URL
  async function fetchPageData(url) {
    CARDCONTAINER.innerHTML = "";
    const data = await getData(url);
    nextPageURL = data.next;
    previousPageURL = data.previous;
    document.getElementById("nextButton").disabled = !nextPageURL;
    document.getElementById("previousButton").disabled = !previousPageURL;
    showData(data);
  }

  // Fetch data from a given URL
  async function getData(url) {
    const RESPONSE = await fetch(url);
    return await RESPONSE.json();
  }

  // Display data in the card container
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

      // Event listener for displaying full data on card click
      card.addEventListener("click", function () {
        showFullData(dataItem);
      });

      CARDCONTAINER.appendChild(card);
    });
  }

  // Display full data in a focused view
  function showFullData(dataItem) {
    // Remove the event listener from all cards to disable further clicks
    document.querySelectorAll('.card').forEach((card) => {
      card.removeEventListener('click', showFullData);
    });

    // Remove the active class from all cards
    document.querySelectorAll('.card').forEach((card) => {
      card.classList.remove('active');
    });

    // Create a focused view container
    const focusedView = document.createElement("div");
    focusedView.className = "focused-view";

    for (let [k, v] of Object.entries(dataItem)) {
      focusedView.insertAdjacentHTML(
        "beforeend",
        `<span class="key">${k.replaceAll("_", " ")}: </span> <span class="val">${v}</span><br>`
      );
    }

    // Hide all other cards
    document.querySelectorAll('.card').forEach((cardElement) => {
      cardElement.style.display = "none";
    });

    // Append the focused view to the document body
    document.body.appendChild(focusedView);

    // Add an exit button to return to the card display
    const exitButton = document.createElement("button");
    exitButton.className = "exit-button";
    exitButton.textContent = "Exit";
    exitButton.addEventListener("click", function () {
      focusedView.remove(); // Remove the focused view
      document.querySelectorAll('.card').forEach((card) => {
        card.style.display = "block"; // Show all cards again
      });
      document.querySelectorAll('.card').forEach((card) => {
        card.addEventListener('click', showFullData); // Add event listener back to cards
      });
    });
  
    focusedView.appendChild(exitButton);
  }

  // Add event listeners to all cards
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('click', showFullData);
  });

})();

