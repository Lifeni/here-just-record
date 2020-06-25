import { makeStyles, Container, Grid } from "@material-ui/core"
import { useState } from "react"
import Router from "next/router"

import LikeList from "../components/LikeList"
import TopBarSimple from "../components/TopBarSimple"

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

export default function Like({ siteData }) {
  const classes = useStyles()

  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      className={classes.container}
    >
      <TopBarSimple title="喜欢的文章" length={siteData.data.length} />
      <Grid container spacing={2} className={classes.grid}>
        <Grid item xs={12}>
          <main>
            <LikeList data={siteData.data}></LikeList>
          </main>
        </Grid>
      </Grid>
    </Container>
  )
}

Like.getInitialProps = async ctx => {
  const data = await fetch("http://localhost:3000/api/like", {
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
