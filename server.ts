var express = require('express')
var app = express()
var mysql = require("mysql")
const bcrypt=require('bcrypt');

const saltRounds=10;


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

var conn = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"car-rental-system"
});


/*------------------------- HOME PAGE -------------------------*/

app.get('/', (req, res) => {
  res.send({success: true, message: 'Server Ran Successfully'});
});


/*------------------------- USER API's -------------------------*/

app.post('/user-login', (req, res) => {

  const username=req.body.email;
  const password=req.body.password;

  conn.query("SELECT  * FROM userstable WHERE email=? and status = 1", username, (err,result)=>{
        if (err) throw err;

        if(result.length > 0){
            bcrypt.compare(password,result[0].password,(error,response)=>{
                if(response){
                 const id=result[0].user_id

                 res.send({success: true, data: result});
                }
                else{
                    res.send({success: false, message: "Wrong Email/password"}); 
                }
            })
        }
        else{
            res.send({success: false, message: "User doesnt exist"});
        }
    });
});


app.post('/user-register', (req, res) => {

  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  const licenceno = req.body.licenceno;
  const adharno = req.body.adharno;
  const status = 1;

  var sql = "SELECT * FROM userstable WHERE email = '"+email+"' or phone = "+phone;
  conn.query(sql,(err,result)=>{
    if (err) throw err;

    if(result.length > 0){
    res.send({success: false, message: "Record Exit"});
    }else{

      bcrypt.hash(password,saltRounds,(err,hash)=>{
        conn.query("INSERT INTO userstable (name,email,phone,password,status,licenceno,adharno) values (?,?,?,?,?,?,?)", [name, email, phone, hash, status, licenceno, adharno], (err1,result1)=>{
            if (err1) throw err1;

            res.send({success: true, message: "user-register"});
        });
    })
    }
  });

});


app.post('/user-delete/:user_id', (req, res) => {

  const id = req.params.user_id;
  
  var sql = "DELETE FROM userstable WHERE user_id = "+id;
  conn.query(sql,(err,result)=>{
    if (err) throw err;

    res.send({success: true, message: 'user-delete'});
  })
  
});


app.post('/user-update/:user_id', (req, res) => {
  
  const id = req.params.user_id;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const licenceno = req.body.licenceno;
  const adharno = req.body.adharno;

  conn.query("SELECT  * FROM userstable WHERE (email=? or phone = ?) and user_id !=?", [email, phone, id] , (err,result)=>{
        if (err) throw err;

        if(result.length > 0){   
          res.send({success: false, message: "Email/Phone Exit"});       
        }
        else{

            var sql1 = "UPDATE userstable SET name = ?, email = ?, phone = ?, licenceno = ?, adharno = ?  WHERE user_id = "+id;
            conn.query(sql1,[name, email, phone, licenceno, adharno],(err1,result1)=>{
            if (err1) throw err1;
            
            res.send({success: true, message: 'user-update'});
          })
        }
    });
});


app.post('/user-changePass/:user_id', (req, res) => {

  const id = req.params.user_id;
  const password = req.body.password;

  bcrypt.hash(password,saltRounds,(err,hash)=>{
    conn.query("UPDATE userstable SET password = ? WHERE user_id = ?", [hash, id], (err1,result1)=>{
      if (err1) throw err1;

        res.send({success: true, message: 'user-changePass'});
      }); 
    }); 
});


app.post('/user-forgotPass/:user_id', (req, res) => {

  const id = req.params.user_id;
  res.send({success: true, message: 'user-forgotPass'}); 
});


app.get('/user-get/:user_id', (req, res) => {

  const id = req.params.user_id;

  var sql = "SELECT * FROM userstable WHERE user_id = "+id+" and status = 1";
  conn.query(sql,(err,result)=>{
    if (err) throw err;
    res.send({success: true, data: result});
  });

});


/*------------------------- CAR API's -------------------------*/

app.get('/car-get/:car_id', (req, res) => {
 
  const id = req.params.car_id;

  var sql = "SELECT * FROM cartable WHERE car_id = "+id+" and status = 1";
  conn.query(sql,(err,result)=>{
    if (err) throw err;
    res.send({success: true, data: result});
  });

});


app.get('/car-gets', (req, res) => {

  var sql = "SELECT * FROM cartable WHERE status = 1";
  conn.query(sql,(err,result)=>{
    if (err) throw err;
    res.send({success: true, data: result});
  });

});


/*------------------------- CAR BOOK API's -------------------------*/

app.post('/car-book/:user_id/:car_id', (req, res) => {
  
  const uid = req.params.user_id;
  const cid = req.params.car_id;
  const price = req.body.price;
  const from_date = req.body.from_date;
  const to_date = req.body.to_date;
  const status = 1;

  var sql = "INSERT INTO carbooktable(user_id,car_id,price,from_date,to_date,status) VALUES(?,?,?,?,?,?)";
  conn.query(sql,[uid,cid,price,from_date,to_date,status],(err,result)=>{
    if (err) throw err;

    res.send({success: true, message: 'car-book'});
  })  
});


app.get('/book-car/:carbook_id', (req, res) => {
  
  const id = req.params.carbook_id;

  var sql = "SELECT * FROM carbooktable WHERE carbook_id = "+id+" and status = 1";
  conn.query(sql,(err,result)=>{
    if (err) throw err;
    res.send({success: true, data: result});
  });

});

app.get('/car-books', (req, res) => {
  
  var sql = "SELECT * FROM carbooktable WHERE status = 1";
  conn.query(sql,(err,result)=>{
    if (err) throw err;
    res.send({success: true, data: result});
  });

});


/*------------------------- FEEDBACK API's -------------------------*/

app.post('/feedback', (req, res) => {
  
  const email = req.body.email;
  const feedback = req.body.feedback;
  const status = 1;

  var sql = "INSERT INTO feedbacktable(email,feedback,status) VALUES(?,?,?)";
  conn.query(sql,[email,feedback,status],(err,result)=>{
    if (err) throw err;
    res.send({success: true, message: 'feedback'})
  })
});


/*------------------------- PAYMENT API's -------------------------*/

app.post('/payment/:carbook_id', (req, res) => {

  const cid = req.params.carbook_id;
  const payment_method = req.body.payment_method;
  const payment = req.body.payment;
  const status = 1;

  var sql = "INSERT INTO paymenttable(carbook_id,payment_method,payment,status) VALUES(?,?,?,?)";
  conn.query(sql,[cid,payment_method,payment,status],(err,result)=>{
    if (err) throw err;

    var sql1 = "UPDATE carbooktable SET status = 0 WHERE carbook_id = "+cid;
    conn.query(sql1,(err1,result1)=>{
    if (err1) throw err1;

    res.send({success: true, message: 'payment'});
    })
  })

  
});


/*------------------------- NOTIFICATION API's -------------------------*/

app.get('/notifications', (req, res) => {
  
  var sql = "SELECT * FROM notificationtable WHERE status = 1";
  conn.query(sql,(err,result)=>{
    if (err) throw err;
    res.send({success: true, data: result});
  });
  
});


/*------------------------- DEFAULT PAGE -------------------------*/

app.get('/*', (req, res) => {
    res.send({success: true, message: '404 Page Not Found!!!!!!!!!!!!!!'});
});



/*------------------------- PORT -------------------------*/

app.listen(4201, '127.0.0.1', () => {
  console.log('Server Listening on localhost:4201');
});

