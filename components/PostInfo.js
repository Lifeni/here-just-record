import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Grid from "@material-ui/core/Grid"
import { makeStyles } from "@material-ui/core/styles"
import Typography from "@material-ui/core/Typography"

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  grid: {
    width: "100%",
    maxWidth: "960px",
    flexGrow: 1,
    zIndex: 12,
    margin: "0 auto",
    padding: theme.spacing(1),
  },
  card: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: "1.1rem",
  },
}))

export default function PostInfo({ data }) {
  const classes = useStyles()
  console.log(data)
  return (
    <Grid container spacing={2} className={classes.grid}>
      <Grid item xs={6}>
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h3">
              文章 | Post
            </Typography>
          </CardContent>

          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              文章数
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.count.post.count}
            </Typography>
          </CardContent>
          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              喜欢的文章数
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.like.count}
            </Typography>
          </CardContent>
          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              所有文章字数
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.word.post}
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h3">
              文件 | File
            </Typography>
          </CardContent>

          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              文件数
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.count.file.count}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h3">
              标签 | Tag
            </Typography>
          </CardContent>

          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              标签数
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.count.tag.count}
            </Typography>
          </CardContent>

          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              没有标签的文章数量
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.notag.count}
            </Typography>
          </CardContent>
        </Card>
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography variant="h5" component="h3">
              附言 | PostScript
            </Typography>
          </CardContent>

          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              附言数
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.count.postscript.count}
            </Typography>
          </CardContent>
          <CardContent className={classes.item}>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              附言字数
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={classes.itemText}
            >
              {data.word.postscript}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
