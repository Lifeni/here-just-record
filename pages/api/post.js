const path = require("path")
const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

const { verify } = require("./token")

export default async function Post(req, res) {
  if (req.cookies.auth && verify(req.cookies.auth)) {
    const db = await sqlite.open({
      filename: path.join(process.cwd(), "server/record.sqlite"),
      driver: sqlite3.Database,
    })

    if (req.method === "GET") {
      try {
        const result = await db.all("SELECT * FROM Post ORDER BY date DESC")
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
        console.log("GET DB", error)
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    } else if (req.method === "POST") {
      try {
        await db.run("INSERT INTO Post (date, tag, like) VALUES (?, ?, ?)", [
          new Date().getTime().toString(),
          req.body.tag ? req.body.tag : 0,
          0,
        ])

        const id = await db.get("SELECT last_insert_rowid() FROM Post")
        console.log("last id", id, id["last_insert_rowid()"])

        if (req.body.text) {
          await db.run("INSERT INTO Text (post, content) VALUES (?, ?)", [
            id["last_insert_rowid()"],
            req.body.text,
          ])
        }

        if (req.body.file) {
          await db.run("INSERT INTO File (post, type, url) VALUES (?, ?, ?)", [
            id["last_insert_rowid()"],
            req.body.file.type,
            req.body.file.url,
          ])
        }

        // Debug
        // const post = await db.all("SELECT * FROM Post")
        // console.log("Post", JSON.stringify(post, null, 4))

        res.status(200).json({ code: 0, message: "行了" })
        res.end()
      } catch (error) {
        console.log(error)
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    } else if (req.method === "DELETE") {
      try {
        await db.run("DELETE FROM Post WHERE id = ?", req.body.id)
        res.status(200).json({ code: 0, message: "行了" })
        res.end()
      } catch (error) {
        console.log("GET DB", error)
        res.status(500).json({ code: 1, message: "数据库出错了" })
        res.end()
      }
    } else if (req.method === "PUT") {
      try {
        await db.run("UPDATE Text SET content = ? WHERE post = ?", [
          req.body.content,
          req.body.id,
        ])
        await db.run("UPDATE Post SET date = ? WHERE id = ?", [
          new Date().getTime().toString(),
          req.body.id,
        ])
        res.status(200).json({ code: 0, message: "行了" })
        res.end()
      } catch (error) {
        console.log("GET DB", error)
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
