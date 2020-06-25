const path = require("path")
const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

const { verify } = require("./token")

export default async function Like(req, res) {
  if (req.cookies.auth && verify(req.cookies.auth)) {
    const db = await sqlite.open({
      filename: path.join(process.cwd(), "server/record.sqlite"),
      driver: sqlite3.Database,
    })

    if (req.method === "GET") {
      try {
        const result = await db.all(
          "SELECT * FROM Post WHERE id IN (SELECT id FROM Post WHERE like = 1) ORDER BY date DESC"
        )
        const posts = await Promise.all(
          result.map(async post => {
            const id = post.id
            const tag = await db.get("SELECT * FROM Tag WHERE id = ?", post.tag)
            const text = await db.get(
              "SELECT * FROM Text INDEXED BY PostTextIndex WHERE post = ?",
              id
            )
            const file = await db.get(
              "SELECT * FROM File INDEXED BY PostFileIndex WHERE post = ?",
              id
            )
            const postscripts = await db.all(
              "SELECT * FROM PostScript INDEXED BY PostScriptIndex WHERE post = ? ORDER BY date DESC",
              id
            )
            return {
              post: post,
              tag: tag ? tag : null,
              text: text ? text : null,
              file: file ? file : null,
              postscripts: postscripts ? postscripts : null,
            }
          })
        )
        res.status(200).json({ code: 0, message: "行了", data: posts })
        res.end()
      } catch (error) {
        console.log("PUT DB", error)
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    } else if (req.method === "PUT") {
      try {
        const result = await db.run("UPDATE Post SET like = ? WHERE id = ?", [
          req.body.like,
          req.body.id,
        ])
        res.status(200).json({ code: 0, message: "行了" })
        res.end()
      } catch (error) {
        console.log("PUT DB", error)
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
