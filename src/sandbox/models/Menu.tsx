import React, { useState, MouseEvent } from "react";
import {
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  ListItemText
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

export default function CheckMenu({}: {}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <MenuItem onClick={handleClose}>Show all</MenuItem>
          <MenuItem onClick={handleClose}>Show remaining</MenuItem>
          <MenuItem onClick={handleClose}>Show completed</MenuItem>
          <MenuItem onClick={handleClose}>Show invalid</MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
}
