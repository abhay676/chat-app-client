import React, { Fragment, useEffect, useState } from 'react';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { Col, Form } from 'react-bootstrap';

import { useMessageDispatch, useMessageState } from '../../context/message';

import Message from './Message';

const SEND_MESSAGE = gql`
  mutation sendMessage($groupId: String!, $content: String!) {
    sendMessage(groupId: $groupId, content: $content) {
      groupId
      from
    }
  }
`;

const GET_MESSAGES = gql`
  query getMessages($groupId: String!) {
    getMessages(groupId: $groupId) {
      message
      messageId
      from
      createdAt
    }
  }
`;

export default function Messages() {
  const { groups } = useMessageState();
  const dispatch = useMessageDispatch();
  const [content, setContent] = useState('');

  const selectedGroup = groups?.find((u) => u.selected === true);
  const messages = selectedGroup?.messages;

  const [getMessages, { loading: messagesLoading, data: messagesData }] =
    useLazyQuery(GET_MESSAGES);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onError: (err) => console.log(err),
  });

  useEffect(() => {
    if (selectedGroup) {
      getMessages({ variables: { groupId: selectedGroup.groupId } });
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (messagesData) {
      dispatch({
        type: 'SET_USER_MESSAGES',
        payload: {
          groupId: selectedGroup.groupId,
          messages: messagesData.getMessages,
        },
      });
    }
  }, [messagesData]);

  const submitMessage = (e) => {
    e.preventDefault();

    if (content.trim() === '' || !selectedGroup) return;

    setContent('');

    // mutation for sending the message
    sendMessage({ variables: { groupId: selectedGroup.groupId, content } });
  };

  let selectedChatMarkup;
  if (!messages && !messagesLoading) {
    selectedChatMarkup = <p className="info-text">Select a Room</p>;
  } else if (messagesLoading) {
    selectedChatMarkup = <p className="info-text">Loading..</p>;
  } else if (messages.length > 0) {
    selectedChatMarkup = messages.map((message, index) => (
      <Fragment key={message.messageId}>
        <Message message={message} />
        {index === messages.length - 1 && (
          <div className="invisible">
            <hr className="m-0" />
          </div>
        )}
      </Fragment>
    ));
  } else if (messages.length === 0) {
    selectedChatMarkup = <p className="info-text">send your first message!</p>;
  }

  return (
    <Col xs={10} md={8} className="p-0">
      <div className="messages-box d-flex flex-column-reverse p-3">
        {selectedChatMarkup}
      </div>

      {messages && (
        <div className="px-3 py-2">
          <Form onSubmit={submitMessage}>
            <Form.Group className="d-flex align-items-center m-0">
              <Form.Control
                type="text"
                className="message-input rounded-pill p-4 "
                placeholder="Type a message.."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <i
                className="fas fa-paper-plane fa-2x text-primary ml-2"
                onClick={submitMessage}
                role="button"
              ></i>
            </Form.Group>
          </Form>
        </div>
      )}
    </Col>
  );
}
