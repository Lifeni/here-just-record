import { IconButton } from "@material-ui/core"
import { SiteContext } from "../components/SiteContext"
import { makeStyles } from "@material-ui/core/styles"
import { useRef, useState } from "react"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import AllInboxIcon from "@material-ui/icons/AllInbox"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import CategoryIcon from "@material-ui/icons/Category"
import CloseIcon from "@material-ui/icons/Close"
import Collapse from "@material-ui/core/Collapse"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import DoneIcon from "@material-ui/icons/Done"
import DraftsIcon from "@material-ui/icons/Drafts"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import ExploreIcon from "@material-ui/icons/Explore"
import FavoriteIcon from "@material-ui/icons/Favorite"
import InboxIcon from "@material-ui/icons/MoveToInbox"
import LabelOutlinedIcon from "@material-ui/icons/LabelOutlined"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import ListSubheader from "@material-ui/core/ListSubheader"
import SendIcon from "@material-ui/icons/Send"
import Snackbar from "@material-ui/core/Snackbar"
import StarBorder from "@material-ui/icons/StarBorder"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"

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
    paddingLeft: theme.spacing(4),
  },
  dialog: {
    padding: theme.spacing(1),
  },
}))

let lock = 0

export default function NestedList() {
  const classes = useStyles()
  const [openList, setOpenList] = useState(true)
  const [tagNameValue, setTagNameValue] = useState(null)
  const [tagDescriptionValue, setTagDescriptionValue] = useState(null)

  const changeLock = () => {
    if (lock === 0) {
      lock = 1
      // setChangeLock(1)
      return true
    } else {
      return false
    }
  }

  const handleOpenListClick = () => {
    setOpenList(!openList)
  }

  const [messageOpen, setMessageOpen] = useState(0)
  const [openAddTag, setOpenAddTag] = useState(false)
  // 0 default, 1 loading, 2 success, 3 failure
  const [tagChange, setTagChange] = useState(0)

  const handleAddTagClick = () => {
    setOpenAddTag(true)
  }

  const handleAddTag = () => {
    setTagChange(1)
    console.log(tagNameValue, tagDescriptionValue)
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
        setOpenAddTag(false)
        // setChangeLock(0)
        if (data.code === 0) {
          setMessageOpen(1)
          setTagChange(2)
        } else {
          setMessageOpen(2)
          setTagChange(3)
        }
      })
  }

  const handleMessageClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setMessageOpen(0)
  }

  const handleAddTagClose = () => {
    setOpenAddTag(false)
  }

  return (
    <SiteContext.Consumer>
      {({ data, updateTag }) => (
        <Box className={classes.root}>
          {tagChange === 2 && changeLock() ? updateTag() : ""}
          <List component="nav" className={classes.list}>
            <ListItem button>
              <ListItemIcon>
                <AllInboxIcon />
              </ListItemIcon>
              <ListItemText primary="全部" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="喜欢" />
            </ListItem>
            <ListItem button onClick={handleOpenListClick}>
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="标签分类" />
              {openList ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openList} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {data.tags.map(tag => (
                  <ListItem button key={tag.id} className={classes.nested}>
                    <ListItemIcon>
                      <LabelOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={tag.name}
                      secondary={tag.description}
                    />
                  </ListItem>
                ))}
              </List>
            </Collapse>
            <ListItem button onClick={handleAddTagClick}>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary="新增标签" />
            </ListItem>
          </List>
          <Dialog
            open={openAddTag}
            onClose={handleAddTagClose}
            aria-labelledby="form-dialog-title"
            maxWidth={false}
            className={classes.dialog}
          >
            <DialogTitle id="form-dialog-title">Add Tag</DialogTitle>
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
                helperText="标签名字可以重复"
                autoFocus
                onChange={e => {
                  setTagNameValue(e.currentTarget.value)
                }}
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
              <IconButton
                color="primary"
                onClick={handleAddTagClose}
                aria-label="取消"
              >
                <CloseIcon />
              </IconButton>
              <IconButton
                color="primary"
                onClick={handleAddTag}
                aria-label="确定"
              >
                <DoneIcon />
              </IconButton>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={messageOpen === 1}
            autoHideDuration={3000}
            onClose={handleMessageClose}
          >
            <Alert severity="success" variant="filled">
              <AlertTitle>
                <strong>添加成功</strong>
              </AlertTitle>
              标签 XXX 已经添加。
            </Alert>
          </Snackbar>
          <Snackbar
            open={messageOpen === 2}
            autoHideDuration={3000}
            onClose={handleMessageClose}
          >
            <Alert severity="error" variant="filled">
              <AlertTitle>
                <strong>添加失败</strong>
              </AlertTitle>
              请检查网络或者刷新页面重新登录。
            </Alert>
          </Snackbar>
        </Box>
      )}
    </SiteContext.Consumer>
  )
}
