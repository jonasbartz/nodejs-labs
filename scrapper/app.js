const express = require('express');
const defaultRoutes = require('./routes/default');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(defaultRoutes);

app.listen(3000);