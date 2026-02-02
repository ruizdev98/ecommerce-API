const User = require("../models/User")

const syncUser = async (req, res) => {
  try {
    if (!req.user) {
      console.log("REQ.USER =>", req.user)
      return res.status(401).json({ error: "User not authenticated" })
    }

    const { uid, email, name } = req.user

    const existingUser = await User.findById(uid)

    if (!existingUser) {
      await User.create({
        id: uid,
        email,
        first_name: name || null,
        last_name: null
      })
    }

    return res.json({ ok: true })
  } catch (error) {
    console.error("SYNC USER ERROR:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

module.exports = { syncUser }
