import React, { FunctionComponent, useState, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconButton, Popover, MenuList, MenuItem } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { getTodos, VisibilityFilter, setVisibilityFilter } from "./todo";

export const Menu: FunctionComponent<{ viewId: string }> = ({ viewId }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { views } = useSelector(getTodos);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const visibilityFilter = views[viewId].visibilityFilter;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeFilter = (visibilityFilter: VisibilityFilter) => () => {
    dispatch(setVisibilityFilter({ viewId, visibilityFilter }));
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="setting"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Popover
        id="menu"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <MenuList dense>
          {visibilityFilter !== VisibilityFilter.SHOW_ALL && (
            <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_ALL)}>
              Show all
            </MenuItem>
          )}
          {visibilityFilter !== VisibilityFilter.SHOW_ACTIVE && (
            <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_ACTIVE)}>
              Show active
            </MenuItem>
          )}
          {visibilityFilter !== VisibilityFilter.SHOW_COMPLETED && (
            <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_COMPLETED)}>
              Show completed
            </MenuItem>
          )}
          {visibilityFilter !== VisibilityFilter.SHOW_INVALID && (
            <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_INVALID)}>
              Show invalid
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </div>
  );
};

export default Menu;
