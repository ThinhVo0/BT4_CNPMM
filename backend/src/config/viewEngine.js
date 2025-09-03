const express = require('express');
const path = require('path');

const configViewEngine = (app) => {
  app.use(express.static(path.join('./src', 'public')));
  app.set('view engine', 'ejs');
  app.set('views', './src/views');
};

module.exports = { configViewEngine };