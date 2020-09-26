var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var mecab = require('mecab-ya');
var text = '[강릉시청]송파구335번관련 역학조사결과(CCTV등 정밀확인)접촉자8명, 능동감시150명(강릉62,타지96)연락조치완료, 해당음식점 방역수칙철저준수확인하였습니다.';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


mecab.pos(text, function (err, result) {
  let isAdd, hasNumber, number;
  console.log(result);
  for(var i=0; i<result.length; i++) {
    if(result[i][0] == '발생') {
      isAdd = true;
    }
    if(result[i][0] == '명' && result[i][1] == 'NNBC') {
      hasNumber = true;
    }
    if(result[i][1] == 'SN' && result[i+1][0] == '명') {
      number = result[i][0];
    }
  }
  if(isAdd && hasNumber) {
    console.log("New Infection: " + number);
  }

});

mecab.morphs(text, function (err, result) {
  console.log(result);
});

mecab.nouns(text, function (err, result) {
  console.log(result);
});

module.exports = app;
