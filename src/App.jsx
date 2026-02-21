import React, { useState, useEffect } from 'react';
import VirtualGrid from './components/VirtualGrid';
import DebugPanel from './components/DebugPanel';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/transactions.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load data');
        return response.json();
      })
      .then(jsonData => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading">Loading 1,000,000 transactions...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="app">
      <VirtualGrid data={data} />
      <DebugPanel />
    </div>
  );
}

export default App;
