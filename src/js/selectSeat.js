const container = document.querySelector(".container");
const seats = document.querySelectorAll(".row .seat:not(.sold)");
const count = document.getElementById("count");
const total = document.getElementById("total");
const movieSelect = document.getElementById("movie");
const showingUrl = "http://localhost:8080/showing";
document.addEventListener('DOMContentLoaded', createFormEventListener);

populateUI();

let ticketPrice = +movieSelect.value;
let formShowing;
function createFormEventListener(){
    formShowing = document.getElementById("createShowing");
    formShowing.addEventListener("submit", handleFormSubmit);
}
async function handleFormSubmit(event) {

    event.preventDefault();

    try {
        const formData = new FormData(formShowing)

        const responseData = await postFormData(showingUrl, formData)
        console.log(responseData);
    } catch (error) {
        alert(error.message)

    }
}
async function postFormData(url, formData) {
    const plainFormData = Object.fromEntries(formData.entries())
    console.log(plainFormData)

    const formDataJsonString = JSON.stringify(plainFormData)

    const fetchOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formDataJsonString
    }

    const response = await fetch(url, fetchOptions)
    return response;
}



/////////////////////////////////////////////////////////////////////////
// Save selected movie index and price
function setMovieData(movieIndex, moviePrice) {
    localStorage.setItem("selectedMovieIndex", movieIndex);
    localStorage.setItem("selectedMoviePrice", moviePrice);
}

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll(".row .seat.selected");

    const seatsIndex = [...selectedSeats].map((seat) => [...seats].indexOf(seat));

    localStorage.setItem("selectedSeats", JSON.stringify(seatsIndex));

    const selectedSeatsCount = selectedSeats.length;

    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;

    setMovieData(movieSelect.selectedIndex, movieSelect.value);
}


// Get data from localstorage and populate UI
function populateUI() {
    const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"));

    if (selectedSeats !== null && selectedSeats.length > 0) {
        seats.forEach((seat, index) => {
            if (selectedSeats.indexOf(index) > -1) {
                console.log(seat.classList.add("selected"));
            }
        });
    }

    const selectedMovieIndex = localStorage.getItem("selectedMovieIndex");

    if (selectedMovieIndex !== null) {
        movieSelect.selectedIndex = selectedMovieIndex;
        console.log(selectedMovieIndex)
    }
}
console.log(populateUI())
// Movie select event
movieSelect.addEventListener("change", (e) => {
    ticketPrice = +e.target.value;
    setMovieData(e.target.selectedIndex, e.target.value);
    updateSelectedCount();
});

// Seat click event
container.addEventListener("click", (e) => {
    if (
        e.target.classList.contains("seat") &&
        !e.target.classList.contains("sold")
    ) {
        e.target.classList.toggle("selected");

        updateSelectedCount();
    }
});

// Initial count and total set
updateSelectedCount();