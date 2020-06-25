import {
  Avatar,
  Backdrop,
  Box,
  Card,
  CircularProgress,
  IconButton,
  ListItemAvatar,
  Snackbar,
  Typography,
} from "@material-ui/core"
import Chip from "@material-ui/core/Chip"
import { blue } from "@material-ui/core/colors"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Popover from "@material-ui/core/Popover"
import { makeStyles } from "@material-ui/core/styles"
import Tooltip from "@material-ui/core/Tooltip"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone"
import CloseIcon from "@material-ui/icons/Close"
import DeleteIcon from "@material-ui/icons/Delete"
import DoneIcon from "@material-ui/icons/Done"
import InfoIcon from "@material-ui/icons/Info"
import LabelTwoToneIcon from "@material-ui/icons/LabelTwoTone"
import PhotoCamera from "@material-ui/icons/PhotoCamera"
import SendIcon from "@material-ui/icons/Send"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import OSS from "ali-oss"
import MarkdownIt from "markdown-it"
import moment from "moment"
import dynamic from "next/dynamic"
import { useContext, useState } from "react"
import FileUpload from "./FileUpload"
import { SiteContext } from "./SiteContext"

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
  loading: () => (
    <Card
      variant="outlined"
      style={{ width: "100%", height: "240px", borderRadius: "4px" }}
    ></Card>
  ),
})

const MdParser = new MarkdownIt()

const useStyles = makeStyles(theme => ({
  root: {
    position: "relative",
    width: "100%",
    flexGrow: 1,
    margin: 0,
    overflowY: "visible",
  },
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "4px 4px 0 0",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "none",
    margin: 0,
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`,
  },
  group: {
    margin: `0 0 ${theme.spacing(2)}px 0`,
  },
  backdrop: {
    position: "absolute",
    top: "unset",
    bottom: 0,
    left: 0,
    zIndex: 1200,
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.5)",
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  iconCenter: {
    margin: `0 ${theme.spacing(0.5)}px`,
  },
  iconRight: {
    marginLeft: theme.spacing(1),
  },
  editor: {
    fontSize: "1rem",
  },
  popover: {
    padding: theme.spacing(2),
  },
  list: {
    padding: theme.spacing(1),
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
  avatar: {
    width: "32px",
    height: "32px",
    backgroundColor: blue[100],
    color: blue[600],
  },
  dialogContent: {
    padding: theme.spacing(1),
  },
  preview: {
    width: "100%",
    height: "auto",
    backgroundColor: "#f5f5f5",
    display: "flex",
    border: "1px solid rgba(0, 0, 0, 0.12)",
    borderBottom: "none",
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

export default function Editor() {
  const siteData = useContext(SiteContext)

  const client = siteData.data.config
    ? new OSS({
        region: siteData.data.config.oss.region,
        accessKeyId: siteData.data.config.oss.accessKeyId,
        accessKeySecret: siteData.data.config.oss.accessKeySecret,
        bucket: siteData.data.config.oss.bucket,
        secure: true,
      })
    : null

  const classes = useStyles()
  const [textValue, setTextValue] = useState(null)
  const [tagValue, setTagValue] = useState(null)
  const [fileMeta, setFileMeta] = useState(null)
  const [fileValue, setFileValue] = useState(null)
  const [fileSource, setFileSource] = useState(null)
  const [wordCount, setWordCount] = useState(0)

  // 0 default, 1 loading, 2 success, 3 failure
  const [sendLoading, setSendLoading] = useState(0)
  const [empty, setEmpty] = useState(true)

  const [sendMessageOpen, setSendMessageOpen] = useState(0)
  const [uploadMessageOpen, setUploadMessageOpen] = useState(0)
  // const [changeLock, setChangeLock] = useState(0)

  const [anchorInfo, setAnchorInfo] = React.useState(null)
  const [openAddTag, setOpenAddTag] = useState(false)
  const [openAddFile, setOpenAddFile] = useState(false)

  const changeLock = () => {
    if (lock === 0) {
      lock = 1
      return true
    } else {
      return false
    }
  }

  const handleSendClick = e => {
    e.preventDefault()
    setSendLoading(1)
    fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({
        text: textValue,
        tag: tagValue ? JSON.parse(tagValue).id : 0,
        file: fileValue,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 0) {
          setSendMessageOpen(1)
          setSendLoading(2)
        } else {
          setSendMessageOpen(2)
          setSendLoading(3)
        }
        setTimeout(() => {
          lock = 0
          setSendLoading(0)
        }, 1000)
      })
  }

  const handleInfoClick = event => {
    setAnchorInfo(event.currentTarget)
  }

  const handleInfoClose = () => {
    setAnchorInfo(null)
  }

  const handleSendMessageClose = () => {
    setSendMessageOpen(0)
  }

  const handleAddTagClick = () => {
    setOpenAddTag(true)
  }

  const handleAddTagClose = () => {
    setOpenAddTag(false)
  }

  const handleAddTag = e => {
    setTagValue(e.currentTarget.dataset.tag)
    console.log("add: ", e.currentTarget.dataset.tag)
    setOpenAddTag(false)
  }

  const handleAddFileClick = () => {
    setOpenAddFile(true)
  }

  const handleAddFileClose = () => {
    setOpenAddFile(false)
  }

  const handleAddFile = async () => {
    if (textValue === "" && fileMeta === null) {
      setEmpty(true)
    } else {
      setEmpty(false)
    }
    const data = fileMeta
    const type = data.name.split(".")[data.name.split(".").length - 1]
    try {
      const result = await client.put(
        `${new Date().getTime().toString()}.${type}`,
        data
      )
      setFileValue({
        url: result.url,
        type: type,
      })
      setUploadMessageOpen(1)
      console.log(result)
    } catch (error) {
      setUploadMessageOpen(2)
      console.log(error)
    }
    setOpenAddFile(false)
  }

  const getFile = data => {
    setFileMeta(data)
    const reader = new FileReader()
    reader.readAsDataURL(data)
    reader.onload = img => {
      setFileSource(img.target.result)
    }
  }

  const handleRemoveFileClick = () => {
    setFileValue(null)
    setFileMeta(null)
    setFileSource(null)
  }

  const handleUploadMessageClose = () => {
    setUploadMessageOpen(0)
  }

  const handleRemoveAll = () => {
    lock = 0
    setSendLoading(0)
    setTextValue(null)
    setTagValue(null)
    setFileValue(null)
    setFileMeta(null)
    setFileSource(null)
    setAnchorInfo(null)
    setWordCount(0)
  }

  return (
    <SiteContext.Consumer>
      {({ data, updatePost }) => (
        <Box variant="outline" className={classes.root}>
          {sendLoading === 2 && changeLock() ? updatePost() : null}
          <Box className={classes.bar}>
            <Box>
              <BootstrapTooltip
                title="清除内容"
                aria-label="清除内容"
                placement="top"
                arrow
              >
                <IconButton
                  className={classes.iconLeft}
                  color="secondary"
                  aria-label="清除内容"
                  disabled={sendLoading === 1}
                  onClick={handleRemoveAll}
                >
                  <DeleteIcon />
                </IconButton>
              </BootstrapTooltip>
            </Box>

            <Box>
              <BootstrapTooltip
                title="添加标签"
                aria-label="添加标签"
                placement="top"
                arrow
              >
                <IconButton
                  className={classes.iconCenter}
                  color="secondary"
                  aria-label="添加标签"
                  disabled={sendLoading === 1}
                  onClick={handleAddTagClick}
                >
                  <AddCircleIcon />
                </IconButton>
              </BootstrapTooltip>

              {tagValue && JSON.parse(tagValue).id !== 0 ? (
                <Chip
                  color="primary"
                  variant="default"
                  label={JSON.parse(tagValue).name}
                  disabled={sendLoading === 1}
                  style={{ margin: "8px 4px" }}
                  onClick={handleAddTagClick}
                ></Chip>
              ) : null}

              <BootstrapTooltip
                title="添加照片"
                aria-label="添加照片"
                placement="top"
                arrow
              >
                <IconButton
                  className={classes.iconCenter}
                  color="secondary"
                  aria-label="添加照片"
                  onClick={handleAddFileClick}
                  disabled={sendLoading === 1}
                >
                  <PhotoCamera />
                </IconButton>
              </BootstrapTooltip>

              {fileValue ? (
                <Chip
                  color="primary"
                  variant="default"
                  label="移除图片"
                  disabled={sendLoading === 1}
                  style={{ margin: "0 4px" }}
                  onClick={handleRemoveFileClick}
                ></Chip>
              ) : null}

              <BootstrapTooltip
                title="文章信息"
                aria-label="文章信息"
                placement="top"
                arrow
              >
                <IconButton
                  className={classes.iconCenter}
                  color="secondary"
                  aria-label="文章信息"
                  disabled={sendLoading === 1}
                  onClick={handleInfoClick}
                >
                  <InfoIcon />
                </IconButton>
              </BootstrapTooltip>

              <Popover
                open={Boolean(anchorInfo)}
                anchorEl={anchorInfo}
                onClose={handleInfoClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <Typography variant="body1" className={classes.popover}>
                  文章字数：{wordCount}
                </Typography>
              </Popover>
            </Box>

            <Box>
              <BootstrapTooltip
                title="发布"
                aria-label="发布"
                placement="top"
                arrow
              >
                <span style={{ display: "inline-block", height: "56px" }}>
                  <IconButton
                    className={classes.iconRight}
                    color="primary"
                    aria-label="发布"
                    onClick={handleSendClick}
                    disabled={sendLoading === 1 || empty}
                  >
                    <SendIcon />
                  </IconButton>
                </span>
              </BootstrapTooltip>
            </Box>
          </Box>
          {fileValue ? (
            <Box>
              <img
                src={fileSource}
                alt="用户图片预览"
                className={classes.preview}
              />
            </Box>
          ) : null}
          <Box style={{ minHeight: "240px" }}>
            <MdEditor
              plugins={[
                "header",
                "fonts",
                "clear",
                "logger",
                "mode-toggle",
                "full-screen",
              ]}
              value={textValue ? textValue : ""}
              style={{
                height: "240px",
                borderRadius: "0 0 4px 4px",
              }}
              placeholder={"在这里输入内容\n使用 Markdown 语法"}
              onChange={({ text }) => {
                setTextValue(text)
                setWordCount(text.length)
                document.querySelector("textarea").classList.remove("focus")
                if (text === "" && fileMeta === null) {
                  setEmpty(true)
                } else {
                  setEmpty(false)
                }
              }}
              renderHTML={text => MdParser.render(text)}
              config={{
                view: { menu: true, md: true, html: false },
                markdownClass: classes.editor,
              }}
              readOnly={sendLoading}
            />
          </Box>
          <Backdrop className={classes.backdrop} open={sendLoading === 1}>
            <CircularProgress color="inherit" />
          </Backdrop>
          <Dialog
            open={openAddTag}
            onClose={handleAddTagClose}
            aria-labelledby="add-tag-title"
            maxWidth={false}
            scroll="paper"
          >
            <DialogTitle id="add-tag-title">选择一个标签</DialogTitle>
            <List className={classes.list}>
              {data.tags
                ? data.tags.map(tag => (
                    <ListItem
                      button
                      onClick={handleAddTag}
                      key={tag.id}
                      className={`${classes.nested} ${classes.listItem}`}
                      data-tag={JSON.stringify(tag)}
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
                  ))
                : []}
              <ListItem
                button
                onClick={handleAddTag}
                className={`${classes.nested} ${classes.listItem}`}
                data-tag={'{ "id": 0, "name": null, "description": null }'}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
                    <ClearTwoToneIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="不添加标签"
                  secondary="相当于移除当前标签"
                />
              </ListItem>
            </List>
          </Dialog>
          <Dialog
            open={openAddFile}
            onClose={handleAddFileClose}
            aria-labelledby="add-file-title"
            maxWidth={false}
            scroll="paper"
          >
            <DialogTitle id="add-file-title">上传图片</DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <FileUpload getFile={getFile}></FileUpload>
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
                  onClick={handleAddFileClose}
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
                  onClick={handleAddFile}
                  aria-label="确定"
                >
                  <DoneIcon />
                </IconButton>
              </BootstrapTooltip>
            </DialogActions>
          </Dialog>
          <Snackbar
            open={sendMessageOpen === 1}
            autoHideDuration={3000}
            onClose={handleSendMessageClose}
          >
            <Alert severity="success" variant="filled">
              <AlertTitle>
                <strong>发布成功</strong>
              </AlertTitle>
              你的文章于 {moment().format("LLLL")} 发布。
            </Alert>
          </Snackbar>
          <Snackbar
            open={sendMessageOpen === 2}
            autoHideDuration={3000}
            onClose={handleSendMessageClose}
          >
            <Alert severity="error" variant="filled">
              <AlertTitle>
                <strong>发布失败</strong>
              </AlertTitle>
              请检查网络或者刷新页面重新登录。
            </Alert>
          </Snackbar>

          <Snackbar
            open={uploadMessageOpen === 1}
            autoHideDuration={3000}
            onClose={handleUploadMessageClose}
          >
            <Alert severity="success" variant="filled">
              <AlertTitle>
                <strong>上传成功</strong>
              </AlertTitle>
              图片{fileMeta ? ` ${fileMeta.name} ` : ""}上传成功。
            </Alert>
          </Snackbar>
          <Snackbar
            open={uploadMessageOpen === 2}
            autoHideDuration={3000}
            onClose={handleUploadMessageClose}
          >
            <Alert severity="error" variant="filled">
              <AlertTitle>
                <strong>上传失败</strong>
              </AlertTitle>
              请检查网络或者刷新页面重新登录。
            </Alert>
          </Snackbar>
        </Box>
      )}
    </SiteContext.Consumer>
  )
}
