let express = require('express');
let homepageRouter = require('./homepageRoute.js');
let addQuizRouter = require('./addQuizRoute.js');
let editQuizRouter = require('./editQuizRoute.js');
let playQuizRouter = require('./playQuizRoute.js');
let scorepageRouter = require('./scorePageRoute.js');
let playersPageRouter = require('./playersPageRoute.js');
let database = require('./database.js');
let session = require('express-session');
let mongodbSession = require('connect-mongodb-session')(session)
let app = express();
let onlineUrl = 'mongodb+srv://akshayPP:Wisky%40mazza%40kutra@cluster0.idhhq.mongodb.net/quizUsers?retryWrites=true&w=majority';
let uri = 'mongodb://127.0.0.1:27017/quizUsers';

app.set('views','./views');
app.set('view engine','pug');

let store = mongodbSession({
    uri:onlineUrl,
    collection:'userSessions'
})

app.use(session({
    secret: "mynewproject",
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
    store,
}));

app.use(express.static('public'));
app.use(express.json());


app.get('/',(req,res) => {
    if(req.session.user){
        if(req.session.user.LOGGEDIN) res.redirect('/homepage'); 
    }else {
      res.sendFile('staticWebpages/login.html',{root:__dirname});
    }
    
});

app.use('/homepage',homepageRouter);
app.use('/addQuiz',addQuizRouter);
app.use('/editQuiz',editQuizRouter);
app.use('/playQuiz',playQuizRouter);
app.use('/scorepage',scorepageRouter);
app.use('/playerspage',playersPageRouter);


app.post('/login',async (req,res) => {
    if(req.session.user){
        if(req.session.user.LOGGEDIN) res.redirect('homepage');
    }else {
        let validUserPassword = await database.loginValidation(req.body.username,req.body.password);
    if(validUserPassword){
        req.session.user = {
            username:req.body.username,
            LOGGEDIN:true
        };
        res.json({passed:true});
    }else {
       res.json({passed:false});    
    }
    }
})

app.get('/logout',(req,res) => {
   
   req.session.destroy(function(err){
       if(err){
        res.sendStatus(500);
       }else res.sendStatus(200);
   })
   
})

app.post('/signup',async (req,res) => {
    if(req.session.user){
        if(req.session.user.LOGGEDIN) res.redirect('homepage');
    }else {
        let userExist = await database.validateUser(req.body.username);
    if(userExist){
        res.json({
            allowed:false,
             message:'user already exist'
         })
    }else {
        let newUser = database({
            username:req.body.username.trim().toLowerCase(),
            password:await database.hashPassword(req.body.password),
            email:req.body.email
        });

        newUser.save().then((d) => {
           if(d){res.json({allowed:true})} 
        })
    }

    }
    
});

// this is how i am going to practice



app.listen(4000);