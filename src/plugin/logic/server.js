const send_message = (state, data) => {
  return {
    ...state,
    chat: [
      ...(state.chat || []),
      {
        ...data,
        date: new Date().getTime(),
      },
    ],
  };
};

const open = (state, data) => {
  return state;
};

const events = {
  send_message,
  __OPEN: open,
};

module.exports = {
  default: events,
};
