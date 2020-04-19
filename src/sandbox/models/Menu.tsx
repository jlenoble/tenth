import React, { FunctionComponent, useState, MouseEvent } from "react";
import { useDispatch } from "react-redux";
import { IconButton, Popover, MenuList, MenuItem } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { VisibilityFilter, setVisibilityFilter } from "./visibility";

export const Menu: FunctionComponent = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeFilter = (filter: VisibilityFilter) => () => {
    dispatch(setVisibilityFilter(filter));
    handleClose();
  };

  return (
    <div>
      <IconButton
        aria-label="setting"
        aria-controls="check-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Popover
        id="check-menu"
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
          <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_ALL)}>
            Show all
          </MenuItem>
          <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_ACTIVE)}>
            Show active
          </MenuItem>
          <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_COMPLETED)}>
            Show completed
          </MenuItem>
          <MenuItem onClick={changeFilter(VisibilityFilter.SHOW_INVALID)}>
            Show invalid
          </MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
};

export default Menu;
