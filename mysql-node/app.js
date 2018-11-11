const express = require('express');
const mysql   = require('mysql');
const bodyParser = require('body-parser');
// Creating Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'nodemysql'
});

db.connect(function(err){
  if(err){
    console.log("There is an error ",err);
  }
  else{
    let user = `create table if not exists USER(
                          user_id varchar(255) primary key,
                          family_id varchar(255),
                          universe_id varchar(255),
                          power int not null
                      )`;
    db.query(user,function(err,result){
          if(err){
            console.log("error in creating user table",err);
          }
          else{
            console.log("user table created successfully****");
          }
    });
    console.log("mysql connectd");
  }
});

const app     = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Table structures
// USER -> id, family_id, universe_id, power
// FAMILY -> id
// UNIVERSE -> id

// TODO APIs:
// API to store user data EXPECTING user_id, family_id, universe_id and Power
// and store in the tables.
// Algorithm: Insert into USER table, data provided
// sample object to be passed to insert into the table : {"family_id": 1,"universe_id":1,"power": 4}
// 1. API to list the families in a universe.
// Expects a universe ID. Returns a dictionary with family_id mapped to data
// of all users with that family id
// Algorithm: 1. Fetch all users from USER table whose universe_id == passed universe ID.
//            2. Create an empty dictionary (say, ret)
//            3. Iterate over each user data from step 1, and insert into
//               dictionary for key user.family_id
//            4. Return dictionary ret from step 2

// 2. Check if families are balanced (have same power)
// Expects nothing. Returns family_id mapped to True/False depending if that
// family is balanced or not.
// Algorithm: 1. Fetch all users
//            2. Create empty dictionary (say, D)
//            3. Iterate over each user data from step 1, add user.power to D[user.family_id][user.universe_id].
//family_id_1 -> universe_id_1 -> total power
            //-> universe_id_2 -> total power
//family_id_2 -> universe_id_1 -> total power
            //-> universe_id_2 -> total power
//            4. Create an empty dictionary (say, ret)
//            5. Iterate over the dictionary from step 3, and for each
//               family_id, check that each universe_id has same total power.
//               Then insert True or False accordingly into dictionary ret with family_id as key
//            6. Return dictionary ret from step 4.


// This API takes parameter family_id,universe_id and power as parameter and inserts the data in USER table.Example body in the post request: {"family_id": 1,"universe_id":1,"power": 4}
app.post('/insertUser',function(req,res){
  console.log("the request is ",req.body);
  let user = {};
  user.family_id = req.body.family_id;
  user.universe_id = req.body.universe_id;
  user.power = req.body.power;
  console.log("the user is ",user);
  let sql = 'INSERT INTO USER SET ?';
  let query = db.query(sql,user,function(err,result){
    if(err){
      console.log("there is some error in inserting user",err);
    }
    else{
      console.log("user inserted into db",result);
      res.send(result);
    }
  });

});

// This API list the families in a universe.Expects a universe ID. Returns a dictionary/object with family_id mapped to data
// of all users with that family id
app.post('/listFamily',function(req,res){
  console.log("the request is ",req.body);
  let requestedUniverseId = req.body.universe_id;
  console.log("the requestedUniverseId is ",requestedUniverseId);
  let sql = 'SELECT * FROM user WHERE universe_id = ?';
  let query = db.query(sql,requestedUniverseId,function(err,result){
    if(err){
      console.log("there is some error in listing user family",err);
    }
    else{
      console.log("the family for requested universe Id is",result);
      let ret = {};
      for (var idx = 0; idx < result.length; idx++) {
        var user = result[idx];
        if (!(user.family_id in ret)) {
          ret[user.family_id] = [];
        }
        let data = {'id': user.id, 'family_id': user.family_id,
                    'universe_id': user.universe_id, 'power': user.power};
        ret[user.family_id].push(data);
      }
      console.log('ans', ret);
      res.send(ret);
    }
  });

});

//This API Checks if families are balanced (have same power)
// Expects nothing. Returns family_id mapped to True/False depending if that
// family is balanced or not.
app.get('/checkBalanced', function(req,res){
  let sql = 'SELECT * FROM user';
  let query = db.query(sql,function(err,result){
    if(err){
      console.log("some error occured in fetching user",err);
    }
    else{
      console.log("all users returned ",result);
      // Init a dict mapping family_id to dict of universe_id and total power
      let family_data = {};
      for (var idx = 0; idx < result.length; idx++) {
        var user = result[idx];
        if (!(user.family_id in family_data)) {
          // family_id not present, insert empty dict
          family_data[user.family_id] = {};
        }
        if (!(user.universe_id in family_data[user.family_id])) {
          // universe_id not present for this family_id, insert with 0 power
          family_data[user.family_id][user.universe_id] = 0;
        }
        // Increment the power for given family_id, universe_id pair
        family_data[user.family_id][user.universe_id] += parseInt(user.power);
      }
      // Iterate over family_data dictionary and store if families are balanced
      let ret = {};
      for (var family_id in family_data) {
        if (family_data.hasOwnProperty(family_id)) {
          let allPowers = Object.keys(family_data[family_id]);
          let power = allPowers[0];
          let balanced = true;
          for (var idx = 1; idx < allPowers.length; idx++) {
            if (allPowers[idx] !== power) {
              balanced = false;
              break;
            }
          }
          ret[family_id] = balanced;
        }
      }
      console.log(family_data);
      console.log(ret);
      res.send(ret);
    }
  });

});

app.listen('3000',() => {
  console.log("server started and running on port 3000");
});
