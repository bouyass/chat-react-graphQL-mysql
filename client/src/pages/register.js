import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'

export default function Register(props) {

    const[variables, setVariables] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    
      const submitRegisterForm = (e) => {
        e.preventDefault();
    
        console.log(variables)
      };

    return (
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={6}>
          <h1 className="text-center">Register</h1>
          <Form onSubmit={submitRegisterForm}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => {
                  setVariables({ ...variables, username: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setVariables({ ...variables, email: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => {
                  setVariables({ ...variables, password: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                onChange={(e) => {
                  setVariables({
                    ...variables,
                    confirmPassword: e.target.value,
                  });
                }}
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    )
}
