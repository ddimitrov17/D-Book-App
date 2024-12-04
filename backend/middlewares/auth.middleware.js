const jwt = require('jsonwebtoken');
const { db } = require("../database/database");

async function authenticateToken(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
          return res.status(401).json({ error: "No Token Provided" });
        }
    
        const verification = jwt.verify(token, process.env.JWT_SECRET);
        if (!verification) {
          return res.status(401).json({ error: "Invalid Token" });
        }
    
        const queryText = 'SELECT * FROM users WHERE id = $1';
        const values = [verification.id];
        const result = await db.query(queryText, values);
    
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }
    
        const user = result.rows[0];
        delete user.password;
    
        req.user = user;
        next();
      } catch (error) {
        console.log("Error in middleware", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
}

module.exports = {
    authenticateToken
}