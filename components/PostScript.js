import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import IconButton from "@material-ui/core/IconButton"
import Snackbar from "@material-ui/core/Snackbar"
import { makeStyles } from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Tooltip from "@material-ui/core/Tooltip"
import CloseIcon from "@material-ui/icons/Close"
import DoneIcon from "@material-ui/icons/Done"
import Alert from "@material-ui/lab/Alert"
import AlertTitle from "@material-ui/lab/AlertTitle"
import moment from "moment"
import { useState } from "react"

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
  input: {
    display: "none",
  },
  upload: {
    width: "100%",
    height: "180px",
    borderRadius: "4px",
    border: "1px solid rgba(0, 0, 0, 0.12)",
  },
  uploadText: {
    fontSize: "1.25rem",
    padding: theme.spacing(2),
  },
  image: {
    width: "100%",
    marginTop: theme.spacing(2),
    borderRadius: "4px",
    border: "1px solid rgba(0, 0, 0, 0.12)",
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

export default function PostScript({ open, close, id, updatePost }) {
  const classes = useStyles()
  const [textValue, setTextValue] = useState(null)
  const [sendMessageOpen, setSendMessageOpen] = useState(0)
  const [inputError, setInputError] = useState(null)

  const handleSendMessageClose = () => {
    setInputError(null)
    setSendMessageOpen(0)
  }

  const handleAddPostScript = async () => {
    if (!textValue) {
      setInputError("输入内容不能为空")
    } else {
      fetch("/api/postscript", {
        method: "POST",
        body: JSON.stringify({
          id: id,
          content: textValue,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.code === 0) {
            setSendMessageOpen(1)
            updatePost()
          } else {
            setSendMessageOpen(2)
          }
        })
      await close()
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="add-file-title"
        maxWidth={"lg"}
        scroll="paper"
      >
        <DialogTitle id="add-file-title">添加附言</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <TextField
            id="postscript-input"
            label="PostScript"
            aria-label="附言文本框"
            multiline
            rows={10}
            margin="normal"
            variant="outlined"
            placeholder={"在此输入附言\n仅支持文本格式"}
            onChange={e => {
              setInputError(null)
              setTextValue(e.target.value)
            }}
            fullWidth
            autoFocus
            error={Boolean(inputError)}
            helperText={Boolean(inputError) ? inputError : null}
          />
        </DialogContent>
        <DialogActions>
          <BootstrapTooltip
            title="取消"
            aria-label="取消"
            placement="top"
            arrow
          >
            <IconButton color="primary" onClick={close} aria-label="取消">
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
              onClick={handleAddPostScript}
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
            <strong>添加成功</strong>
          </AlertTitle>
          你的附言于 {moment().format("LLLL")} 添加。
        </Alert>
      </Snackbar>
      <Snackbar
        open={sendMessageOpen === 2}
        autoHideDuration={3000}
        onClose={handleSendMessageClose}
      >
        <Alert severity="error" variant="filled">
          <AlertTitle>
            <strong>添加失败</strong>
          </AlertTitle>
          请检查网络或者刷新页面重新登录。
        </Alert>
      </Snackbar>
    </>
  )
}
