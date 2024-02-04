var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const authRouter = require('./routes/web/auth');
const accountRouter = require('./routes/api/account');

var app = express();

// 设置session的中间件，该配置需要在引入路由之前
const dbConfig = require('./config/db');
app.use(session({
  // 设置cookie的name
  name: 'sessionId',
  // 加盐
  secret: 'songyx',
  // 是否为每次请求都设置一个cookie用来存储session的id
  saveUninitialized: false,
  // 是否在每次请求时重新保存session
  resave: true,
  // 连接数据库
  store: MongoStore.create({ mongoUrl: `mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.name}` }),
  cookie: {
    // 前端无法通过JS操作
    httpOnly: true,
    // 过期时间，1min
    maxAge: 1000 * 60,
  },
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设置路由前缀
app.use('/api', accountRouter);
app.use('/', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;