const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const ejs = require('ejs');
const db = require('./services/database.js');
const ws = require('./services/websockets');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

const fileUpload = require('express-fileupload');
app.use(fileUpload({createParentPath: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
