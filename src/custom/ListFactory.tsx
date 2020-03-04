import { FunctionComponent } from "react";
import { ListProps, withItems } from "../core";
import { withDefaultProps } from "../generics";

export const makeListComponent = <P extends ListProps, DP extends Partial<P>>(
  List: FunctionComponent<P>,
  defaultProps: DP,
  prefix: string = ""
) => {
  const WrappedComponent = withDefaultProps(defaultProps, List);
  WrappedComponent.displayName =
    prefix + (List.displayName || List.name || "List");
  return WrappedComponent;
};

export const makeStatefulListComponent = <
  P extends ListProps,
  DP extends Partial<P>
>(
  List: FunctionComponent<P>,
  defaultProps: DP,
  prefix: string = ""
) => {
  const WrappedComponent = withDefaultProps(defaultProps, withItems(List));
  WrappedComponent.displayName =
    "Stateful" + prefix + (List.displayName || List.name || "List");
  return WrappedComponent;
};

export const makeListComponents = <P extends ListProps, DP extends Partial<P>>(
  List: FunctionComponent<P>,
  defaultProps: DP,
  prefix: string = ""
) => ({
  PureList: makeListComponent(List, defaultProps, prefix),
  StatefulList: makeStatefulListComponent(List, defaultProps, prefix)
});
