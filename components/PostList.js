import {
  Backdrop,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Snackbar,
  Tooltip,
  Typography,
} from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import { green } from "@material-ui/core/colors"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles } from "@material-ui/core/styles"
import BookIcon from "@material-ui/icons/Book"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import FavoriteIcon from "@material-ui/icons/Favorite"
import ImageIcon from "@material-ui/icons/Image"
import InfoIcon from "@material-ui/icons/Info"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import TextsmsIcon from "@material-ui/icons/Textsms"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import MarkdownIt from "markdown-it"
import moment from "moment"
import { useState } from "react"
import { SiteContext } from "../components/SiteContext"
import ModifyPost from "./ModifyPost"
import PostScript from "./PostScript"

const MdParser = new MarkdownIt()
moment.locale("zh-cn")

const useStyles = makeStyles(theme => ({
  root: {
    margin: `${theme.spacing(2)}px 0`,
  },
  card: {
    position: "relative",
    margin: `${theme.spacing(2)}px 0`,
    padding: theme.spacing(1),
    paddingBottom: 0,
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
    marginBottom: theme.spacing(1),
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
  media: {
    width: `calc(100% + ${theme.spacing(2)}px)`,
    margin: `${theme.spacing(3)}px -${theme.spacing(1)}px`,
  },
  postscript: {
    width: `calc(100% + ${theme.spacing(2)}px)`,
    margin: `0 -${theme.spacing(1)}px 0 -${theme.spacing(1)}px`,
    padding: `${theme.spacing(3)}px ${theme.spacing(4)}px ${theme.spacing(
      3
    )}px ${theme.spacing(4)}px`,
    borderTop: "1px solid rgba(0, 0, 0, 0.12)",
    backgroundColor: "#f5f5f5",
  },
  postscriptContent: {
    padding: `${theme.spacing(1)}px 0 0 0`,
  },
}))

const useStylesBootstrap = makeStyles(theme => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    fontSize: "14px",
    backgroundColor: theme.palette.common.black,
  },
}))

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap()

  return <Tooltip arrow classes={classes} {...props} />
}

let lock = 0

export default function PostList() {
  const classes = useStyles()
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [currentPost, setCurrentPost] = useState(null)

  // 0 default, 1 loading, 2 success, 3 failure
  const [change, setChange] = useState(0)
  const [messageOpen, setMessageOpen] = useState(0)

  const [openPostScript, setOpenPostScript] = useState(false)
  const [openModifyPost, setOpenModifyPost] = useState(false)

  const handlePostScriptClick = event => {
    setOpenPostScript(true)
    setCurrentPost(event.currentTarget)
  }

  const handlePostScriptClose = () => {
    setOpenPostScript(false)
    setCurrentPost(null)
  }

  const changeLock = () => {
    if (lock === 0) {
      lock = 1
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

  const handleMessageClose = () => {
    setMessageOpen(0)
  }

  const handleDelete = () => {
    setMenuAnchor(null)
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
        }, 400)
      })
  }

  const handleModifyPostClick = () => {
    setOpenModifyPost(true)
  }

  const handleModifyPostClose = () => {
    setOpenModifyPost(false)
  }

  const handleToggleLike = e => {
    console.log(e.currentTarget.dataset.like)
    const target = e.currentTarget
    if (e.currentTarget.dataset.like === "0") {
      fetch("/api/like", {
        method: "PUT",
        body: JSON.stringify({
          id: e.currentTarget.dataset.id,
          like: 1,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 0) {
            target.dataset.like = "1"
          }
        })
    } else {
      fetch("/api/like", {
        method: "PUT",
        body: JSON.stringify({
          id: e.currentTarget.dataset.id,
          like: 0,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 0) {
            target.dataset.like = "0"
          }
        })
    }
  }

  return (
    <SiteContext.Consumer>
      {({ data, updatePost }) => (
        <Box className={classes.root}>
          {change === 2 && changeLock() ? updatePost() : null}
          {data.posts
            ? data.posts.map(post => (
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
                      <BootstrapTooltip
                        title="更多选项"
                        aria-label="更多选项"
                        placement="top"
                        arrow
                      >
                        <IconButton
                          aria-label="settings"
                          onClick={handleMenuClick}
                          data-id={post.post.id}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </BootstrapTooltip>
                    }
                  ></CardHeader>

                  {post.file ? (
                    <CardMedia
                      component="img"
                      alt="用户上传的图像"
                      title="用户上传的图像"
                      image={post.file.url}
                      className={classes.media}
                    ></CardMedia>
                  ) : null}

                  {post.text ? (
                    <CardContent className={classes.content}>
                      <Typography component="div" variant="body1">
                        <article
                          className="markdown-body"
                          dangerouslySetInnerHTML={{
                            __html: MdParser.render(post.text.content),
                          }}
                        ></article>
                      </Typography>
                    </CardContent>
                  ) : null}

                  <Box className={classes.buttonBar}>
                    <CardActions className={classes.tagList}>
                      {post.post.tag === 0 || !post.tag ? null : (
                        <BootstrapTooltip
                          title={post.tag.description}
                          aria-label={post.tag.description}
                          placement="top"
                          arrow
                        >
                          <Chip
                            color="primary"
                            variant="default"
                            label={post.tag.name}
                            style={{ margin: "8px 4px" }}
                          ></Chip>
                        </BootstrapTooltip>
                      )}
                    </CardActions>

                    <CardActions>
                      <BootstrapTooltip
                        title="喜欢"
                        aria-label="喜欢"
                        placement="top"
                        arrow
                      >
                        <IconButton
                          onClick={handleToggleLike}
                          data-like={
                            post.post.like ? post.post.like.toString() : "0"
                          }
                          data-id={post.post.id}
                          className={classes.like}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      </BootstrapTooltip>
                      <BootstrapTooltip
                        title="添加附言"
                        aria-label="添加附言"
                        placement="top"
                        arrow
                      >
                        <IconButton
                          onClick={handlePostScriptClick}
                          data-id={post.post.id}
                        >
                          <TextsmsIcon />
                        </IconButton>
                      </BootstrapTooltip>
                    </CardActions>
                  </Box>
                  {post.postscripts
                    ? post.postscripts.map(postscript => (
                        <CardContent
                          className={classes.postscript}
                          key={postscript.id}
                        >
                          <Typography
                            component="div"
                            variant="body2"
                            color="textSecondary"
                          >
                            {moment(Number(postscript.date)).fromNow()}
                          </Typography>
                          <Typography
                            component="div"
                            variant="body1"
                            className={classes.postscriptContent}
                          >
                            {postscript.content}
                          </Typography>
                        </CardContent>
                      ))
                    : null}
                  <Backdrop
                    className={classes.backdrop}
                    data-id={post.post.id}
                    open={
                      change === 1 && currentPost.dataset.id === post.post.id
                    }
                  >
                    <CircularProgress color="inherit" />
                  </Backdrop>
                </Card>
              ))
            : []}
          <PostScript
            open={openPostScript}
            close={handlePostScriptClose}
            id={currentPost ? currentPost.dataset.id : null}
            updatePost={updatePost}
          ></PostScript>
          <ModifyPost
            open={openModifyPost}
            close={handleModifyPostClose}
            id={currentPost ? currentPost.dataset.id : null}
            content={
              currentPost
                ? data.posts.find(post => {
                    return post.post.id === Number(currentPost.dataset.id)
                  })
                : null
            }
            updatePost={updatePost}
          ></ModifyPost>
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
                {currentPost ? `ID: ${currentPost.dataset.id}` : "ID"}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleModifyPostClick}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">编辑</Typography>
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
