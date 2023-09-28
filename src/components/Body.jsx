import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from "./Home"
import About from "./About";

class Body extends Component {
  render() {
    return (
      <Container>
        <Router>
          <Routes>
            <Route path="/" exact Component={Home}></Route>
            <Route path="/about" exact Component={About}></Route>
          </Routes>
        </Router>

      </Container>
    );
  }
}

export default Body;
