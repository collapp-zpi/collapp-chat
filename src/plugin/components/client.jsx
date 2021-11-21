import React, { useEffect } from "react";
import { useWebsockets } from "../../core/useWebsockets";
import { CgSpinner } from "react-icons/cg";

function Plugin({ websockets, ids, size }) {
  const { loading, connected, socket, state, send, errors, room, functions } =
    useWebsockets(`${websockets}/?id=${ids.space}_${ids.plugin}`);

  useEffect(() => {
    console.log(state);
  }, [state]);

  return (
    <div className="w-full h-full bg-blueGray-800 text-white text-center py-12 flex justify-center justify-items-center flex-col space-y-8">
      {!loading ? (
        <div className="space-y-6">
          <h1 className="text-3xl text-emerald-400 text-center m-auto font-extrabold">
            Connected
          </h1>
          <h3 className="text-sm text-white">State: {JSON.stringify(state)}</h3>
        </div>
      ) : (
        <CgSpinner className="animate-spin text-gray-500 text-3xl m-auto" />
      )}
    </div>
  );
}

export default Plugin;
