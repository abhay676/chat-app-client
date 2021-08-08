import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { Col } from 'react-bootstrap';

import { useMessageDispatch, useMessageState } from '../../context/message';

const GET_GROUPS = gql`
  query getGroups {
    getGroups {
      groupId
      name
      slug
    }
  }
`;

export default function Groups() {
  const dispatch = useMessageDispatch();
  const { groups } = useMessageState();

  const selectedGrp = groups?.find((u) => u.selected === true)?.groupId;

  const { loading } = useQuery(GET_GROUPS, {
    onCompleted: (data) =>
      dispatch({ type: 'SET_GROUPS', payload: data.getGroups }),
    onError: (err) => console.log(err),
  });

  let grps;
  if (!groups || loading) {
    grps = <p>Loading..</p>;
  } else if (groups.length === 0) {
    grps = <p>No chat room find</p>;
  } else if (groups.length > 0) {
    grps = groups.map((grp) => {
      const selected = selectedGrp === grp.groupId;
      return (
        <div
          role="button"
          className={
            selected
              ? 'd-flex justify-content-center justify-content-md-start p-3 text-center bg-light'
              : 'grp-div d-flex justify-content-center justify-content-md-start p-3 text-center'
          }
          key={grp.groupId}
          onClick={() =>
            dispatch({ type: 'SET_GROUP_ID', payload: grp.groupId })
          }
        >
          <div className="d-none d-md-block ml-2">
            <p className="fw-bolder" style={{ color: '#FA9B50' }}>
              {grp.name}
            </p>
          </div>
        </div>
      );
    });
  }
  return (
    <Col xs={2} md={4} className="p-0" style={{ backgroundColor: '#20232A' }}>
      {grps}
    </Col>
  );
}
