import fs from "fs"
import path from "path"
import jwt from "jsonwebtoken"

const password = path.join(process.cwd(), "configs/password.json")
const passwordData = JSON.parse(fs.readFileSync(password))

export function verify(token) {
  return jwt.verify(token, passwordData.jwtPassword)
}

export default (req, res) => {
  jwt.verify(
    req.cookies.auth,
    passwordData.jwtPassword,
    async (err, decoded) => {
      if (!err && decoded) {
        res.status(200).json({ code: 0, message: "可以" })
        res.end()
      } else {
        res.status(401).json({ code: 1, message: "身份验证不通过" })
        res.end()
      }
    }
  )
}
