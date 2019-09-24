const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const AcuatorDriver = require('./classes/actuator');

// Initialize App
const app = express();

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// DB config
db = require('./config/private/database');

// Connect to Database
mongoose.connect(db.mongoURI, { useNewUrlParser: true })
    .then(() => console.log('Connected to the Database...'))
    .catch(err => console.error(err));

// PORT
const port = process.env.PORT || 8080;

// LOAD Actuator model
require('./models/Actuator');
const Actuator = mongoose.model('actuators');

// MIDLEWARE

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

// Method Override with POST having ?_method = PUT and delete
app.use(methodOverride('_method'));

// ROUTES
app.get('/', (req, res) => {
    Actuator.find()
        .then(actuators => res.send(JSON.stringify(actuators)))
        .catch(err => console.error(err));
});

app.get('/:id', (req, res) => {
    Actuator.findById(req.params.id)
        .then(actuator => { res.send(JSON.stringify(actuator)) })
        .catch(err => { console.error(err) });
});

app.put('/:id/toggle', (req, res)=>{
    Actuator.findById(req.params.id)
        .then(actuator => {
            console.log(actuator);
            let act = new AcuatorDriver(actuator);
            act.toggleStatus()
            act.modelObj.save()
                .then(res.send(JSON.stringify(act.modelObj)))
                .catch(err => console.error(err));
        })
        .catch(err => { console.error(err) });
});

// MAIN
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});