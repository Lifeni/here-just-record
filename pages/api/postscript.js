const path = require("path")
const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

const { verify } = require("./token")

export default async function PostScript(req, res) {
  if (req.cookies.auth && verify(req.cookies.auth)) {
    const db = await sqlite.open({
      filename: path.join(process.cwd(), "server/record.sqlite"),
      driver: sqlite3.Database,
    })

    if (req.method === "POST") {
      try {
        await db.run(
          "INSERT INTO PostScript (post, date, content) VALUES (?, ?, ?)",
          [
            req.body.id,
            new Date().getTime().toString(),
            req.body.content ? req.body.content : 0,
          ]
        )

        res.status(200).json({ code: 0, message: "行了" })
        res.end()
      } catch (error) {
        console.log(error)
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
