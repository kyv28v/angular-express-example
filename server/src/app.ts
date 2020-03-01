import {NextFunction, Request, Response} from 'express';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');

import { tokenConf } from './config/common';

const indexRouter = require('./api/index');
const dbRouter = require('./api/common/db');
const authRouter = require('./api/common/auth');

const app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// API呼び出しのログ出力
app.use('/api/*', async (req: any, res: any, next: any) => {
  console.log('===== API Called. req=' + req.originalUrl + ', body=' + JSON.stringify(req.body));
  next();
});

// Expressのルーティング（認証不要のもの）
app.use('/api/', indexRouter);
app.use('/api/common/auth', authRouter);

// トークンの正常チェック
app.use('/api/*', async (req: any, res: any, next: any) => {
  const token = req.headers['access-token'];
  if (!token) {
    res.status(401);
    return res.json({message: 'No token provided'});
  }
  try {
    const decoded = await jwt.verify(token, tokenConf.accessTokenSecretKey);
    req.decoded = decoded;
    next();
  } catch (e) {
    res.status(401);
    return res.json({message: e.message});
  }
});

// Expressのルーティング（認証が必要なもの）
app.use('/api/common/db', dbRouter);

// Angularのルーティング
app.use(express.static(path.join(__dirname, '../../front/dist')));
app.use('/*', express.static(path.join(__dirname, '../../front/dist/index.html')));

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
