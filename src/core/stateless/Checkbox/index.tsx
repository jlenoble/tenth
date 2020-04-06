import React from "react";
import Checkbox, { CheckboxProps } from "@material-ui/core/Checkbox";
import { StatelessOnOff } from "../../stateful/OnOff";

export const StatelessCheckbox: StatelessOnOff<CheckboxProps> = ({
  state,
  toggle,
  componentProps
}) => <Checkbox onClick={toggle} checked={state} {...componentProps} />;

export default StatelessCheckbox;
