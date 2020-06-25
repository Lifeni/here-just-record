const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const moment = require("moment")

const { verify } = require("./token")

export default async function Overview(req, res) {
  if (req.cookies.auth && verify(req.cookies.auth)) {
    const db = await sqlite.open({
      filename: path.join(process.cwd(), "server/record.sqlite"),
      driver: sqlite3.Database,
    })

    if (req.method === "GET") {
      const text = await db.all("SELECT * FROM TextList")
      const file = await db.all("SELECT * FROM FileList")
      const tag = await db.all("SELECT * FROM TagList")
      const count = {
        post: await db.get("SELECT COUNT (*) AS count FROM Post "),
        tag: await db.get("SELECT COUNT (*) AS count FROM Tag "),
        text: await db.get("SELECT COUNT (*) AS count FROM Text "),
        file: await db.get("SELECT COUNT (*) AS count FROM File "),
        postscript: await db.get("SELECT COUNT (*) AS count FROM PostScript "),
      }

      const word = {
        post: (
          await db.all("SELECT length(content) AS count FROM Text")
        ).reduce((a, b) => a + b.count, 0),
        postscript: (
          await db.all("SELECT length(content) AS count FROM PostScript")
        ).reduce((a, b) => a + b.count, 0),
      }

      const like = await db.get(
        "SELECT count (like) AS count FROM Post WHERE like = 1"
      )

      const notag = await db.get(
        "SELECT count (tag) AS count FROM Post WHERE tag = 0"
      )

      try {
        res.status(200).json({
          text: text,
          file: file,
          tag: tag,
          count: count,
          word: word,
          like: like,
          notag: notag,
        })
        res.end()
      } catch (error) {
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    } else {
      res.status(405).json({ code: 1, message: "方法不合适" })
      res.end()
    }
  } else {
    res.status(401).json({ code: 1, message: "身份验证不通过" })
    res.end()
  }
}
