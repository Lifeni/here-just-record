import { Avatar, IconButton, ListItemAvatar } from "@material-ui/core"
import Box from "@material-ui/core/Box"
import Collapse from "@material-ui/core/Collapse"
import { blue } from "@material-ui/core/colors"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Snackbar from "@material-ui/core/Snackbar"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Tooltip from "@material-ui/core/Tooltip"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import AllInboxIcon from "@material-ui/icons/AllInbox"
import AssessmentIcon from "@material-ui/icons/Assessment"
import CategoryIcon from "@material-ui/icons/Category"
import CloseIcon from "@material-ui/icons/Close"
import DeleteIcon from "@material-ui/icons/Delete"
import DoneIcon from "@material-ui/icons/Done"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import FavoriteIcon from "@material-ui/icons/Favorite"
import LabelTwoToneIcon from "@material-ui/icons/LabelTwoTone"
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import Link from "next/link"
import { useState } from "react"
import { SiteContext } from "./SiteContext"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
  },
  list: {
    borderRadius: "4px",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    margin: `0 0 ${theme.spacing(2)}px 0`,
    padding: theme.spacing(1.5),
  },
  nested: {
    paddingLeft: theme.spacing(1.5),
  },
  dialogNested: {
    paddingLeft: theme.spacing(2.5),
  },
  dialog: {
    padding: theme.spacing(1),
  },
  dialogList: {
    padding: theme.spacing(1),
  },
  avatar: {
    width: "32px",
    height: "32px",
    backgroundColor: blue[100],
    color: blue[600],
  },
  listItem: {
    borderRadius: "4px",
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

export default function NavBar() {
  const classes = useStyles()
  const [openList, setOpenList] = useState(true)
  const [tagNameValue, setTagNameValue] = useState(null)
  const [tagDescriptionValue, setTagDescriptionValue] = useState(null)

  const changeLock = () => {
    if (lock === 0) {
      lock = 1
      return true
    } else {
      return false
    }
  }

  const handleOpenListClick = () => {
    setOpenList(!openList)
  }

  const [addMessageOpen, setAddMessageOpen] = useState(0)
  const [removeMessageOpen, setRemoveMessageOpen] = useState(0)
  const [openAddTag, setOpenAddTag] = useState(false)
  const [openRemoveTag, setOpenRemoveTag] = useState(false)

  // 0 default, 1 loading, 2 success, 3 failure
  const [tagChange, setTagChange] = useState(0)
  const [inputError, setInputError] = useState(null)

  const handleAddTagClick = () => {
    setOpenAddTag(true)
  }

  const handleAddTagClose = () => {
    setInputError(null)
    setOpenAddTag(false)
  }

  const handleAddTag = () => {
    setTagChange(1)
    console.log(tagNameValue, tagDescriptionValue)
    if (!tagNameValue) {
      setInputError("输入内容不能为空")
    } else {
      fetch("/api/tag", {
        method: "POST",
        body: JSON.stringify({
          name: tagNameValue,
          description: tagDescriptionValue,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 0) {
            setAddMessageOpen(1)
            setTagChange(2)
          } else {
            setAddMessageOpen(2)
            setTagChange(3)
          }
          setTimeout(() => {
            lock = 0
            setTagChange(0)
          }, 200)
          setOpenAddTag(false)
        })
    }
  }

  const handleAddMessageClose = () => {
    setAddMessageOpen(0)
  }

  const handleRemoveTagClick = () => {
    setOpenRemoveTag(true)
  }

  const handleRemoveTagClose = () => {
    setOpenRemoveTag(false)
  }

  const handleRemoveTag = e => {
    setTagChange(1)
    console.log(e.currentTarget.dataset.tag)
    setTagNameValue(JSON.parse(e.currentTarget.dataset.tag).name)
    setTagDescriptionValue(JSON.parse(e.currentTarget.dataset.tag).description)
    fetch("/api/tag", {
      method: "DELETE",
      body: JSON.stringify({
        id: JSON.parse(e.currentTarget.dataset.tag).id,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 0) {
          setTagChange(2)
          setRemoveMessageOpen(1)
        } else {
          setTagChange(3)
          setRemoveMessageOpen(2)
        }
        setTimeout(() => {
          lock = 0
          setTagChange(0)
        }, 200)
      })
  }

  const handleRemoveMessageClose = () => {
    setRemoveMessageOpen(0)
  }

  return (
    <SiteContext.Consumer>
      {({ data, updateTag }) => (
        <Box className={classes.root}>
          {tagChange === 2 && changeLock() ? updateTag() : null}
          <List component="nav" className={classes.list}>
            <Link href="/" shallow>
              <ListItem button className={classes.listItem}>
                <ListItemIcon>
                  <AllInboxIcon />
                </ListItemIcon>
                <ListItemText primary="全部" />
              </ListItem>
            </Link>

            <Link href="/like">
              <ListItem button className={classes.listItem}>
                <ListItemIcon>
                  <FavoriteIcon />
                </ListItemIcon>
                <ListItemText primary="喜欢" />
              </ListItem>
            </Link>

            <Link href="/overview">
              <ListItem button className={classes.listItem}>
                <ListItemIcon>
                  <AssessmentIcon />
                </ListItemIcon>
                <ListItemText primary="概览" />
              </ListItem>
            </Link>

            <ListItem
              button
              onClick={handleOpenListClick}
              className={classes.listItem}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="标签分类" />
              {openList ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {data.tags
                  ? data.tags.map(tag => (
                      <Link
                        href={`/tag/[id]`}
                        as={`/tag/${tag.id}`}
                        key={tag.id}
                      >
                        <ListItem
                          button
                          className={`${classes.nested} ${classes.listItem}`}
                        >
                          <ListItemAvatar>
                            <Avatar className={classes.avatar}>
                              <LabelTwoToneIcon fontSize="small" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={tag.name}
                            secondary={tag.description}
                          />
                        </ListItem>
                      </Link>
                    ))
                  : []}
              </List>
            </Collapse>
            <ListItem
              button
              onClick={handleAddTagClick}
              className={classes.listItem}
            >
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="新增标签" />
            </ListItem>
            <ListItem
              button
              onClick={handleRemoveTagClick}
              className={classes.listItem}
            >
              <ListItemIcon>
                <RemoveCircleIcon />
              </ListItemIcon>
              <ListItemText primary="删除标签" />
            </ListItem>
          </List>
          <Dialog
            open={openAddTag}
            onClose={handleAddTagClose}
            aria-labelledby="add-tag-title"
            maxWidth={false}
            className={classes.dialog}
          >
            <DialogTitle id="add-tag-title">新增标签</DialogTitle>
            <DialogContent>
              <DialogContentText>添加一个新的标签。</DialogContentText>
              <TextField
                variant="outlined"
                margin="normal"
                id="name"
                label="Tag Name"
                type="text"
                fullWidth
                required
                size="medium"
                helperText={
                  Boolean(inputError) ? inputError : "标签名字可以重复"
                }
                autoFocus
                onChange={e => {
                  setInputError(null)
                  setTagNameValue(e.currentTarget.value)
                }}
                error={Boolean(inputError)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                id="description"
                label="Tag Description"
                type="text"
                fullWidth
                helperText="标签描述可以不填"
                onChange={e => {
                  setTagDescriptionValue(e.currentTarget.value)
                }}
              />
            </DialogContent>
            <DialogActions>
              <BootstrapTooltip
                title="取消"
                aria-label="取消"
                placement="top"
                arrow
              >
                <IconButton
                  color="primary"
                  onClick={handleAddTagClose}
                  aria-label="取消"
                >
                  <CloseIcon />
                </IconButton>
              </BootstrapTooltip>
              <BootstrapTooltip
                title="确定"
                aria-label="确定"
                placement="top"
                arrow
              >
                <IconButton
                  color="primary"
                  onClick={handleAddTag}
                  aria-label="确定"
                >
                  <DoneIcon />
                </IconButton>
              </BootstrapTooltip>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openRemoveTag}
            onClose={handleRemoveTagClose}
            aria-labelledby="add-tag-title"
            maxWidth={false}
            scroll="paper"
          >
            <DialogTitle id="add-tag-title">删除标签</DialogTitle>
            <List className={classes.dialogList}>
              {data.tags
                ? data.tags.map(tag => (
                    <ListItem
                      button
                      key={tag.id}
                      className={`${classes.dialogNested} ${classes.listItem}`}
                    >
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <LabelTwoToneIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={tag.name}
                        secondary={tag.description}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          data-tag={JSON.stringify(tag)}
                          onClick={handleRemoveTag}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                : []}
            </List>
          </Dialog>
          <Snackbar
            open={addMessageOpen === 1}
            autoHideDuration={3000}
            onClose={handleAddMessageClose}
          >
            <Alert severity="success" variant="filled">
              <AlertTitle>
                <strong>添加成功</strong>
              </AlertTitle>
              标签 {tagNameValue} 已经添加。
            </Alert>
          </Snackbar>
          <Snackbar
            open={addMessageOpen === 2}
            autoHideDuration={3000}
            onClose={handleAddMessageClose}
          >
            <Alert severity="error" variant="filled">
              <AlertTitle>
                <strong>添加失败</strong>
              </AlertTitle>
              请检查网络或者刷新页面重新登录。
            </Alert>
          </Snackbar>
          <Snackbar
            open={removeMessageOpen === 1}
            autoHideDuration={3000}
            onClose={handleRemoveMessageClose}
          >
            <Alert severity="success" variant="filled">
              <AlertTitle>
                <strong>删除成功</strong>
              </AlertTitle>
              标签 {tagNameValue} 已经删除。
            </Alert>
          </Snackbar>
          <Snackbar
            open={removeMessageOpen === 2}
            autoHideDuration={3000}
            onClose={handleRemoveMessageClose}
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
