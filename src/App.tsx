import { type ReactPlayerOptions, useReactPlayer } from "@player-ui/react";
import { AssetsRegistryPlugin } from "./assets";
import { Suspense, useEffect } from "react";
import flow from "./generated/index.json";

const config: ReactPlayerOptions = {
  plugins: [new AssetsRegistryPlugin()],
};

function App() {
  const { reactPlayer } = useReactPlayer(config);

  useEffect(() => {
    reactPlayer.start(flow as any);
  }, [reactPlayer]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <reactPlayer.Component />
    </Suspense>
  );
}

export default App;
