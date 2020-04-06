import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import { StatelessOnOff } from "../../stateful/OnOff";

export const StatelessCheckbox: StatelessOnOff = ({ state, toggle }) => (
  <Checkbox onClick={toggle} checked={state} />
);

export default StatelessCheckbox;
