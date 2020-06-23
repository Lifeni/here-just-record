import { makeStyles } from "@material-ui/core/styles"
import { useState, useEffect, useContext } from "react"
import AppBar from "@material-ui/core/AppBar"
import IconButton from "@material-ui/core/IconButton"
import MenuIcon from "@material-ui/icons/Menu"
import MoreIcon from "@material-ui/icons/MoreVert"
import SearchIcon from "@material-ui/icons/Search"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { SiteContext } from "../components/SiteContext"
import { Box, Avatar, ListItemIcon } from "@material-ui/core"
import ExitToAppIcon from "@material-ui/icons/ExitToApp"
import moment from "moment"

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
    lineHeight: "2.5rem",
  },
  subtitle: {
    lineHeight: "2rem",
  },
  titlebar: {
    width: "100%",
    height: "100%",
    minHeight: "160px",
    paddingLeft: "208px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  timebar: {
    height: "100%",
    minHeight: "160px",
    paddingLeft: "208px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-end",
  },
  avatar: {
    position: "absolute",
    left: "60px",
    bottom: "-40px",
    width: "180px",
    height: "180px",
    boxShadow: "0 14px 28px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.08)",
  },
}))

export default function TopBar() {
  const classes = useStyles()
  const [timeMessage, setTimeMessage] = useState("你好")
  const siteData = useContext(SiteContext)
  // console.log("top", siteData)
  const [menuAnchor, setMenuAnchor] = useState(null)

  const handleMenuClick = event => {
    setMenuAnchor(event.currentTarget)
  }

  const handleSignOutClick = event => {
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

  const now = new Date().getHours()
  useEffect(() => {
    // console.log("now", now)

    if (now >= 4 && now < 8) {
      setTimeMessage("早上好")
    } else if (now >= 8 && now < 12) {
      setTimeMessage("上午好")
    } else if (now >= 12 && now < 14) {
      setTimeMessage("中午好")
    } else if (now >= 14 && now < 18) {
      setTimeMessage("下午好")
    } else if (now >= 18 || now < 4) {
      setTimeMessage("晚上好")
    }
  }, [now])

  return (
    <AppBar position="static" className={classes.root} elevation={0}>
      <Avatar
        className={classes.avatar}
        src={siteData.data.config.profile.avatar}
      ></Avatar>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="open drawer"
        >
          <MenuIcon />
        </IconButton>
        <Box className={classes.titlebar}>
          <Typography className={classes.title} variant="h5" noWrap>
            {timeMessage}，{siteData.data.config.profile.name}
          </Typography>
          <Typography className={classes.subtitle} variant="subtitle1" noWrap>
            截止到今天，你一共写了 {siteData.data.posts.length} 篇文章
          </Typography>
        </Box>
        <Box className={classes.timebar}>
          <Typography className={classes.subtitle} variant="subtitle1" noWrap>
            当前为开发版本
          </Typography>
          <Typography className={classes.subtitle} variant="subtitle1" noWrap>
            {moment().format("YYYY 年 M 月 D 日 dddd")}
          </Typography>
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
