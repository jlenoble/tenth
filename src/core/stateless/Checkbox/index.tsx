import React from "react";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { StatelessOnOff, withOnOff } from "../../stateful/OnOff";

export const StatelessCheckbox: StatelessOnOff<CheckboxProps> = ({
  state,
  on,
  off,
  toggle,
  ...componentProps
}) => <Checkbox onClick={toggle} checked={state} {...componentProps} />;

export const StatefulCheckbox = withOnOff(StatelessCheckbox);

export default StatelessCheckbox;
