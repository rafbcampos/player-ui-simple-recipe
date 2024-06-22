import { type ReactPlayerOptions, useReactPlayer } from "@player-ui/react";
import { AssetsRegistryPlugin } from "./assets";
import { Suspense, useEffect } from "react";

const config: ReactPlayerOptions = {
  plugins: [new AssetsRegistryPlugin()],
};

function App() {
  const { reactPlayer } = useReactPlayer(config);

  useEffect(() => {
    reactPlayer.start({} as any);
  }, [reactPlayer]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <reactPlayer.Component />
    </Suspense>
  );
}

export default App;
