import { IconButtonProps as BaseIconButtonProps } from "@material-ui/core/IconButton";

export interface IconButtonItem {
  id: string;
}

export interface IconButtonItemHooks {
  removeItem?: (id: string) => void;
}

export interface IconButtonProps extends BaseIconButtonProps {
  item: IconButtonItem;
  itemHooks: IconButtonItemHooks;
}

export { default as IconButton } from "@material-ui/core/IconButton";
