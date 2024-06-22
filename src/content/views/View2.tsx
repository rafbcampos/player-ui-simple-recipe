import React from "react";
import { Action } from "../../assets/action";
import { Collection } from "../../assets/collection";
import { Input } from "../../assets/input";
import { StackedView } from "../../assets/stacked-view";
import { Text } from "../../assets/text";
import { VIEWS_IDS } from "../../constants";
import { bindings } from "../schema";

const View2 = (
  <StackedView id={VIEWS_IDS.VIEW_2}>
    <StackedView.Header>
      <Text>View 1</Text>
    </StackedView.Header>
    <StackedView.Main>
      <Collection>
        <Collection.Values>
          <Input binding={bindings.phone}>
            <Input.Label>Phone</Input.Label>
          </Input>
          <Input binding={bindings.city}>
            <Input.Label>City</Input.Label>
          </Input>
        </Collection.Values>
      </Collection>
    </StackedView.Main>
    <StackedView.Footer>
      <Action value={VIEWS_IDS.VIEW_1}>
        <Action.Label>
          <Text>Previous</Text>
        </Action.Label>
      </Action>
    </StackedView.Footer>
  </StackedView>
);

export default View2;
