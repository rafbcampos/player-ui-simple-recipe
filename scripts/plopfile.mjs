import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const basePath = resolve(__dirname);

export default function (plop) {
  plop.setGenerator("asset", {
    description: "Create a new asset",
    prompts: [
      {
        type: "input",
        name: "assetName",
        message: "Asset name:",
      },
    ],
    actions: [
      {
        type: "addMany",
        destination: join(basePath, "../src/assets/{{kebabCase assetName}}"),
        base: join(basePath, "../src/assets/template"),
        templateFiles: join(basePath, "../src/assets/template/**/*"),
        globOptions: { dot: true },
        stripExtension: true,
      },
      ...Object.values(extendedActions),
    ],
  });
}

const extendedActions = {
  pluginImportAsset: {
    type: "append",
    path: join(basePath, "../src/assets/index.ts"),
    pattern: /(.|\n)+(import.*from "@.*)/,
    template:
      'import { {{pascalCase assetName}}Asset, {{pascalCase assetName}}Component, {{camelCase assetName}}Transform } from "./{{kebabCase assetName}}";',
  },
  pluginTransform: {
    type: "append",
    path: join(basePath, "../src/assets/index.ts"),
    pattern: /Add your transforms here/,
    template: `        [{type: "{{kebabCase assetName}}" }, {{camelCase assetName}}Transform],`,
  },
  pluginAssetType: {
    type: "append",
    path: join(basePath, "../src/assets/index.ts"),
    pattern: /Add your components type here/,
    template: "        {{pascalCase assetName}}Asset,",
  },
  pluginAsset: {
    type: "append",
    path: join(basePath, "../src/assets/index.ts"),
    pattern: /Add your assets here/,
    template:
      "        [{{kebabCase assetName}}, {{pascalCase assetName}}Component]",
  },
};
