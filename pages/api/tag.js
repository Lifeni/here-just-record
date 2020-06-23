const moment = require("moment")
const path = require("path")
const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

const { verify } = require("./token")

export default async function Post(req, res) {
  // console.log(req)
  if (req.cookies.auth && verify(req.cookies.auth)) {
    const db = await sqlite.open({
      filename: path.join(process.cwd(), "server/record.sqlite"),
      driver: sqlite3.Database,
    })

    if (req.method === "GET") {
      try {
        const tags = await db.all("SELECT * FROM Tag ORDER BY id DESC")
        res.status(200).json({ code: 0, message: "行了", data: tags })
        res.end()
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
    }
  }
}
