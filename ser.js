import express from 'express';
/* Importing SQL */
// import * as mysql from 'mysql';

const app = express();

/* Change the constants Here */
// const connection = mysql.createConnection({
//   host: 'DatabaseHost',
//   user: 'DatabaseUser',
//   password: 'DatabasePassword',
//   database: 'DatabaseName'
// });
//
// connection.connect((error: any) => {
//   if (!!error){
//     console.log('Error');
//   } else {
//     console.log('connected');
//   }
// });

app.use((req, res, next) => {
  /* For Cors Error */
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    console.log(`${req.ip} ${req.method} ${req.url}`);
    next();
  }
});
app.use(express.json());

app.get('/', (req, res) => {
  res.send({success: true, message: 'Server Ran Successfully'});
});

app.get('/example-get', (req, res) => {
  res.send({success: true, message: 'Example Get Is Running Properly'});
});


app.post('/example-post', (req, res) => {
    res.send({success: true, message: 'Example Post Is Running Properly'});
});

app.listen(4201, '127.0.0.1', () => {
  console.log('Server Listening on localhost:4201');
});
