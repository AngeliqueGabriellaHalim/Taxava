import React from 'react';
import logo from './logo.svg';
import './App.css';
import Card from './Card';

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}

      <header className="App-header">
        <h1>Welcome to TAXAVA</h1>

        <Card
          title="TAXAVA"
          description="Present your corporate and building asset."
        />
      </header>

    </div>
  );
}

export default App;
