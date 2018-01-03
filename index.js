/*globals require, console, process */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./user');
var Room = require('./room');
var Msg = require('./msg');


// instanzio express
const app = express();

// instanzio mongoose
mongoose.Promise = global.Promise;
/*var options = {
    useMongoClient: true,
    user: 'test',
    pass: 'test'
  };*/
mongoose.connect('mongodb://admin:admin@ds135817.mlab.com:35817/prova_chat'/*, options*/);
const db = mongoose.connection;
db.on('error', err => {
  console.error(`Error while connecting to DB: ${err.message}`);
});
db.once('open', () => {
  console.log('DB connected successfully!');
});


// configuro app per usare bodyParser()
// Cosi possiamo ottenere dai dalla POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// settiamo la porta
var port = process.env.PORT || 8080;


// creiamo un instanza di express Router
var router = express.Router();



// route /user
router.route('/user')
    // accessed at POST http://localhost:8080/api/chat/user
    .post(function (req, res) {
        // create a new instance of the User model
        var user = new User();

        user.uid = req.body.uid;
        user.user_name = req.body.user_name;
        user.user_sur = req.body.user_sur;
        user.psw = req.body.psw;

        // save the user and check for errors
        user.save(function (err, uCreated) {
            if (err) { res.status(500).send(err); }
            res.status(200);
            res.json(uCreated);
        });//closesave
    })//closepost
    // accessed at PUT http://localhost:8080/api/chat/user
    .put(function (req, res){
        //User.findById(req.body.id, function (err, user_r){
        User.findOne({ uid: req.body.uid}, function (err, user_r){
          if (err) {res.status(500).send(err);}
          if( user_r) {
              user_r.user_name = req.body.user_name || user_r.user_name;
              user_r.user_sur = req.body.user_sur || user_r.user_sur;
              user_r.psw = req.body.psw || user_r.psw;

              // save the user and check for errors
              user_r.save(function (err, uUpdate) {
                  if (err) { res.status(500).send(err); }
                  res.status(200);
                  res.json(uUpdate);
              });//closesave
          }//closif user_su
          //caso in cui non ci sia alcuna risorsa con l'uid ricercato
          else {
            res.status(404);
            res.json({ message: 'User not found' });
          }
        });//closefind
    });//closeput


// route /user
router.route('/user/:_id')
  // get the user with that id (es 5a4cf2499b24d50564fe00b5)
  // (accessed at GET http://localhost:8080/api/chat/user/:_id)
  .get(function(req, res){
        User.findById(req.params._id, function (err, user) {
              if (err) { res.status(500).send(err); }
              if (user) { res.json(user); res.status = 200; }
              else {res.status(404); res.json({ message: 'User not found' });}
          });
  })//closeget
  .put(function (req, res){
      User.findById(req.params._id, function (err, user_r){
        if (err) {res.status(500).send(err);}
        if( user_r) {
            user_r.user_name = req.body.user_name || user_r.user_name;
            user_r.user_sur = req.body.user_sur || user_r.user_sur;
            user_r.psw = req.body.psw || user_r.psw;

            // save the user and check for errors
            user_r.save(function (err, uUpdate) {
                if (err) { res.status(500).send(err); }
                res.status(200);
                res.json(uUpdate);
            });//closesave
        }//closif user_su
        //caso in cui non ci sia alcuna risorsa con l'uid ricercato
        else {
          res.status(404);
          res.json({ message: 'User not found' });
        }
      });//closefind
  });//closeput

  // route /room
  router.route('/room')
      // accessed at POST http://localhost:8080/api/chat/room
      .post(function (req, res) {
          // create a new instance of the Room model
          var room = new Room();

          room.rid = req.body.rid;
          room.room_name = req.body.room_name;
          // save the room and check for errors
          room.save(function (err, rCreated) {
              if (err) { res.status(500).send(err); }
              res.status(200);
              res.json(rCreated);
          });//closesave
      })//closepost

      // accessed at PUT http://localhost:8080/api/chat/room
      .put(function (req, res){
          //Room.findById(req.body._id, function (err, room_p){
          Room.findOne({ rid: req.body.rid}, function (err, room_p){
            if (err) {res.status(500).send(err);}
            if (room_p) {
                room_p.room_name = req.body.room_name || room_p.room_name;

                // save the room and check for errors
                room_p.save(function (err, rUpdate) {
                    if (err) { res.status(500).send(err); }
                    res.status(200);
                    res.json(rUpdate);
                });//closesave
            }//closif user_su
            //caso in cui non ci sia alcuna risorsa con l'uid ricercato
            else {
              res.status(404);
              res.json({ message: 'Room not found' });
            }
          });//closefind
      });//closeput

    // route /rooms
    router.route('/rooms')
        // accessed at GET http://localhost:8080/api/chat/rooms
        .get(function (req, res) {
            Room.find(function (err, rooms) {
                if (err) { res.status(500).send(err); }
                if (rooms) { res.json(rooms); res.status = 200; }
                else {res.status(404); res.json({ message: 'Rooms not found' });}
            });

        });

    // route /msg
    router.route('/msg')
        // accessed at POST http://localhost:8080/api/chat/msg
        .post(function (req, res) {
            // create a new instance of the Room model
            var msg = new Msg();

            msg.uid = req.body.uid;
            msg.rid = req.body.rid;
            msg.content = req.body.content;
            msg.date = new Date().toLocaleDateString();
            // save the msg and check for errors

            //if(User.findById(req.body.uid).limit(1).size() != 0 && Room.findById(req.body.rid).limit(1).size() != 0){
              msg.save(function (err, mCreated) {
                  if (err) { res.status(500).send(err); }
                  res.status(200);
                  res.json(mCreated);
              });//closesave
            //}

        });
        //closepost


    router.route('/msg')
      .get(function (req, res){

          console.log("qd: " + req.query.time+ ",qr " + req.query.room);
          Msg.find({date : req.query.time , rid : req.query.room }, function (err, msg) {
              if (err) { res.status(500).send(err); }
              if (msg) { res.json(msg); res.status = 200; }
              else {res.status(404); res.json({ message: 'Msg not found' });}
          });
      });


/*
router.route('/msg?room=:rid?time=:date')

    .get(function (req, res) {
        //GET /msg?room=x?time=x

        Msg.find({"date" : req.params.date , "rid" : req.params.rid }, function (err, msg) {
            if (err) { res.status(500).send(err); }
            if (msg) { res.json(msg); res.status = 200; }
            else {res.status(404); res.json({ message: 'Msg not found' });}
        });
    });


*/





//user paolo 5a4cec6f22245b0546f3d01d
//user stefano 5a4cf2499b24d50564fe00b5
//SET UP di CORSO e PREFLIGHT
app.use(function (req, res, next) {

    console.log('Richiesta ricevuta.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*'); //* IL BROWSER RISPONDE COSI A TUTTI I DOMINI. POSSO ANCHE SPECIFICARE DOMINI PRECISI
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    //OPERAZIONI DI SCRUTTURA - PREFLIGHT
    if (req.method == 'OPTIONS') {
        //IL SERVER DEVE RISPONDERE TUTTI I METODI SUPPORTATI DALL'INDIRIZZO
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    //INDIRIZZA LA CHIAMATA AI MIDDLEWARE SUCCESSIVI
    next();
});

// register our router on /api
//SI PER REINDERIZZARE LE CHIAMATE ad API a ROUTE
app.use('/api/chat', router);

// handle invalid requests and internal error
//l'ordine in cui definiamo le chiamate è importante, vengono usate in ordine in cui le abbiamo dichiarate
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

app.listen(port);
console.log('Server attivo sulla porta: ' + port);
