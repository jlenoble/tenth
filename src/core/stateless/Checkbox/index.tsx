import React from "react";
import BaseCheckbox from "@material-ui/core/Checkbox";
import { StatelessSelect } from "../../stateful";

export const Checkbox: StatelessSelect = ({ selected, toggle }) => (
  <BaseCheckbox onClick={toggle} checked={selected} />
);
