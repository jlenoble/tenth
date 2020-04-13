import { CardHeader, CardHeaderProps } from "@material-ui/core";

export type BaseCardHeaderProps = CardHeaderProps;
export type BaseCardHeaderPropsWithoutRef = Omit<BaseCardHeaderProps, "ref">;

export const BaseCardHeader = CardHeader;
