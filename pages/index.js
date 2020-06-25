import { makeStyles, Container, Grid } from "@material-ui/core"
import { useState } from "react"
import Router from "next/router"

import { SiteContext } from "../components/SiteContext"
import Editor from "../components/Editor"
import FloatButton from "../components/FloatButton"
import NavBar from "../components/NavBar"
import PostList from "../components/PostList"
import TopBar from "../components/TopBar"

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

export default function Home({ siteData }) {
  const classes = useStyles()
  const [data, setData] = useState(siteData)

  const context = {
    data: data,
    updatePost: () => {
      fetch("/api/post")
        .then(response => response.json())
        .then(res => {
          if (res.code === 0) {
            setData({
              config: data.config,
              posts: res.data,
              tags: data.tags,
            })
          }
        })
      console.log("up post", data)
    },
    updateTag: () => {
      fetch("/api/tag")
        .then(response => response.json())
        .then(res => {
          console.log("tag res", res)
          if (res.code === 0) {
            setData({
              config: data.config,
              posts: data.posts,
              tags: res.data,
            })
          }
        })
      console.log("up tag", data)
    },
  }

  return (
    <SiteContext.Provider value={context}>
      <Container
        maxWidth={false}
        disableGutters={true}
        className={classes.container}
      >
        <TopBar />
        <Grid container spacing={2} className={classes.grid}>
          <Grid item xs={4}>
            <nav>
              <NavBar></NavBar>
            </nav>
          </Grid>
          <Grid item xs={8}>
            <main>
              <Editor></Editor>
              <PostList></PostList>
            </main>
          </Grid>
        </Grid>
        <FloatButton></FloatButton>
      </Container>
    </SiteContext.Provider>
  )
}

Home.getInitialProps = async ctx => {
  const data = await fetch("http://localhost:3000/api/home", {
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
