const admin = require("../config/firebaseAdmin")

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" })
    }

    const token = authHeader.split("Bearer ")[1]

    const decoded = await admin.auth().verifyIdToken(token)

    // 🔥 AQUÍ GUARDAS EL USUARIO
    req.user = decoded

    next()
  } catch (error) {
    console.error("❌ Error verificando token:", error)
    return res.status(401).json({ error: "Unauthorized" })
  }
}

module.exports = verifyToken