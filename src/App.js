import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useMediaQuery } from "react-responsive";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) => {
  const result = arr.reduce((acc, cur) => acc + cur / arr.length, 0);
  return Number.isInteger(result) ? result : result.toFixed(1);
};

const KEY = "f84fc31d";

export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error, openDetails, setOpenDetails } =
    useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [selectedId, setSelectedId] = useState(null);

  const isMobile = useMediaQuery({ maxWidth: 630 });

  function handleSelectedMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(movieId) {
    setWatched((watched) =>
      watched.filter((movie) => movie.imdbID !== movieId)
    );
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        {/* Mobile layout */}
        {isMobile && (
          <Box>
            {!selectedId && !openDetails && (
              <>
                {isLoading && <Loader />}
                {!isLoading && error && <ErrorMessage message={error} />}
                {!isLoading && !error && (
                  <MovieList
                    movies={movies}
                    onSelectedMovie={handleSelectedMovie}
                  />
                )}
              </>
            )}

            {selectedId && !openDetails && (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
                openDetails={setOpenDetails}
              />
            )}

            {!selectedId && openDetails && (
              <>
                <MoviesSummary watched={watched} />
                <WatchedList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                />
              </>
            )}
          </Box>
        )}
        {/* Desktop layout */}
        {!isMobile && (
          <Box>
            {isLoading && <Loader />}
            {!isLoading && error && <ErrorMessage message={error} />}
            {!isLoading && !error && (
              <MovieList
                movies={movies}
                onSelectedMovie={handleSelectedMovie}
              />
            )}
          </Box>
        )}

        {!isMobile && (
          <Box>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
                openDetails={setOpenDetails}
              />
            ) : (
              <>
                <MoviesSummary watched={watched} />
                <WatchedList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                />
              </>
            )}
          </Box>
        )}
      </Main>
    </>
  );
}

function Loader() {
  return <p className='loader'></p>;
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔</span>
      {message}
    </p>
  );
}
function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function NavBar({ children }) {
  return <nav className='nav-bar'>{children}</nav>;
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>Movie Station</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;

    setQuery("");
    inputEl.current.focus();
  });

  return (
    <input
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, onSelectedMovie }) {
  return (
    <>
      {movies.length > 0 ? (
        <ul className='list list-movies'>
          {movies.map((movie) => (
            <Movie
              movie={movie}
              key={movie.imdbID}
              onSelectedMovie={onSelectedMovie}
            />
          ))}
        </ul>
      ) : (
        <p className='error'>
          Your MovieList is ready.. <br /> start searching🔎
        </p>
      )}
    </>
  );
}

function Movie({ movie, onSelectedMovie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>📅</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
  openDetails,
}) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const countRef = useRef(0);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const { imdbID, imdbRating, Year, Runtime, Poster, Title } = movieDetails;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID,
      Title,
      Poster,
      Year,
      userRating,
      imdbRating: Number(imdbRating),
      Runtime: isNaN(Number(Runtime.split(" ").at(0)))
        ? 0
        : Number(Runtime.split(" ").at(0)),
      countUserDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
    openDetails((open) => !open);
  }

  useEffect(
    function () {
      if (userRating) countRef.current++;
    },
    [userRating]
  );

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovieDetails() {
        try {
          setIsLoading(true);

          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching movie details");
          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");
          setMovieDetails(data);
        } catch (err) {
          if (err.name !== "AbortError") {
            setMovieDetails({});
            console.log(err.message);
          }
        } finally {
          setIsLoading(false);
          setUserRating(null);
        }
      }

      fetchMovieDetails();
      return function () {
        controller.abort();
      };
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!Title) return;
      document.title = `Movie | ${Title}`;

      // Clean up function
      return function () {
        document.title = "Movie Station";
      };
    },
    [Title]
  );
  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>
            <img alt={movieDetails?.Title} src={movieDetails?.Poster} />
            <div className='details-overview'>
              <h2>{movieDetails?.Title}</h2>

              <p>
                {movieDetails?.Released} &bull; {movieDetails?.Runtime}
              </p>
              <p>{movieDetails?.Genre}</p>
              <p>
                <span>⭐</span> {movieDetails?.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button className='btn-add' onClick={handleAdd}>
                      + add to list
                    </button>
                  )}
                </>
              ) : (
                <p className='text-center'>
                  You rated this movie with {watchedRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{movieDetails?.Plot}</em>
            </p>
            <p>Starring {movieDetails?.Actors}</p>
            <p>Directed by {movieDetails?.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function MoviesSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.Runtime));
  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.Runtime} min</span>
        </p>
      </div>
      <button
        className='btn-delete'
        onClick={function () {
          onDeleteWatched(movie.imdbID);
        }}
      >
        X
      </button>
    </li>
  );
}
