import React, { FunctionComponent } from "react";
import { useEditValue } from "./useEditValue";

export type StatelessInlineEditProps = ReturnType<typeof useEditValue>;
export type StatelessInlineEdit = FunctionComponent<StatelessInlineEditProps>;

export interface StatefulInlineEditProps {
  initialValue: string;
  update: (value: string) => void;
  InlineEdit: StatelessInlineEdit;
}

export type StatefulInlineEdit = FunctionComponent<StatefulInlineEditProps>;

export const StatefulInlineEdit: StatefulInlineEdit = ({
  initialValue,
  update,
  InlineEdit,
}) => <InlineEdit {...useEditValue(initialValue, update)} />;
