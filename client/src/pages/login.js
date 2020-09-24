import React, { useState, useEffect  } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { gql, useQuery, useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom'
import { Toast } from 'react-bootstrap'
import { useAuthDispatch } from '../context/auth'

const LOGIN_USER = gql`
  query login($username: String!  $password: String! ) {
    login(username: $username password: $password) {
      username
      email
      createdAt
      token
    }
  }
`;

export default function Login(props) {

    var timeout

    const[variables, setVariables] = useState({
        username: "",
        password: "",
      });

      const [errors, setErrors] = useState({})
      const [show, setShow] = useState(false)
      const dispatch = useAuthDispatch()
     

      const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
        onError: (err) => {
          setErrors(err.graphQLErrors[0].extensions.errors)
        },
        onCompleted: (data) => {
            dispatch({type: 'LOGIN', payload: data.login})
            props.history.push('/')
        } 
    });


    function myFunction() {
        timeout = setTimeout(function(){
            setShow(false)
        }, 3000);

    }

      useEffect(() => {  
        setShow(props.history.location.state === undefined ? false : true)
        myFunction()
     });

      const submitLoginForm = (e) => {
        e.preventDefault();
        loginUser({variables})
      };

    return (
        <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={6}>
          <h1 className="text-center">Login form</h1>
          <Form onSubmit={submitLoginForm}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className={errors.username && 'text-danger'}>
                    {errors.username ?? 'Username'}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                onChange={(e) => {
                    setVariables({
                      ...variables,
                      username: e.target.value,
                    });
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
                    setVariables({
                      ...variables,
                      password: e.target.value,
                    });
                  }}
              />
              </Form.Group>
           
            <Button variant="success" type="submit">
              Login
            </Button>
           <small> Not registered yet ? <Link to="/register"> register </Link>  </small>
          </Form>
        </Col>

        <Toast  show={show} 
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
            }}>

            <Toast.Header>
                <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
                <strong className="mr-auto">Server Notification </strong>
            </Toast.Header>
            <Toast.Body style={{color: 'green'}}> <b>You've been registered successfully </b></Toast.Body>
        </Toast>
    

      </Row>
    )
}
