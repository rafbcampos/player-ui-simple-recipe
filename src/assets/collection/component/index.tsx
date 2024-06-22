import { ReactAsset } from "@player-ui/react";
import { CollectionAsset } from "../types";

export const CollectionComponent = (props: CollectionAsset) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.values?.map((value) => (
        <span key={value.id as string}>
          <ReactAsset {...value} />
        </span>
      ))}
    </div>
  );
};
