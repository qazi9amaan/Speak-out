import React from "react";

export const useStateWithCallback = (initialState) => {
  const [state, setState] = React.useState(initialState);
  const cbRef = React.useRef();

  const updateState = React.useCallback((newState, cb) => {
    cbRef.current = cb;
    setState((prev) => {
      return typeof newState === "function" ? newState(prev) : newState;
    });
  }, []);

  React.useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  return [state, updateState];
};
