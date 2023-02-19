const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const ipRoutes = require('./routes/ipRoutes');
require('dotenv').config();

app.use(express.json());

// JWT authentication middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[0];
    jwt.verify(token, process.env.access_TOKEN_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    console.log(err);
    res.sendStatus(401);
  }
};

app.use('/ip', authenticateJWT, ipRoutes);

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`API Server is listening on port ${PORT}`);
});
