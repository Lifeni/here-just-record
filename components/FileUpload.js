import Box from "@material-ui/core/Box"
import IconButton from "@material-ui/core/IconButton"
import { makeStyles } from "@material-ui/core/styles"
import AddPhotoAlternateOutlinedIcon from "@material-ui/icons/AddPhotoAlternateOutlined"
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

export default function FileUpload({ getFile }) {
  const classes = useStyles()
  const [imageData, setImageData] = useState(null)

  const handleUploadChange = e => {
    console.log(e.currentTarget.files[0])
    const reader = new FileReader()
    reader.readAsDataURL(e.currentTarget.files[0])
    reader.onload = img => {
      setImageData(img.target.result)
    }
    getFile(e.currentTarget.files[0])
  }

  return (
    <Box className={classes.root}>
      <input
        accept="image/*"
        className={classes.input}
        id="upload-file"
        type="file"
        onChange={handleUploadChange}
      />
      <label htmlFor="upload-file">
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
          className={classes.upload}
        >
          <AddPhotoAlternateOutlinedIcon fontSize="large" />
        </IconButton>
      </label>
      <img
        src={imageData}
        alt="上传图片预览"
        className={classes.image}
        id="upload-image"
        hidden={!Boolean(imageData)}
      />
    </Box>
  )
}
