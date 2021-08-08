import React, { createContext, useReducer, useContext } from 'react';
import _ from 'lodash';

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
  let grpIndex, grpCopy;
  const { message, messages } = action.payload;

  switch (action.type) {
    case 'SET_GROUPS':
      return {
        ...state,
        groups: action.payload,
      };
    case 'SET_USER_MESSAGES':
      grpCopy = [...state.groups];

      grpIndex = grpCopy.findIndex((u) => u.groupId === action.payload.groupId);
      grpCopy[grpIndex] = {
        ...grpCopy[grpIndex],
        messages: messages,
      };

      return {
        ...state,
        groups: grpCopy,
      };
    case 'SET_GROUP_ID':
      grpCopy = state.groups.map((grp) => ({
        ...grp,
        selected: grp.groupId === action.payload,
      }));

      return {
        ...state,
        groups: grpCopy,
      };
    case 'ADD_MESSAGE':
      grpCopy = [...state.groups];

      grpIndex = _.findIndex(grpCopy, function (o) {
        return o.selected === true;
      });

      let newGrp = {
        ...grpCopy[grpIndex],
        messages: [message, ...grpCopy[grpIndex].messages],
      };

      grpCopy[grpIndex] = newGrp;

      return {
        ...state,
        groups: grpCopy,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { groups: null });

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
