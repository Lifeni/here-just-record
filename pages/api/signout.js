import cookie from "cookie"
export default (req, res) => {
  try {
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("auth", "signout", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    )
    res.status(200).json({ code: 0, message: "可以" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ code: 1, message: "服务器出错了" })
  }
  res.end()
}
