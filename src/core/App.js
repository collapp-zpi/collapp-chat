import { useState } from "react";
import Plugin from "../plugin/components/client";
import Slider from "rc-slider";
import { useWebsockets } from "./useWebsockets";
import "rc-slider/assets/index.css";
import "./index.css";

const config = require("../plugin/collapp-config.json").default_size;
const x = 200;
const gap = 20;

function App() {
  const [width, setWidth] = useState(config.width || 3);
  const [height, setHeight] = useState(config.height || 2);

  return (
    <div className="bg-warmGray-100 min-h-screen">
      <div className="w-full mx-auto flex flex-col justify-center justify-items-center py-8 max-w-5xl border-b-2 border-[#E9E9E9]">
        <div className="max-w-2xl w-full space-y-6 mx-auto">
          <div className="space-y-2">
            <h1 className="text-[#ABE2FB] text-sm font-bold text-center">
              {`Width: ${width}`}
            </h1>
            <Slider
              defaultValue={3}
              min={1}
              max={5}
              dots={true}
              onChange={(v) => {
                setWidth(v);
              }}
              value={width}
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-[#ABE2FB] text-sm font-bold text-center">
              {`Height: ${height}`}
            </h1>
            <Slider
              defaultValue={2}
              min={1}
              max={5}
              dots={true}
              onChange={(v) => {
                setHeight(v);
              }}
              value={height}
            />
          </div>
        </div>
      </div>
      <main className="w-full min-h-[75vh] overflow-hidden flex flex-col justify-center justify-items-center py-16">
        <div
          className="overflow-hidden bg-gray-300 flex rounded-[35px] mx-auto shadow-2xl"
          style={{
            width: width * x + (width - 1) * gap,
            height: height * x + (height - 1) * gap,
          }}
        >
          <Plugin
            useWebsockets={() => useWebsockets("")}
            ids={{
              plugin: "test",
              space: "test",
              user: "test",
            }}
            size={{ top: 0, left: 0, width, height }}
            users={{
              test: {
                name: "test",
                image: "https://collapp.live/default-user.png",
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
