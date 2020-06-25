import AppBar from "@material-ui/core/AppBar"
import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles } from "@material-ui/core/styles"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import MoreIcon from "@material-ui/icons/MoreVert"
import SearchIcon from "@material-ui/icons/Search"
import Link from "next/link"
import { useState } from "react"

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: "relative",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 160,
    alignItems: "flex-start",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(4),
  },
  title: {
    lineHeight: "4rem",
  },
  subtitle: {
    lineHeight: "2.5rem",
  },
  description: {
    lineHeight: "2rem",
    fontSize: "1.25rem",
  },
  titleBar: {
    width: "100%",
    height: "100%",
    minHeight: "160px",
    paddingTop: "32px",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  titleBarLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
}))

export default function TopBarSimple({ title, description, length }) {
  const classes = useStyles()
  const [menuAnchor, setMenuAnchor] = useState(null)

  const handleMenuClick = event => {
    setMenuAnchor(event.currentTarget)
  }

  const handleSignOutClick = () => {
    fetch("/api/signout")
      .then(response => response.json())
      .then(data => {
        console.log("signout", data)

        if (data.code === 0) {
          window.location.reload()
        }
      })
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  return (
    <AppBar position="static" className={classes.root} elevation={0}>
      <Toolbar className={classes.toolbar}>
        <Link href="/" shallow>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="返回主页"
          >
            <ArrowBackIcon />
          </IconButton>
        </Link>

        <Box className={classes.titleBar}>
          <Box className={classes.titleBarLeft}>
            <Typography className={classes.title} variant="h4" noWrap>
              {title}
            </Typography>
            {description ? (
              <Typography
                className={classes.description}
                variant="subtitle1"
                noWrap
              >
                {description}
              </Typography>
            ) : null}
          </Box>
          {length ? (
            <Typography className={classes.subtitle} variant="h5" noWrap>
              一共有 {length} 篇
            </Typography>
          ) : null}
        </Box>
        <IconButton aria-label="search" color="inherit">
          <SearchIcon />
        </IconButton>
        <IconButton
          aria-label="display more actions"
          edge="end"
          color="inherit"
          onClick={handleMenuClick}
        >
          <MoreIcon />
        </IconButton>
      </Toolbar>
      <Menu
        id="topbar-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleSignOutClick}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">退出登录</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  )
}
