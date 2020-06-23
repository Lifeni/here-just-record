import {
  Box,
  ButtonGroup,
  Button,
  Backdrop,
  CircularProgress,
  Snackbar,
  Typography,
  TextareaAutosize,
  Card,
  IconButton,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useRef, useState } from "react"
import AddIcon from "@material-ui/icons/Add"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import dynamic from "next/dynamic"
import ImageIcon from "@material-ui/icons/Image"
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile"
import LabelIcon from "@material-ui/icons/Label"
import MarkdownIt from "markdown-it"
import moment from "moment"
import SendIcon from "@material-ui/icons/Send"
import Skeleton from "@material-ui/lab/Skeleton"
import SaveIcon from "@material-ui/icons/Save"
import PhotoCamera from "@material-ui/icons/PhotoCamera"
import AddCircleIcon from "@material-ui/icons/AddCircle"
import DeleteIcon from "@material-ui/icons/Delete"
import DataUsageIcon from "@material-ui/icons/DataUsage"
import AttachmentIcon from "@material-ui/icons/Attachment"
import SettingsIcon from "@material-ui/icons/Settings"
import InfoIcon from "@material-ui/icons/Info"
import Popover from "@material-ui/core/Popover"

import { SiteContext } from "../components/SiteContext"

const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
  ssr: false,
  loading: () => (
    <Card
      variant="outlined"
      style={{ width: "100%", height: "240px", borderRadius: "4px" }}
    ></Card>
  ),
})

// const MdEditor = import("react-markdown-editor-lite")
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
    height: "240px",
    background: "rgba(255, 255, 255, 0.5)",
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
  iconCenter: {
    margin: 0,
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
}))

let lock = 0

export default function Editor() {
  const classes = useStyles()
  const contentRef = useRef(null)
  const [textValue, setTextValue] = useState(null)
  const [wordCount, setWordCount] = useState(0)

  // 0 default, 1 loading, 2 success, 3 failure
  const [loading, setLoading] = useState(0)
  const [messageOpen, setMessageOpen] = useState(0)
  // const [changeLock, setChangeLock] = useState(0)

  const [anchorInfo, setAnchorInfo] = React.useState(null)

  const changeLock = () => {
    // console.log(lock)

    if (lock === 0) {
      // setChangeLock(1)
      lock = 1
      return true
    } else {
      return false
    }
  }

  const handleSendClick = e => {
    e.preventDefault()
    setLoading(1)
    // console.log(textValue)
    fetch("/api/post", {
      method: "POST",
      body: JSON.stringify({
        text: textValue,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        // setChangeLock(0)
        if (data.code === 0) {
          setMessageOpen(1)
          setLoading(2)
        } else {
          setMessageOpen(2)
          setLoading(3)
        }
        setTimeout(() => {
          lock = 0
          setLoading(0)
        }, 1000)
      })
  }

  const handleInfoClick = event => {
    setAnchorInfo(event.currentTarget)
  }

  const handleInfoClose = () => {
    setAnchorInfo(null)
  }

  const handleMessageClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setMessageOpen(0)
  }

  return (
    <Box variant="outline" className={classes.root}>
      <SiteContext.Consumer>
        {({ data, updatePost }) => {
          loading === 2 && changeLock() ? updatePost() : ""
        }}
      </SiteContext.Consumer>
      <Box className={classes.bar}>
        {/* <ButtonGroup className={classes.group} disabled={loading === 1}> */}
        <Box>
          <IconButton
            className={classes.iconLeft}
            color="secondary"
            aria-label="文章设置"
            disabled={loading === 1}
          >
            <SettingsIcon />
          </IconButton>
        </Box>

        <Box>
          <IconButton
            className={classes.iconCenter}
            color="secondary"
            aria-label="添加标签"
            disabled={loading === 1}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            className={classes.iconCenter}
            color="secondary"
            aria-label="添加照片或文件"
            disabled={loading === 1}
          >
            <PhotoCamera />
          </IconButton>

          <IconButton
            className={classes.iconLeft}
            color="secondary"
            aria-label="文章信息"
            disabled={loading === 1}
            onClick={handleInfoClick}
          >
            <InfoIcon />
          </IconButton>
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
          <IconButton
            className={classes.iconRight}
            color="primary"
            aria-label="发布"
            onClick={handleSendClick}
            disabled={loading === 1}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
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
          ref={contentRef}
          value={textValue}
          style={{
            height: "240px",
            borderRadius: "0 0 4px 4px",
          }}
          placeholder={"在这里输入内容\n使用 Markdown 语法"}
          onChange={({ html, text }) => {
            setTextValue(text)
            setWordCount(text.length)
            document.querySelector("textarea").classList.remove("focus")
          }}
          renderHTML={text => MdParser.render(text)}
          config={{
            view: { menu: true, md: true, html: false },
            markdownClass: classes.editor,
          }}
          readOnly={loading}
        />
      </Box>
      <Backdrop className={classes.backdrop} open={loading === 1}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={messageOpen === 1}
        autoHideDuration={3000}
        onClose={handleMessageClose}
      >
        <Alert severity="success" variant="filled">
          <AlertTitle>
            <strong>发布成功</strong>
          </AlertTitle>
          你的文章于 {moment().format("LLLL")} 发布。
        </Alert>
      </Snackbar>
      <Snackbar
        open={messageOpen === 2}
        autoHideDuration={3000}
        onClose={handleMessageClose}
      >
        <Alert severity="error" variant="filled">
          <AlertTitle>
            <strong>发布失败</strong>
          </AlertTitle>
          请检查网络或者刷新页面重新登录。
        </Alert>
      </Snackbar>
    </Box>
  )
}
