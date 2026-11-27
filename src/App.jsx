import { useState, useEffect } from 'react'
import './App.css'

const QUERY = "spielberg"; // hardcoded search string
const API_KEY = "9bcebec9c75a2cce0ed9a210e86ec108";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w185";

function ImagesFor({ id }) { // fetch and render all profile images for the person with this id
  const [filePaths, setFilePaths] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/person/${id}/images?api_key=${API_KEY}`)
      .then(res => res.json()) // parse the response as JSON
      .then(data => setFilePaths(data.profiles.map(p => p.file_path))); // extract the file_paths
  }, [id]); // re-fetch if the id changes

return (
  <div className="images">
    {filePaths.map(path => <img key={path} src={IMAGE_BASE + path} alt="" />)}
  </div>
);
}

function Person({ person }) { // define a Person component that takes a person prop
  return (
    <div className="person">
        <ImagesFor id={person.id} />
        <div className="person-info">

      <h1 style={{ fontWeight: 'bold' }}>{person.name}</h1> 
      <p style={{ fontStyle: 'italic' }}>Department: {person.known_for_department}</p>
      
      <div className="known-for">
        <p>Known For:</p>
        {person.known_for.map((movie) => (
          <p key={movie.id}>'{movie.title}'</p>
        ))}
      </div>
        </div>

    </div>
  )
}

function App() {
  const [persons, setPersons] = useState([]); // define a state variable to hold the persons fetched from the API
  const [index, setIndex] = useState(0); // define a state variable to hold the index of the currently displayed person

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(QUERY)}&api_key=${API_KEY}`)
      .then(res => res.json()) // parse the response as JSON
      .then(data => {
        console.log(data); // log the result to test that fetch works
        setPersons(data.results); // set the persons state with the results from the API
      });
  }, []); // empty dependency array: run only once, when the component mounts

return (
  <div>
    <div className="navigation">

    <button
      onClick={() => setIndex(index - 1)}
      disabled={index === 0}
      >
      Previous
    </button>

    <span> {index + 1} / {persons.length} </span>

    <button
      onClick={() => setIndex(index + 1)}
      disabled={index === persons.length - 1}
      >
      Next
    </button>
    </div>

    {persons.length > 0 && <Person person={persons[index]} />}
  </div>
);
}

export default App