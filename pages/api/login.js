import fs from "fs"
import path from "path"
import jwt from "jsonwebtoken"
import cookie from "cookie"

const password = path.join(process.cwd(), "configs/password.json")
const config = path.join(process.cwd(), "configs/config.json")
const passwordData = JSON.parse(fs.readFileSync(password))
const configData = JSON.parse(fs.readFileSync(config))

export default (req, res) => {
  res.statusCode = 200
  if (req.body.password === passwordData.loginPassword) {
    const token = jwt.sign(
      { time: new Date().getTime() },
      passwordData.jwtPassword,
      {
        expiresIn: "1h",
      }
    )
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 3600,
        path: "/",
      })
    )
    res.json({
      code: 0,
      message: "登录成功",
      data: configData,
    })
  } else {
    res.json({
      code: 1,
      message: "密码错误",
    })
  }
}
