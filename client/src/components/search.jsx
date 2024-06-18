// src/Search.js
import { useState } from 'react';
import axios from 'axios';
import './search.css';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [noResults, setNoResults] = useState(false);

    const handleSearch = async () => {
        try {
            const encodedQuery = encodeURIComponent(query);
            const response = await axios.get(`http://localhost:8000/search`, { params: { q: encodedQuery } });
            setResults(response.data);
            setNoResults(response.data.length === 0);
        } catch (error) {
            console.error('Error fetching search results', error);
        }
    };

    return (
        <div className="search-container">
            <input 
                type="text" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search..." 
                className="search-input"
            />
            <button onClick={handleSearch} className="search-button">Search</button>
            <div className="results-container">
                {results.length > 0 ? (
                    results.map((result, index) => (
                        <div key={index} className="result-box">
                            <h3 className="result-title">{result.title}</h3>
                            <p className="result-description">{result.description}</p>
                            <h4 className="result-price">{result.price}</h4>
                        </div>
                    ))
                ) : noResults ? (
                    <p className="no-results">No results found</p>
                ) : null}
            </div>
        </div>
    );
};

export default Search;
