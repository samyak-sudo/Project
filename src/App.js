import React from 'react';
import './App.css';
import Cards from './Components/Cards/Cards';
import Pagination from './Components/Pagination/Pagination';
import Search from './Components/Search/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Episodes from "./Pages/Episodes";
import Location from "./Pages/Location";
import CardDetails from './Components/Cards/CardDetails';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCharactersName } from './redux';

// Export Home component so it can be tested separately
export const Home = () => {
  const dispatch = useDispatch();
  const searchName = useSelector(state => state.search.searchName);
  const { characters, loading, error } = useSelector(state => state.character);
  const pageNum = useSelector(state => state.character.pageNum);

  React.useEffect(() => {
    try {
      if (searchName !== undefined && pageNum > 0) {
        dispatch(fetchCharactersName(searchName, pageNum));
      }
    } catch (err) {
      console.error('Error fetching characters:', err);
    }
  }, [dispatch, searchName, pageNum]);

  if (loading) return <div data-testid="loading-state">Loading...</div>;
  if (error) return <div data-testid="error-state">Error: {error}</div>;
  if (!characters?.results) return <div data-testid="no-data">No data available</div>;

  return (
    <div className="App" data-testid="home-content">
      <div className="container">
        <div className="row">
          <div className="col-3"></div>
          <div className="col-8">
            <div className="row">
              <Cards results={characters.results} page="/" />
            </div>
          </div>
        </div>
      </div>
      {characters.results.length > 0 && <Pagination />}
    </div>
  );
};

// Main App component
const App = () => {
  const { error } = useSelector(state => state.character);

  if (error === 'NETWORK_ERROR') {
    return <div data-testid="network-error">Network Error: Please check your connection</div>;
  }

  return (
    <Router>
      <div className="App" data-testid="app-container">
        <Search />
        <h1 style={{ textAlign: 'center' }}>Characters</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<CardDetails />} />
          <Route path="/episodes" element={<Episodes />} />
          <Route path="/episodes/:id" element={<CardDetails />} />
          <Route path="/location" element={<Location />} />
          <Route path="/location/:id" element={<CardDetails />} />
          <Route path="*" element={<div data-testid="not-found">404: Page not found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;




