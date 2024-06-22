import type {
  Asset,
  BeforeTransformFunction,
  TransformFunction,
} from "@player-ui/player";
import { compose, composeBefore } from "@player-ui/asset-transform-plugin";
import { ActionAsset, TransformedAction } from "../types";

/**
 * Attaches the methods to execute an action
 */
const transform: TransformFunction<ActionAsset, TransformedAction> = (
  action,
  options,
) => {
  return {
    ...action,
    run() {
      if (action.exp) {
        options.evaluate(action.exp);
      }

      if (action.value) {
        options.transition?.(action.value);
      }
    },
  };
};

/**
 * Appends `exp` to the plugins.stringResolver.propertiesToSkip array or creates it if it doesn't exist
 */
export const expPropTransform: BeforeTransformFunction<Asset> = (asset) => {
  const skipArray = asset.plugins?.stringResolver?.propertiesToSkip;

  if (skipArray && skipArray.indexOf("exp") > 1) {
    return asset;
  }

  return {
    ...asset,
    plugins: {
      ...asset.plugins,
      stringResolver: {
        ...asset?.plugins?.stringResolver,
        propertiesToSkip: [
          ...(asset.plugins?.stringResolver?.propertiesToSkip ?? []),
          "exp",
        ],
      },
    },
  };
};

export const actionTransform = compose(
  transform,
  composeBefore(expPropTransform),
);
