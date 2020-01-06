import React, { forwardRef, HTMLProps } from "react";

export type BaseListItemProps = HTMLProps<HTMLLIElement>;
export type BaseListItemPropsWithoutRef = Omit<BaseListItemProps, "ref">;

export default forwardRef<HTMLLIElement, BaseListItemPropsWithoutRef>(
  ({ children, ...other }, ref) => {
    return (
      <li ref={ref} {...other}>
        {children}
      </li>
    );
  }
);
