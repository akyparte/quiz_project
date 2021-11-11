let express = require('express');
let database = require('./database.js');
let homeRoute = express.Router();

homeRoute.use((req,res,next) => {
   if(req.session.user){
     next();
   }else {
      res.redirect('/');
   }
})


homeRoute.get('/',async (req,res) => {
        if(req.session.user.LOGGEDIN){
              let quizes = await database.getQuizNames(req.session.user.username);
              res.render('home',{
                quizes:quizes.quizNames,
                username:req.session.user.username,
            });
        }   
});


// it is going from here because it is dynamic
// it gets generated in real time
 homeRoute.get('/editPoppup',async (req,res) => {
 
     let quizNamesObject = await database.getQuizNames(req.session.user.username);
      res.render('editPoppup',{
        quizNames:quizNamesObject.quizNames
      })
 })

homeRoute.delete('/delete',async (req,res) => {
    let username = req.session.user.username;
    let quizName = req.query.quizName;
       let result = await database.deleteQuiz(username,quizName)
       if(result) res.sendStatus(200);
       else res.sendStatus(500);
})


module.exports = homeRoute;

