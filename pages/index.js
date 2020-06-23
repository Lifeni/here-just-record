import {
  makeStyles,
  Container,
  Backdrop,
  CircularProgress,
} from "@material-ui/core"
import { useContext, useEffect, useState, createContext } from "react"
import Router from "next/router"

import { SiteContext } from "../components/SiteContext"
import Content from "../components/Content"
import FloatButton from "../components/FloatButton"
import Main from "../components/Main"
import TopBar from "../components/TopBar"

const useStyles = makeStyles(theme => ({
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: "200",
    width: "100vw",
    height: "100vh",
    color: "#ffffff",
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
              config: siteData.config,
              posts: res.data,
              tags: siteData.tags,
            })
          }
        })
    },
    updateTag: () => {
      fetch("/api/tag")
        .then(response => response.json())
        .then(res => {
          if (res.code === 0) {
            setData({
              config: siteData.config,
              posts: siteData.posts,
              tags: res.data,
            })
          }
        })
    },
  }

  return (
    <SiteContext.Provider value={context}>
      <Container
        maxWidth={false}
        disableGutters={true}
        className={classes.container}
      >
        <TopBar siteData={siteData} />
        <Content siteData={siteData}></Content>
        <FloatButton></FloatButton>
      </Container>
    </SiteContext.Provider>
  )
}

Home.getInitialProps = async ctx => {
  const data = await fetch("http://localhost:3000/api/home", {
    headers: {
      cookie: ctx.req.headers.cookie,
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
  // console.log(json)

  return { siteData: json }
}
