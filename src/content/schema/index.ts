import { dataTypes } from "@player-ui/common-types-plugin";
import { makeBindingsForObject } from "@player-tools/dsl";

export const schema = {
  name: dataTypes.StringType,
  age: dataTypes.IntegerNNType,
  phone: dataTypes.PhoneType,
  city: dataTypes.StringType,
};

export const bindings = makeBindingsForObject(schema);
