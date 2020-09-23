import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom'

const REGISTER_USER = gql`
  mutation register($username: String! $email: String! $password: String! $confirmPassword: String!) {
    register(username: $username email: $email password: $password confirmPassword: $confirmPassword) {
      username email
    }
  }
`;


export default function Register(props) {


    const[variables, setVariables] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      const [errors, setErrors] = useState({})

      const [registerUser, { loading }] = useMutation(REGISTER_USER, {
          update(_,__){
            props.history.push({
                pathname: '/login',
                state: { notification: "You've been successfully registered"}
            })
          }, 
          onError: (err) => {
            setErrors(err.graphQLErrors[0].extensions.errors)
          }
      });

    
      const submitRegisterForm = (e) => {
        e.preventDefault();
        registerUser({ variables })
      };

    return (
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={6}>
          <h1 className="text-center">Register form</h1>
          <Form onSubmit={submitRegisterForm}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className={errors.username && 'text-danger'}>
                    {errors.username ?? 'Username'}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => {
                  setVariables({ ...variables, username: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className={errors.email && 'text-danger'}> 
                {errors.email ?? 'Email addresss'}
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => {
                  setVariables({ ...variables, email: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className={errors.password && 'text-danger'}>
                {errors.password ?? 'Password'}
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                onChange={(e) => {
                  setVariables({ ...variables, password: e.target.value });
                }}
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className={errors.confirmPassword && 'text-danger'}>
                {errors.confirmPassword ?? 'Confirm password'}
              </Form.Label>
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
            <small> Already have an account ? <Link to="/login"> login </Link>  </small>
          </Form>
        </Col>
      </Row>
    )
}
