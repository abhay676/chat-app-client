/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect } from 'react';
import { Row, Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { gql, useSubscription } from '@apollo/client';

import { useAuthDispatch, useAuthState } from '../../context/auth';
import { useMessageDispatch } from '../../context/message';

import Groups from './Groups';
import Messages from './Messages';

const NEW_MESSAGE = gql`
  subscription newMessage {
    newMessage {
      message
      messageId
      from
      createdAt
    }
  }
`;

export default function Home() {
  const history = useHistory();
  const authDispatch = useAuthDispatch();
  const messageDispatch = useMessageDispatch();

  const { user } = useAuthState();

  const { data: messageData, error: messageError } =
    useSubscription(NEW_MESSAGE);

  useEffect(() => {
    if (messageError) console.log(messageError);
    if (messageData) {
      const message = messageData.newMessage;
      const content = messageData.newMessage.message;
      const username = user.username;

      messageDispatch({
        type: 'ADD_MESSAGE',
        payload: {
          username,
          message,
          content,
        },
      });
    }
  }, [messageError, messageData]);

  const logout = () => {
    authDispatch({ type: 'LOGOUT' });
    history.push('/login');
  };

  return (
    <Fragment>
      <Helmet>
        <title>YC-Chat-App</title>
      </Helmet>
      <div className="d-flex flex-row justify-content-between">
        <Button onClick={logout} className="text-right btn btn-light">
          Logout
        </Button>
        <p className="text-right text-white">
          Welcome 👋, <span className="fw-bold">{user?.username}</span>
        </p>
      </div>
      <Row className="bg-white justify-content-around mb-1"></Row>
      <Row className="bg-white">
        <Groups />
        <Messages />
      </Row>
    </Fragment>
  );
}
