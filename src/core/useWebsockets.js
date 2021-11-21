import { useState, useEffect } from "react";

export function useWebsockets(url) {
  const [state, setState] = useState({});
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [room, setRoom] = useState("test");
  const [functions, setFunctions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [module, setModule] = useState({});

  const send = (fun, data) => {
    if (functions.includes(fun)) {
      const newState = module[fun](state, data);
      setState(newState);
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setInterval(() => {
      setConnected(true);
      setLoading(false);
    }, 1500);
    const m = require("../plugin/logic/server").default;
    const func = Object.keys(m);
    setFunctions(func);
    setModule(m);
  }, []);

  return { loading, connected, socket, state, send, errors, room, functions };
}
