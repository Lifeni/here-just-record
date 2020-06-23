import { useState, useEffect, useContext } from "react"

import { SiteContext } from "../components/SiteContext"

import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Tooltip,
  Button,
  IconButton,
  CardActions,
  Divider,
  Chip,
  ListItemIcon,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import MarkdownIt from "markdown-it"
const MdParser = new MarkdownIt()
import moment from "moment"
import RefreshIcon from "@material-ui/icons/Refresh"
import TextsmsIcon from "@material-ui/icons/Textsms"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import DeleteIcon from "@material-ui/icons/Delete"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import Avatar from "@material-ui/core/Avatar"
import { green, pink } from "@material-ui/core/colors"
import ExtensionIcon from "@material-ui/icons/Extension"
import ImageIcon from "@material-ui/icons/Image"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import StarIcon from "@material-ui/icons/Star"
import ChatBubbleIcon from "@material-ui/icons/ChatBubble"
import ForumIcon from "@material-ui/icons/Forum"
import LabelIcon from "@material-ui/icons/Label"
import FavoriteIcon from "@material-ui/icons/Favorite"
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline"
import BookIcon from "@material-ui/icons/Book"
import StarsIcon from "@material-ui/icons/Stars"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import InfoIcon from "@material-ui/icons/Info"
import EditIcon from "@material-ui/icons/Edit"
moment.locale("zh-cn")

const useStyles = makeStyles(theme => ({
  root: {
    margin: `${theme.spacing(2)}px 0`,
  },
  card: {
    position: "relative",
    margin: `${theme.spacing(2)}px 0`,
    padding: theme.spacing(1),
  },
  headerBar: {
    width: "100%",
    margin: 0,
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonBar: {
    width: "100%",
    margin: 0,
    // padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagList: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
  },
  content: {
    padding: `${theme.spacing(3)}px`,
  },
  icon: {
    margin: `0 ${theme.spacing(2)}px`,
  },
  avatar: {
    color: "#fff",
    margin: `0 ${theme.spacing(0.5)}px`,
    backgroundColor: green[500],
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1200,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.5)",
  },
}))

let lock = 0

export default function PostList() {
  const classes = useStyles()
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [currentPost, setCurrentPost] = useState(null)

  // 0 default, 1 loading, 2 success, 3 failure
  const [change, setChange] = useState(0)
  const [messageOpen, setMessageOpen] = useState(0)
  // const [changeLock, setChangeLock] = useState(0)

  const changeLock = () => {
    if (lock === 0) {
      lock = 1
      // setChangeLock(1)
      return true
    } else {
      return false
    }
  }

  const handleMenuClick = event => {
    setMenuAnchor(event.currentTarget)
    setCurrentPost(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleMessageClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setMessageOpen(0)
  }

  const handleDelete = e => {
    setMenuAnchor(null)
    // console.log("del e", e)
    setChange(1)
    fetch("/api/post", {
      method: "DELETE",
      body: JSON.stringify({
        id: currentPost.dataset.id,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        // console.log("del d", data)
        // setChangeLock(0)
        if (data.code === 0) {
          setMessageOpen(1)
          setChange(2)
        } else {
          setMessageOpen(2)
          setChange(3)
        }
        setTimeout(() => {
          lock = 0
          setChange(0)
          setCurrentPost(null)
        }, 1000)
      })
  }

  return (
    <SiteContext.Consumer>
      {({ data, updatePost }) => (
        <Box className={classes.root}>
          {change === 2 && changeLock() ? updatePost() : ""}
          {data.posts.map(post => (
            <Card
              key={post.post.id}
              variant="outlined"
              className={classes.card}
              data-id={post.post.id}
            >
              <CardHeader
                className={classes.headerBar}
                avatar={
                  <Avatar className={classes.avatar}>
                    {post.text ? (
                      <BookIcon fontSize="small" />
                    ) : (
                      <ImageIcon fontSize="small" />
                    )}
                  </Avatar>
                }
                title={moment(Number(post.post.date)).fromNow()}
                subheader={moment(Number(post.post.date)).format(
                  "YYYY 年 M 月 D 日 dddd"
                )}
                action={
                  <IconButton
                    aria-label="settings"
                    onClick={handleMenuClick}
                    data-id={post.post.id}
                  >
                    <MoreVertIcon />
                  </IconButton>
                }
              ></CardHeader>

              <CardContent className={classes.content}>
                <Typography component="div" variant="body1">
                  <article
                    className="markdown-body"
                    dangerouslySetInnerHTML={{
                      __html: MdParser.render(
                        post.text ? post.text.content : "> 没有文字内容"
                      ),
                    }}
                  ></article>
                </Typography>
              </CardContent>
              <Box className={classes.buttonBar}>
                <CardActions className={classes.tagList}>
                  {post.post.tag === 0 ? (
                    ""
                  ) : (
                    <Chip color="primary" label="Tag Name"></Chip>
                  )}
                </CardActions>
                <CardActions>
                  <IconButton>
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton>
                    <TextsmsIcon />
                  </IconButton>
                </CardActions>
              </Box>
              <Backdrop
                className={classes.backdrop}
                data-id={post.post.id}
                open={change === 1 && currentPost.dataset.id === post.post.id}
              >
                {/*console.log(
                  "id",
                  currentPost,
                  menuAnchor,
                  currentPost.dataset.id,
                  post.post.id
                )*/}
                <CircularProgress color="inherit" />
              </Backdrop>
            </Card>
          ))}
          <Menu
            id="card-menu"
            anchorEl={menuAnchor}
            keepMounted
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">
                {currentPost ? currentPost.dataset.id : "ID"}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">编辑文章</Typography>
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">删除</Typography>
            </MenuItem>
          </Menu>
          <Snackbar
            open={messageOpen === 1}
            autoHideDuration={3000}
            onClose={handleMessageClose}
          >
            <Alert severity="success" variant="filled">
              <AlertTitle>
                <strong>删除成功</strong>
              </AlertTitle>
              你成功删除了一篇文章。
            </Alert>
          </Snackbar>
          <Snackbar
            open={messageOpen === 2}
            autoHideDuration={3000}
            onClose={handleMessageClose}
          >
            <Alert severity="error" variant="filled">
              <AlertTitle>
                <strong>删除失败</strong>
              </AlertTitle>
              请检查网络或者刷新页面重新登录。
            </Alert>
          </Snackbar>
        </Box>
      )}
    </SiteContext.Consumer>
  )
}
