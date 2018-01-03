/*globals require, console, process */

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Bear = require('./bear');

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
    // accessed at POST http://localhost:8080/api/user
    .post(function (req, res) {
        // create a new instance of the User model
        var user = new User();
        // set the bears name (comes from the request)
        user.uid = req.body.uid;
        user.user_name = req.body.user_name;
        user.user_sur = req.body.user_sur;
        user.psw = req.body.psw;

        // save the bear and check for errors
        user.save(function (err) {
            if (err) { res.send(err); }
            res.json(user);
        });//closesave
      })//closepost

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
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    //INDIRIZZA LA CHIAMATA AI MIDDLEWARE SUCCESSIVI
    next();
});

// register our router on /api
//SI PER REINDERIZZARE LE CHIAMATE ad API a ROUTE
app.use('/api', router);

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
console.log('Server arrivo sulla porta: ' + port);
