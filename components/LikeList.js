import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  IconButton,
  ListItemIcon,
  Tooltip,
  Typography,
} from "@material-ui/core"
import Avatar from "@material-ui/core/Avatar"
import { green } from "@material-ui/core/colors"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import { makeStyles } from "@material-ui/core/styles"
import BookIcon from "@material-ui/icons/Book"
import ImageIcon from "@material-ui/icons/Image"
import InfoIcon from "@material-ui/icons/Info"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import MarkdownIt from "markdown-it"
import moment from "moment"
import { useState } from "react"

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

export default function LikeList({ data }) {
  const classes = useStyles()
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [currentPost, setCurrentPost] = useState(null)

  const handleMenuClick = event => {
    setMenuAnchor(event.currentTarget)
    setCurrentPost(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  return (
    <Box className={classes.root}>
      {data
        ? data.map(post => (
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
            </Card>
          ))
        : []}
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
      </Menu>
    </Box>
  )
}
