import { FunctionComponent } from "react";
import { ListProps, withItems } from "../core";
import { withDefaultProps } from "../generics";

export const makeListComponent = <P extends ListProps, DP extends Partial<P>>(
  List: FunctionComponent<P>,
  defaultProps: DP
) => withDefaultProps(defaultProps, List);

export const makeStatefulListComponent = <
  P extends ListProps,
  DP extends Partial<P>
>(
  List: FunctionComponent<P>,
  defaultProps: DP
) => withDefaultProps(defaultProps, withItems(List));

export const makeListComponents = <P extends ListProps, DP extends Partial<P>>(
  List: FunctionComponent<P>,
  defaultProps: DP
) => ({
  PureList: makeListComponent(List, defaultProps),
  StatefulList: makeStatefulListComponent(List, defaultProps)
});
