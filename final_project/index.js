const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const secretKey = 'sample_secret_key';

app.use(express.json());

app.use("/customer",
    session({
        secret: "fingerprint_customer", resave: true, saveUninitialized: true,
    })
);

app.use("/customer/auth/*",
    function auth(req, res, next) {
        let token;

        // セッションからトークンを取得
        if (req.session.authorization) {
          token = req.session.authorization['accessToken'];
        } else {
          // ヘッダーからトークンを取得
          const authHeader = req.headers['authorization'];
          if (authHeader) {
            // "Bearer "を削除してトークンを取得
            token = authHeader.split(' ')[1];
          }
        }
      
        // トークンがない場合はエラーを返す
        if (!token) {
          return res.status(403).json({ message: "User not logged in" });
        }
      
        // JWTトークンを検証
        jwt.verify(token, secretKey, (err, user) => {
          if (!err) {
            req.user = user;
            next(); // 次のミドルウェアへ
          } else {
            return res.status(403).json({ message: "User not authenticated" });
          }
        });
    }
);
 
const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
