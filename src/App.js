import React, { Component } from "react";
import "./App.css";
import CovidTable from "./components/covidTable";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <main className="container">
          <h1 className="topic">Simple Covid-19 Tracker</h1>
          <CovidTable />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
