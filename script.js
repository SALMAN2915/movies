let movieData = []; // This will hold the movie data

// Get references to DOM elements
const genreSelect = document.getElementById("genre-select");
const movieNameInput = document.getElementById("movie-name");
const movieYearInput = document.getElementById("movie-year");
const recommendButton = document.getElementById("recommend-button");
const movieList = document.getElementById("movie-list");

// Fetch and parse the CSV file (movies.csv)
fetch('movies.csv')
    .then(response => response.text())
    .then(csvData => {
        Papa.parse(csvData, {
            header: true, // Assumes the first row of CSV is the header
            skipEmptyLines: true,
            complete: function(results) {
                movieData = results.data;
                console.log(movieData); // Log the data to verify it is loaded
            },
            error: function(error) {
                console.error("Error parsing CSV:", error);
            }
        });
    })
    .catch(error => {
        console.error("Error fetching CSV file:", error);
    });

// Event listener for the recommendation button
recommendButton.addEventListener("click", function () {
    const selectedGenre = genreSelect.value;
    const movieNameFilter = movieNameInput.value.toLowerCase();
    const movieYearFilter = movieYearInput.value;

    // Clear the previous recommendations
    movieList.innerHTML = "";

    // Filter the movies based on the user's input
    const filteredMovies = movieData.filter(movie => {
        let matchesGenre = movie.Genre.toLowerCase() === selectedGenre;
        let matchesName = true;
        let matchesYear = true;

        if (movieNameFilter) {
            matchesName = movie["Movie Name"].toLowerCase().includes(movieNameFilter);
        }

        if (movieYearFilter) {
            matchesYear = movie["Year"] === movieYearFilter;
        }

        return matchesGenre && matchesName && matchesYear;
    });

    // Display only the first filtered recommendation
    if (filteredMovies.length > 0) {
        const movie = filteredMovies[0]; // Get the first matching movie
        const listItem = document.createElement("li");
        listItem.textContent = `${movie["Movie Name"]} (${movie.Year})`;
        movieList.appendChild(listItem);
    } else {
        movieList.innerHTML = "<li>No recommendations found based on your filters.</li>";
    }
});
