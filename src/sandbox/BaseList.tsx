import React, { forwardRef, HTMLProps } from "react";

export type BaseListProps = HTMLProps<HTMLUListElement>;
export type BaseListPropsWithoutRef = Omit<BaseListProps, "ref">;

export default forwardRef<HTMLUListElement, BaseListPropsWithoutRef>(
  ({ children, ...other }, ref) => {
    return (
      <ul ref={ref} {...other}>
        {children}
      </ul>
    );
  }
);
