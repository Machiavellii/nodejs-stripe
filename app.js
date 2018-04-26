const express = require('express');
const keys = require('./config/keys')
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');


const app = express();

//HandleBars Middleware

app.engine('handlebars', exhbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//Set Static folder 
app.use(express.static(`${__dirname}/public`));

//Index Route

app.get('/', (req, res) => {
    res.render('index', {
        stripePublishableKey: keys.stripePublishableKey
    });
});


//Charge Route
app.post('/charge', (req, res) => {
    const amount = 2500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount, 
        description : 'Web Development',
        currency: 'usd',
        customer: customer.id
    }))
    .then(charge => res.render('success'))
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});