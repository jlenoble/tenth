import React, { FunctionComponent } from "react";
import {
  Card,
  Checkbox,
  CardHeader,
  CardContent,
  IconButton,
  Popover,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Theme
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/styles";
import { MoreVert } from "@material-ui/icons";
import { useToggle } from "../list";

type ListUIKeys = "add" | "edit" | "remove" | "select";

type ListUIInitialValues = Partial<Record<ListUIKeys, boolean>>;
type ListUICallbacks = Partial<Record<ListUIKeys, (value: boolean) => void>>;

export const useListUI = (
  {
    add: addValue,
    edit: editValue,
    remove: removeValue,
    select: selectValue
  }: ListUIInitialValues = {},
  {
    add: addCallback,
    edit: editCallback,
    remove: removeCallback,
    select: selectCallback
  }: ListUICallbacks = {}
) => ({
  add: useToggle(addValue, addCallback),
  edit: useToggle(editValue, editCallback),
  remove: useToggle(removeValue, removeCallback),
  select: useToggle(selectValue, selectCallback)
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    formControl: {
      margin: theme.spacing(1)
    }
  })
);

// function CheckMenu(props: ReturnType<typeof useListUI>) {
//   const classes = useStyles();

//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const { add, check, delete: deleteProps, edit } = props;

//   return (
//     <div>
//       <IconButton
//         aria-label="setting"
//         aria-controls="check-menu"
//         aria-haspopup="true"
//         onClick={handleClick}
//       >
//         <MoreVert />
//       </IconButton>
//       <Popover
//         id="list-ui"
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "center"
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "center"
//         }}
//       >
//         <FormControl component="fieldset" className={classes.formControl}>
//           <FormLabel component="legend">List UI elements</FormLabel>
//           <FormGroup>
//             <FormControlLabel
//               control={
//                 <Checkbox checked={add.state} onClick={add.toggle} name="add" />
//               }
//               label="Text input"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={check.state}
//                   onClick={check.toggle}
//                   name="check"
//                 />
//               }
//               label="Checkbox"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={deleteProps.state}
//                   onClick={deleteProps.toggle}
//                   name="delete"
//                 />
//               }
//               label="Delete button"
//             />
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={edit.state}
//                   onClick={edit.toggle}
//                   name="edit"
//                 />
//               }
//               label="Inline edit"
//             />
//           </FormGroup>
//         </FormControl>
//       </Popover>
//     </div>
//   );
// }

// export const ListCard: FunctionComponent<ListProps> = ({ ui, ...other }) => {
//   const props = useListUI({
//     add: ui?.addItem,
//     select: ui?.checkbox,
//     remove: ui?.deleteButton,
//     edit: ui?.editableText
//   });

//   ui = {
//     addItem: props.add.state,
//     checkbox: props.check.state,
//     deleteButton: props.delete.state,
//     editableText: props.edit.state
//   };

//   return (
//     <Card>
//       <CardHeader action={<CheckMenu {...props} />} title="TODO List" />
//       <CardContent>
//         <StatefulDnDList ui={ui} {...other} />
//       </CardContent>
//     </Card>
//   );
// };
