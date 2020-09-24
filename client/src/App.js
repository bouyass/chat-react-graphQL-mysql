import { VariablesAreInputTypesRule } from "graphql";
import React from "react";
import { Container } from "react-bootstrap";
import "./App.scss";
import Register from "./pages/register";
import Login from "./pages/login";
import Home from "./pages/home";
import ApolloProvider from "./aplloProvider";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import DynamicRoute from './util/dynamicRoutes'

function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container className="pt-5">
              <DynamicRoute exact path="/" component={Home} authenticated />
              <DynamicRoute path="/register" component={Register} guest />
              <DynamicRoute path="/login" component={Login} guest />
          </Container>
        </BrowserRouter>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
