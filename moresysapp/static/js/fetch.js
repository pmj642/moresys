function test() {
  const POPULAR_API_ENDPOINT = 'http://127.0.0.1:5002/searchName';
  var request = new XMLHttpRequest();
  request.open('GET', POPULAR_API_ENDPOINT, true);
  
  request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    data = data['movies'];
    
    // fetch movie Id from respective names
    var movieId = findTmdbId(data);
    var cards  = [];
    setTimeout(function() {
  
      if (request.status >= 200 && request.status < 400) {
  
        for (var ii = 0; ii < movieId.length; ii++) {
          var movie = movieId[ii];
          console.log(ii + ": " + movie);
  
          var movie_data = "";
          var xhr = new XMLHttpRequest();
  
          xhr.addEventListener("readystatechange", function () {
  
            if (this.readyState === this.DONE) {
              var movie_data = JSON.parse(this.responseText);
              // console.log(this.responseText + '\n\n');
              const movie_title  = movie_data['title'];
              const movie_votes = movie_data['vote_average'];     
              const movie_backdrop  = 'https://image.tmdb.org/t/p/original/'+movie_data['backdrop_path'];
              
              var card = createCard(movie_title, movie_backdrop, movie_votes);
              const app = document.getElementById('movie-board');
              app.appendChild(card);
            }
          });
          
          const tmdb_url = "https://api.themoviedb.org/3/movie/"+movie+"?api_key=32c3cfbd58413075d2c7dd1d3932a1b0&language=en-US";        
          xhr.open("GET", tmdb_url, true);
          xhr.send(movie_data);
        }
      } else {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = `Gah, it's not working!`;
        app.appendChild(errorMessage);
      }
    }, 250);
  }
  request.send();
}

/* ******************************************************** */
function findTmdbId(movies) {
  console.log('inside find: ' + movies);
  var movieId = [];
  for (var i in movies) {
    var movie = movies[i];

    var xhr_movieId = new XMLHttpRequest();
    xhr_movieId.addEventListener("readystatechange", function () {
      if (this.readyState === this.DONE) {
        const data = JSON.parse(this.responseText);
        movieId.push(data['results'][0]['id']);
      }
    });
    xhr_movieId.open("GET", "https://api.themoviedb.org/3/search/movie?page=1&query="+ encodeURI(movie) +"&language=en-US&api_key=32c3cfbd58413075d2c7dd1d3932a1b0");
    xhr_movieId.send();
  }
  console.log(movieId);
  return movieId;
}

/* ******************************************************** */
function getPopularMovies() {
  const POPULAR_TMDB_ENDPOINT = 'https://api.themoviedb.org/3/movie/popular?page=1&language=en-US&api_key=32c3cfbd58413075d2c7dd1d3932a1b0';  
  var xhr_movieId = new XMLHttpRequest();
  xhr_movieId.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      const data = JSON.parse(this.responseText);
      for (var i = 0; i < 16; i++) {
        const movie_title  = data['results'][i]['title'];
        const movie_ratings = data['results'][i]['vote_average'];     
        const movie_backdrop  = 'https://image.tmdb.org/t/p/original/'+data['results'][i]['backdrop_path'];
        var card = createCard(movie_title, movie_backdrop, movie_ratings);
        const app = document.getElementById('movie-board');
        app.appendChild(card);
      }
    }
  });
  xhr_movieId.open("GET", POPULAR_TMDB_ENDPOINT);
  xhr_movieId.send();
}

/* ******************************************************** */
function createCard(movie_title, movie_backdrop, movie_votes) {
  var card = document.createElement('div');
  card.classList.add('card', 'col-md-4', 'col-sm-6', 'col-12');

    var anchor = document.createElement('a');
    anchor.setAttribute('href', 'movie.html?name='+movie_title);

    var backimg = document.createElement('img');
    backimg.className = 'card-img-top ';
    backimg.setAttribute('src', movie_backdrop);

    var desc = document.createElement('div');
    desc.className = 'card-desc ';
    
      var title = document.createElement('span');
      title.className = 'card-movie-title ';
      title.textContent = movie_title;
      
      var rating = document.createElement('span');
      rating.className = 'rating ';
      
        var icon = document.createElement('i');
        icon.classList.add('fa', 'fa-star');
        
        var rating_value = document.createElement('span');
        rating_value.textContent = ' ' + movie_votes;

  rating.appendChild(icon);
  rating.appendChild(rating_value);
  desc.appendChild(title);
  desc.appendChild(rating);
  anchor.appendChild(backimg);
  anchor.appendChild(desc);
  card.appendChild(anchor);

  return card;
}

/* ******************************************************** */
function printMovieDetails(movieName) {
  // console.log(movieName);
  var movieId = findTmdbId(new Array(movieName));
  console.log(movieId);
  setTimeout(function() {
  var movie = movieId[0];
  console.log(movieName + ' : ' + movie);
  var movie_data = "";
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", function () {

    if (this.readyState === this.DONE) {
      var movie_data = JSON.parse(this.responseText);
      // console.log(this.responseText + '\n\n');
      const movie_title  = movie_data['title'];
      document.getElementById('movie-title').textContent = movie_title;

      const movie_ratings = movie_data['vote_average'];    
      document.getElementById('movie-ratings').textContent = ' ' + movie_ratings;
       
      const movie_votes = movie_data['vote_count'];   
      document.getElementById('movie-votes').textContent = movie_votes;
       
      const movie_desc = movie_data['overview'];
      document.getElementById('movie-desc').textContent = movie_desc;

      const movie_release = movie_data['release_date'];
      document.getElementById('movie-release').textContent = movie_release;
      
      const movie_runtime = movie_data['runtime'];
      document.getElementById('movie-runtime').textContent = movie_runtime + ' min';
      
      const movie_poster  = 'https://image.tmdb.org/t/p/original'+movie_data['poster_path'];
      document.getElementById('movie-poster').setAttribute('src', movie_poster);

      var movie_genres = '';
      for(var i = 0; i < movie_data['genres'].length; i++)
          movie_genres += movie_data['genres'][i]['name'] + ', ';
      movie_genres = movie_genres.substr(0, movie_genres.length-2);
      document.getElementById('movie-genres').textContent = movie_genres;

      var movie_languages = '';
      for(var i = 0; i < movie_data['spoken_languages'].length; i++)
      movie_languages += movie_data['spoken_languages'][i]['name'] + ', ';
      movie_languages = movie_languages.substr(0, movie_languages.length-2);
      document.getElementById('movie-languages').textContent = movie_languages;      
      
      // var card = createCard(movie_title, movie_backdrop, movie_votes);
      // const app = document.getElementById('movie-board');
      // app.appendChild(card);
    }
    
  });
  
  const tmdb_url = "https://api.themoviedb.org/3/movie/"+movie+"?api_key=32c3cfbd58413075d2c7dd1d3932a1b0&language=en-US";        
  xhr.open("GET", tmdb_url, true);
  xhr.send(movie_data);
}, 600);
}

/* ******************************************************** */
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return decodeURI(sParameterName[1]);
        }
    }
}