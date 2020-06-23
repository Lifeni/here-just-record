import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import SpeedDial from "@material-ui/lab/SpeedDial"
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon"
import SpeedDialAction from "@material-ui/lab/SpeedDialAction"
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined"
import SaveIcon from "@material-ui/icons/Save"
import PrintIcon from "@material-ui/icons/Print"
import ShareIcon from "@material-ui/icons/Share"
import FavoriteIcon from "@material-ui/icons/Favorite"
import EditIcon from "@material-ui/icons/Edit"
import LabelIcon from "@material-ui/icons/Label"
import PostAddIcon from "@material-ui/icons/PostAdd"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import ImageIcon from "@material-ui/icons/Image"

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
}))

// const actions = [
//   { icon: <LabelIcon />, name: "Tag" },
//   { icon: <InsertDriveFileIcon />, name: "File" },
// ]

export default function FloatButton() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)

  const handleVisibility = () => {
    setHidden(prevHidden => !prevHidden)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClick = e => {
    document.querySelector("html").style.scrollBehavior = "smooth"
    document.querySelector("body").style.scrollBehavior = "smooth"
    window.scrollTo(0, 0)
    document.querySelector("textarea").focus()
  }

  return (
    <SpeedDial
      ariaLabel="浮动按钮"
      className={classes.speedDial}
      hidden={hidden}
      icon={<SpeedDialIcon openIcon={<PostAddIcon />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      onClick={handleClick}
      open={open}
      data-action="Edit"
    >
      {/* {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          data-action={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          // onClick={handleClick}
        />
      ))} */}
    </SpeedDial>
  )
}
