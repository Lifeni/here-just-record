import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"

import Main from "./Main"
import Sidebar from "./Sidebar"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: "960px",
    flexGrow: 1,
    zIndex: 12,
    margin: "0 auto",
    padding: theme.spacing(1),
  },
}))

export default function Content({ className }) {
  const classes = useStyles()

  return (
    <Grid container spacing={2} className={classes.root + " " + className}>
      <Grid item xs={4}>
        <Sidebar></Sidebar>
      </Grid>
      <Grid item xs={8}>
        <Main></Main>
      </Grid>
    </Grid>
  )
}
