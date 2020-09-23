import { VariablesAreInputTypesRule } from "graphql";
import React from "react";
import { Container } from "react-bootstrap";
import "./App.scss";
import Register from './pages/register'
import Login from './pages/login'
import Home from './pages/home'
import ApolloProvider from './aplloProvider'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  

  return (
    <ApolloProvider>
      <BrowserRouter>
      <Container className="pt-5">
        <Route exact path="/" component={Home}/>
         <Route path="/register" component={Register}/>
         <Route path="/login" component={Login}/>
      </Container>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
