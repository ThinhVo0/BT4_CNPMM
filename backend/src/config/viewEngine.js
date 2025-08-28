import express from 'express';
import path from 'path';

export const configViewEngine = (app) => {
  app.use(express.static(path.join('./src', 'public')));
  app.set('view engine', 'ejs');
  app.set('views', './src/views');
};