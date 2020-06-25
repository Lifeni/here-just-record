const sqlite = require("sqlite")
const sqlite3 = require("sqlite3")

;(async () => {
  // open the database
  const db = await sqlite.open({
    filename: "./record.sqlite",
    driver: sqlite3.Database,
  })

  await db.migrate({ force: true })

  // debug
  // const post = await db.all("SELECT * FROM TextList")
  // console.log("Post", JSON.stringify(post, null, 4))
})()
