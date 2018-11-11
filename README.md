# Recko-Assignment
APIs for the Assignment Using Node and MySql

Prerequisites: You will need to install mysql and nodejs.The assignment will run on localhost server port 3000.
NOTE: You can find the small dump/seed to test the APIs.The dump file name is reckodump.sql(its inside the mysql-node folder of this assignment).

Table structure:
USER -> id, family_id, universe_id, power.
USER:(sample table)
+----+-----------+-------------+-------+
| id | family_id | universe_id | power |
+----+-----------+-------------+-------+
|  1 | 1         | 1           |     4 |
|  2 | 2         | 3           |     5 |
|  3 | 2         | 1           |     6 |
|  4 | 2         | 1           |     7 |
|  5 | 3         | 1           |     6 |
+----+-----------+-------------+-------+

Schema For The User Table:
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int(11)      | NO   | PRI | NULL    | auto_increment |
| family_id   | varchar(255) | YES  |     | NULL    |                |
| universe_id | varchar(255) | YES  |     | NULL    |                |
| power       | int(11)      | NO   |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+

APIs:

 API to store user data EXPECTING  family_id, universe_id and Power
 and store in the tables.
 Algorithm: Insert into USER table, data provided
 sample object to be passed to insert into the table : {"family_id": 1,"universe_id":1,"power": 4}
 1. API to list the families in a universe.
 Expects a universe ID. Returns a dictionary with family_id mapped to data
 of all users with that family id
 Algorithm: 1. Fetch all users from USER table whose universe_id == passed universe ID.
            2. Create an empty dictionary (say, ret)
            3. Iterate over each user data from step 1, and insert into
               dictionary for key user.family_id
            4. Return dictionary ret from step 2
  
 2. Check if families are balanced (have same power)
 Expects nothing. Returns family_id mapped to True/False depending if that
 family is balanced or not.
 Algorithm: 1. Fetch all users
            2. Create empty dictionary (say, D)
            3. Iterate over each user data from step 1, add user.power to D[user.family_id][user.universe_id].
family_id_1 -> universe_id_1 -> total power
            -> universe_id_2 -> total power
family_id_2 -> universe_id_1 -> total power
            -> universe_id_2 -> total power
            4. Create an empty dictionary (say, ret)
            5. Iterate over the dictionary from step 3, and for each
               family_id, check that each universe_id has same total power.
               Then insert True or False accordingly into dictionary ret with family_id as key
            6. Return dictionary ret from step 4.
            

Can Test The APIs using PostMan:
The endpoints are:
APIs : 1. '/insertUser': This API takes parameter family_id,universe_id and power as parameter and inserts the data in USER table.
Example body in the post request: {"family_id": 1,"universe_id":1,"power": 4}
2. '/listFamily': This API list the families in a universe.Expects a universe ID. Returns a dictionary/object with family_id mapped to data of all users with that family id.
3. '/checkBalanced': This API Checks if families are balanced (have same power)
 Expects nothing. Returns family_id mapped to True/False depending if that
 family is balanced or not.
