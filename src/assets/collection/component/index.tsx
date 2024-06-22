import React, { ReactAsset } from "@player-ui/react";
import { CollectionAsset } from "../types";

export const CollectionComponent = (props: CollectionAsset) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.values?.map((value) => (
        <ReactAsset key={value.id as string} {...value} />
      ))}
    </div>
  );
};
