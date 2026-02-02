const admin = require("../config/firebaseAdmin")

const firebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" })
    }

    const token = authHeader.split(" ")[1]

    const decodedToken = await admin.auth().verifyIdToken(token)

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      provider: decodedToken.firebase?.sign_in_provider || null
    }

    next()
  } catch (error) {
    console.error("🔥 FirebaseAuth ERROR 🔥", error)
    return res.status(401).json({ message: "Invalid token" })
  }
}

module.exports = firebaseAuth
