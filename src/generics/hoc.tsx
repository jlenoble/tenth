import React, { FunctionComponent, PropsWithChildren } from "react";

export const withDefaultProps = <P extends object, DP extends Partial<P>>(
  defaultProps: DP,
  Component: FunctionComponent<P>
) => {
  type RequiredProps = Omit<P, keyof DP>;
  type Props = Partial<DP> & RequiredProps;

  const WrappedComponent: FunctionComponent<Props> = props => {
    // Wrongly typing props as PropsWithChildren<P> to get rid of error TS2322
    return <Component {...defaultProps} {...(props as PropsWithChildren<P>)} />;
  };

  return WrappedComponent;
};
