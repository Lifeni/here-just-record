import { makeStyles, Container } from "@material-ui/core"
import Router from "next/router"

import TopBarSimple from "../components/TopBarSimple"
import PostInfo from "../components/PostInfo"

const useStyles = makeStyles(theme => ({
  grid: {
    width: "100%",
    maxWidth: "960px",
    flexGrow: 1,
    zIndex: 12,
    margin: "0 auto",
    padding: theme.spacing(1),
  },
}))

export default function Overview({ siteData }) {
  const classes = useStyles()

  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      className={classes.container}
    >
      <TopBarSimple title="概览、统计和筛选" />
      <PostInfo data={siteData}></PostInfo>
    </Container>
  )
}

Overview.getInitialProps = async ctx => {
  const data = await fetch("http://localhost:3000/api/overview", {
    headers: {
      cookie: ctx.req ? ctx.req.headers.cookie : null,
    },
  })

  if (data.status === 401 && !ctx.req) {
    Router.replace("/login")
    return {}
  }

  if (data.status === 401 && ctx.req) {
    ctx.res.writeHead(302, {
      Location: "http://localhost:3000/login",
    })
    ctx.res.end()
    return
  }

  const json = await data.json()

  return { siteData: json }
}
