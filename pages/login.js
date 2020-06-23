import {
  makeStyles,
  Backdrop,
  TextField,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Fade,
} from "@material-ui/core"
import SendIcon from "@material-ui/icons/Send"
// import Context from "./Context"
import { useState, useContext, useRef } from "react"
import Router from "next/router"

const useStyles = makeStyles(theme => ({
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: 'url("images/login-background.jpg")',
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  card: {
    width: "300px",
    padding: theme.spacing(3),
  },
  form: {
    position: "relative",
    width: "100%",
  },
  textfield: {
    width: "100%",
  },
  button: {
    position: "absolute",
    width: "40px",
    height: "40px",
    top: "8px",
    right: "8px",
    fontSize: "16px",
  },
  show: {
    display: "flex",
  },
  hide: {
    display: "none",
  },
}))

export default function LoginWindow({ className }) {
  const classes = useStyles()
  const [errorStatus, setErrorStatus] = useState(false)
  const [emptyStatus, setEmptyStatus] = useState(true)
  const passwordRef = useRef(null)

  function handleClick() {
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({
        password: passwordRef.current.value,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.code === 0) {
          window.location.href = "/"
        } else {
          setErrorStatus(true)
        }
      })
  }

  function handleChange(e) {
    setErrorStatus(false)
    if (e.target.value.length === 0) {
      setEmptyStatus(true)
    } else {
      setEmptyStatus(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    document.querySelector("#login").click()
  }

  return (
    <div className={classes.background + " " + className} id="background">
      <Card className={classes.card} variant="elevation" elevation={6}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Login
          </Typography>
          <Typography variant="h5" component="h2">
            输入密码以登录
          </Typography>
        </CardContent>
        <CardActions>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              id="password"
              label={errorStatus ? "Error" : "Password"}
              variant="outlined"
              type="password"
              className={classes.textfield}
              error={errorStatus}
              helperText={errorStatus ? "密码错误" : ""}
              onChange={handleChange}
              inputRef={passwordRef}
              required
              fullWidth
              autoFocus
            />
            <IconButton
              color="primary"
              className={classes.button}
              id="login"
              onClick={handleClick}
              disabled={emptyStatus}
            >
              <SendIcon color="action" fontSize="small" />
            </IconButton>
          </form>
        </CardActions>
      </Card>
    </div>
  )
}
