const tmdb_key = "api_key=9df1c59827324c2eb0cbe9edeb36925e";
const tmdb_base_url = "https://api.themoviedb.org/3";
const tmdb_api_url1 =
  tmdb_base_url + "/discover/movie?sort_by=popularity.desc&" + tmdb_key;
const tmdb_api_url2 =
  tmdb_base_url +
  "/discover/movie?primary_release_date.gte=2021-09-10&primary_release_date.lte=2021-09-10&" +
  tmdb_key;
const tmdb_api_url3 =
  tmdb_base_url +
  "/discover/movie?with_genres=18&primary_release_year=2021&" +
  tmdb_key;

$(document).ready(() => {
  popMovies();
  theatreMovies();
  dramas();
  getNews();
  $("#searchForm").on("submit", (e) => {
    let searchText = $("#searchText").val();
    getMovies(searchText);
    e.preventDefault();
  });
});

function popMovies() {
  axios
    .get(tmdb_api_url1)
    .then((response) => {
      let movies = response.data.results;
      let output = "";
      $.each(movies, (index, movie) => {
        let imgpath = "https://image.tmdb.org/t/p/" + "w185" + movie.poster_path;
        output += `
        <a onClick="tmdbClicker(${movie.id})" ><div class="ff-card">
          <div class="ff-images">
          <img class="ff-image" src=${imgpath} alt='notFound'>
          </div>
          <div class="ff-text">
            <h2>${movie.title}</h2>
          </div>
        </div>
        </a>
        `;
      });

      $("#ff").html(output);
    })
    .catch((err) => {
      console.log(err);
      alert("notFound");
    });
}

function theatreMovies() {
  axios
    .get(tmdb_api_url2)
    .then((response) => {
      let movies = response.data.results;
      let output = "";
      $.each(movies, (index, movie) => {
        if (movie.poster_path != null) {
          let imgpath =
            "https://image.tmdb.org/t/p/" + "w185" + movie.poster_path;
          output += `
        <a onClick="tmdbClicker(${movie.id})"><div class="ff-card">
          <div class="ff-images">
          <img class="ff-image" src=${imgpath} alt='notFound'>
          </div>
          <div class="ff-text">
            <h2>${movie.title}</h2>
          </div>
        </div>
        </a>
        `;
        }
      });

      $("#theatre").html(output);
    })
    .catch((err) => {
      console.log(err);
      alert("notFound");
    });
}

function dramas() {
  axios
    .get(tmdb_api_url3)
    .then((response) => {
      let movies = response.data.results;
      let output = "";
      $.each(movies, (index, movie) => {
        let imgpath = "https://image.tmdb.org/t/p/" + "w185" + movie.poster_path;
        output += `
        <a onClick="tmdbClicker(${movie.id})"><div class="ff-card">
          <div class="ff-images">
          <img class="ff-image" src=${imgpath} alt='notFound'>
          </div>
          <div class="ff-text">
            <h2>${movie.title}</h2>
          </div>
        </div>
        </a>
        `;
      });

      $("#dramas").html(output);
    })
    .catch((err) => {
      console.log(err);
      alert("notFound");
    });
}

function getNews() {
  axios
    .get(
      "https://newsapi.org/v2/top-headlines?country=us&category=entertainment&apiKey=bf272fd0ed7c4151b88deaf4486ae2b9"
    )
    .then((response) => {
      console.log(response);
      let news = response.data.articles;
      let output = "";
      $.each(news, (index, x) => {
        if (x.urlToImage !== null) {
          output += `
        <a href='${x.url}'><div class="ff-card">
          <div class="news-images">
          <img class="news-image" src=${x.urlToImage} alt='notFound'>
          </div>
          <div class="ff-text news-text">
            <h2>${x.title}</h2>
          </div>
        </div>
        </a>
        `;
        }
      });
      $("#news").html(output);
    })
    .catch((err) => {
      console.log(
        "News " +
          err +
          "\nNews opens on LiveServer, but not when you open HTML file locally"
      );
    });
}

function getMovies(searchText) {
  axios
    .get("https://www.omdbapi.com/?s=" + searchText + "&apikey=f204c090")
    .then((response) => {
      console.log(response);
      let movies = response.data.Search;
      let output = "";
      $.each(movies, (index, movie) => {
        output += `
        <div class="card">
          <div class="images">
          <img class="image" src=${movie.Poster}>
          <img class="image" src=${movie.Poster}>
          <img class="image" src=${movie.Poster}>
          </div>
          <div class="text">
            <h3>${movie.Title}</h3>
            <button onClick="movieSelected('${movie.imdbID}')" class="btn" href="#">
            Movie Details
            </button>
          </div>
        </div>
        `;
      });

      $("#movies").html(output);
    })
    .catch((err) => {
      console.log(err);
      alert("notFound");
    });
}

function movieSelected(id) {
  sessionStorage.setItem("movieId", id);
  window.location = "detailed.html";
  return false;
}

function tmdbClicker(id) {
  sessionStorage.setItem("tmdbid", id);
  window.location = "detailed2.html";
  return false;
}

function getTmdb() {
  let movieId = sessionStorage.getItem("tmdbid");
  let new_url =
    "https://api.themoviedb.org/3/movie/" + movieId + "?" + tmdb_key;
  axios
    .get(new_url)
    .then((response) => {
      console.log(response);
      let movie = response.data;
      let imgpath = "https://image.tmdb.org/t/p/" + "w300" + movie.poster_path;
      let output = `
      <div class="movie-container top">
      <div class="movie-image">
          <img src="${imgpath}" class="movie-img" alt='notFound' />
      </div>
      <div class="movie-text">
          <h1 class="movie-title">${movie.original_title}</h1>
          <ul class="movie-details">
              <li class="item"><strong> Released: </strong> ${movie.release_date}</li>
              <li class="item"><strong> Genre: </strong> ${movie.genres[0].name}</li>
              <li class="item"><strong> Votes: </strong> ${movie.vote_count}</li>
              <li class="item">
                  <strong> Popularity: </strong> ${movie.popularity}
              </li>
          </ul>
          <div class="movie-plot">
              <h2>Plot</h2>
              ${movie.overview}
          </div>
      </div>
  </div>

      `;
      $("#movie").html(output);
    })
    .catch((err) => {
      console.log(err);
      alert("notFound");
    });
}

function getMovie() {
  let movieId = sessionStorage.getItem("movieId");

  axios
    .get("https://www.omdbapi.com/?i=" + movieId + "&apikey=f204c090")
    .then((response) => {
      console.log(response);
      let movie = response.data;

      let output = `
      <div class="movie-container top">
      <div class="movie-image">
          <img src="${movie.Poster}" class="movie-img" />
      </div>
      <div class="movie-text">
          <h1 class="movie-title">${movie.Title}</h1>
          <ul class="movie-details">
              <li class="item"><strong> Genre: </strong> ${movie.Genre}</li>
              <li class="item"><strong> Released: </strong> ${movie.Released}</li>
              <li class="item"><strong> Rated: </strong> ${movie.Rated}</li>
              <li class="item">
                  <strong> IMDB Rating: </strong> ${movie.imdbRating}
              </li>
              <li class="item"><strong> Director: </strong> ${movie.Director}</li>
              <li class="item"><strong> Writer: </strong> ${movie.Writer}</li>
              <li class="item"><strong> Actors: </strong> ${movie.Actors}</li>
          </ul>
          <div class="movie-plot">
              <h2>Plot</h2>
              ${movie.Plot}
          </div>
      </div>
  </div>

      `;
      $("#movie").html(output);
    })
    .catch((err) => {
      console.log(err);
      alert("notFound");
    });
}
