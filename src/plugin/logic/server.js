const set = (state, data) => {
  return {
    ...state,
    arr: [...(state.arr || []), data.item],
  };
};

const open = (state, data) => {
  return state;
};

const events = {
  set,
  __OPEN: open,
};

module.exports = {
  default: events,
};
