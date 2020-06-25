import { makeStyles } from "@material-ui/core/styles"
import PostAddIcon from "@material-ui/icons/PostAdd"
import SpeedDial from "@material-ui/lab/SpeedDial"
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon"
import React from "react"

const useStyles = makeStyles(theme => ({
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
}))

export default function FloatButton() {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleClick = () => {
    document.querySelector("html").style.scrollBehavior = "smooth"
    document.querySelector("body").style.scrollBehavior = "smooth"
    document.querySelector("textarea").focus()
  }

  return (
    <SpeedDial
      ariaLabel="浮动按钮"
      className={classes.speedDial}
      hidden={false}
      icon={<SpeedDialIcon openIcon={<PostAddIcon />} />}
      onClose={handleClose}
      onOpen={handleOpen}
      onClick={handleClick}
      open={open}
      data-action="Edit"
    ></SpeedDial>
  )
}
