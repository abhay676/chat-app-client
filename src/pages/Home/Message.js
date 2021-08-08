import React, { useState } from 'react';
import classNames from 'classnames';
import Avatar from 'react-avatar';
import moment from 'moment';
import aes256 from 'aes256';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useAuthState } from '../../context/auth';
const key = process.env.REACT_APP_ENCRYPTION_KEY;

const DoDecrypt = (message) => {
  let decrypted = aes256.decrypt(key, message);
  return decrypted;
};

export default function Message({ message }) {
  const { user } = useAuthState();
  const sent = message.from === user.username;
  const received = !sent;
  const msg = DoDecrypt(message?.message);
  return (
    <div
      className={classNames('d-flex my-3', {
        'ml-auto': sent,
        'mr-auto': received,
      })}
    >
      {sent}

      <div
        className={classNames(
          'py-2 px-3 position-relative d-flex flex-row  justify-content-between align-self-center'
        )}
      >
        <Avatar
          name={message.from}
          size={35}
          round
          style={{ marginRight: '15px' }}
        />

        <div>
          <p className={classNames('message')} key={message.messageId}>
            {msg}
          </p>
          <div className="form-text d-flex flex-row justify-content-between">
            <OverlayTrigger
              placement={sent ? 'right' : 'left'}
              overlay={<Tooltip>{message.from}</Tooltip>}
            >
              <p
                style={{ marginRight: '10px' }}
                className={sent ? 'text-danger' : null}
              >
                @{message.from}
              </p>
            </OverlayTrigger>
            <p>{moment(new Date(message.createdAt)).format('L')}</p>
          </div>
        </div>
      </div>

      {received}
    </div>
  );
}
