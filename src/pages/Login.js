import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { gql, useLazyQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import { useAuthDispatch } from '../context/auth';

const LOGIN_USER = gql`
  query login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      username
      email
      activeToken
    }
  }
`;

export default function Register(props) {
  const [variables, setVariables] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const dispatch = useAuthDispatch();

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
    onCompleted(data) {
      dispatch({ type: 'LOGIN', payload: data.login });
      props.history.push('/');
    },
  });

  const submitLoginForm = (e) => {
    e.preventDefault();

    loginUser({ variables });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Login|YC-Chat-App</title>
      </Helmet>
      <Row className="bg-white py-5 justify-content-center">
        <Col sm={8} md={6} lg={4}>
          <h1 className="text-center">Login</h1>
          <Form onSubmit={submitLoginForm}>
            <Form.Group>
              <Form.Label className={errors.email && 'text-danger'}>
                {errors.email ?? 'Email'}
              </Form.Label>
              <Form.Control
                type="email"
                value={variables.email}
                className={errors.email && 'is-invalid'}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className={errors.password && 'text-danger'}>
                {errors.password ?? 'Password'}
              </Form.Label>
              <Form.Control
                type="password"
                value={variables.password}
                className={errors.password && 'is-invalid'}
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
                required
              />
            </Form.Group>
            <div className="text-center mt-2 mb-2">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? 'loading..' : 'Login'}
              </Button>
              <br />
              <small>
                Don't have an account? <Link to="/register">Register</Link>
              </small>
            </div>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
}
