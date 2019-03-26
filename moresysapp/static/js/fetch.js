const POPULAR_API_ENDPOINT = 'top_movies';
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
            console.log(this.responseText + '\n\n');
            // const img_src  = 'https://image.tmdb.org/t/p/original/'+movie_data['poster_path'];
            const movie_title  = movie_data['title'];
            // const movie_year  = movie_data['release_date'].substring(0, 4);
            // const movie_runtime  = movie_data['runtime'] + ' min';
            const votes = movie_data['vote_average'];
            // const movie_genres  = "Action, Adventure, Sci-Fi";
            // var movie_genres  = movie_data['genres'][0]['name'];
            // for (var i=1; i < movie_data['genres'].length; i++) {
            //   movie_genres += ', ' + movie_data['genres'][i]['name']
            // }
            // const movie_desc  = movie_data['overview'];
            const movie_backdrop  = 'https://image.tmdb.org/t/p/original/'+movie_data['backdrop_path'];

            {/* <div class="card col-md-4 col-sm-6 col-12">
            <img class="card-img-top" src="https://image.tmdb.org/t/p/w533_and_h300_bestv2/xu9zaAevzQ5nnrsXN6JcahLnG4i.jpg">
            <div class="card-desc">
                <span class="card-movie-title">Interstellar </span>
                <span class="rating"><i class="fas fa-star"></i> 4</span>
            </div>
            </div> */}
            var card = document.createElement('div');
            card.classList.add('card', 'col-md-4', 'col-sm-6', 'col-12');

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
                  rating_value.textContent = ' ' + votes;

            rating.appendChild(icon);
            rating.appendChild(rating_value);
            desc.appendChild(title);
            desc.appendChild(rating);
            card.appendChild(backimg);
            card.appendChild(desc);

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
  }, 500);
}

request.send();

function findTmdbId(movies) {
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
  return movieId;
}
