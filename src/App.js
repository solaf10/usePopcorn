import { useState } from "react";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import NavBar from "./NavBar";
import Box from "./Box";
import Search from "./Search";
import NumResults from "./NumResults";
import Main from "./Main";
import Error from "./Error";
import Loader from "./Loader";
import MoviesList from "./MoviesList";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";
import MovieDetails from "./MovieDetails";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const { movies, isLoading, error } = useMovie(query);

  function onSelectMovie(id) {
    setSelectedID((selectedID) => (id === selectedID ? null : id));
  }
  function onCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }
  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {!isLoading && !error && (
            <MoviesList movies={movies} onSelectMovie={onSelectMovie} />
          )}
          {isLoading && <Loader />}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              selectedID={selectedID}
              onCloseMovie={onCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
