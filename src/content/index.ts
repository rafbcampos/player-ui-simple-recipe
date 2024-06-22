import { FLOW_ID } from "../constants";
import { navigation } from "./navigation";
import { schema } from "./schema";
import { views } from "./views";

export default {
  id: FLOW_ID,
  views,
  navigation,
  schema,
  data: {
    name: "",
    age: 0,
    phone: "",
    city: "",
  },
};
