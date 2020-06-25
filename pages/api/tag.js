const path = require("path")
const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

const { verify } = require("./token")

export default async function Tag(req, res) {
  if (req.cookies.auth && verify(req.cookies.auth)) {
    const db = await sqlite.open({
      filename: path.join(process.cwd(), "server/record.sqlite"),
      driver: sqlite3.Database,
    })

    if (req.method === "GET") {
      try {
        if (req.query.id) {
          const result = await db.all(
            "SELECT * FROM Post WHERE id IN (SELECT id FROM Post WHERE tag = ?) ORDER BY date DESC",
            req.query.id
          )
          const posts = await Promise.all(
            result.map(async post => {
              const id = post.id
              const tag = await db.get(
                "SELECT * FROM Tag WHERE id = ?",
                req.query.id
              )
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
          const tagInfo = await db.get(
            "SELECT * FROM Tag WHERE id = ?",
            req.query.id
          )
          res
            .status(200)
            .json({ code: 0, message: "行了", data: posts, tag: tagInfo })
          res.end()
        } else {
          const tags = await db.all("SELECT * FROM Tag ORDER BY id DESC")
          res.status(200).json({ code: 0, message: "行了", data: tags })
          res.end()
        }
      } catch (error) {
        console.log("GET DB", error)
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    } else if (req.method === "POST") {
      try {
        await db.run("INSERT INTO Tag (name, description) VALUES (?, ?)", [
          req.body.name,
          req.body.description ? req.body.description : null,
        ])
        res.status(200).json({ code: 0, message: "行了" })
        res.end()
      } catch (error) {
        console.log(error)
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    } else if (req.method === "DELETE") {
      try {
        const result = await db.run("DELETE FROM Tag WHERE id = ?", req.body.id)
        res.status(200).json({ code: 0, message: "行了" })
        res.end()
      } catch (error) {
        console.log("GET DB", error)
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    }
  }
}
