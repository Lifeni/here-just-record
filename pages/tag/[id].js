import { makeStyles, Container, Grid } from "@material-ui/core"
import Router, { useRouter } from "next/router"

import TagList from "../../components/TagList"
import TopBarSimple from "../../components/TopBarSimple"

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

export default function Tag({ siteData }) {
  const classes = useStyles()
  const router = useRouter()
  const { id } = router.query

  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      className={classes.container}
    >
      <TopBarSimple
        title={siteData.tag ? siteData.tag.name : "标签名称"}
        description={siteData.tag ? siteData.tag.description : "标签描述"}
        length={siteData.data.length}
      />
      <Grid container spacing={2} className={classes.grid}>
        <Grid item xs={12}>
          <main>
            <TagList data={siteData.data}></TagList>
          </main>
        </Grid>
      </Grid>
    </Container>
  )
}

Tag.getInitialProps = async ctx => {
  console.log(ctx.query)
  const data = await fetch(`http://localhost:3000/api/tag?id=${ctx.query.id}`, {
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
  console.log("[id]", json)

  return { siteData: json }
}
