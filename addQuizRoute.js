let express = require('express');
let database = require('./database.js');
let addRoute = express.Router();

addRoute.use((req,res,next) => {
   if(req.session.user){
     next();
   }else {
      res.redirect('/');
   }
})


addRoute.get('/',(req,res) => {
    let numOfQuestions = req.query.NOQ;
    let numOfOptions = req.query.NOO;
    let quizName = req.query.quizName;

    if(numOfQuestions <= 50 && numOfOptions <= 5 && quizName.length <= 50){
        res.render('add',{
            noq:numOfQuestions,
            noo:numOfOptions,
            qName:quizName,
            username:req.session.user.username
        });
    }else{
        res.sendStatus(400);
    }
    
     	
     
});

addRoute.post('/storeToDB',async (req,res) => {
    let quizName = req.body.quizName;
    let quizArray = req.body.quizArray;
    let result = await database.storeQuiz(req.session.user.username,quizName,quizArray);
    if(result)res.sendStatus(200);
    else res.sendStatus(404);
})


module.exports = addRoute;