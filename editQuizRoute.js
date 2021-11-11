let express = require('express');
let editRoute = express.Router();
let database = require('./database.js');

editRoute.use((req,res,next) => {
   if(req.session.user){
     next();
   }else {
      res.redirect('/');
   }
})


editRoute.get('/',async (req,res) => {
    let quizName = req.query.quizName;
    let quizArray = await database.getQuiz(req.session.user.username,quizName);
    let numOfOptions;
    if(quizArray.length > 0)numOfOptions = Object.keys(quizArray[0]).length-2;
    
    if(quizArray.length !== 0){
       res.render('editPage',{
          quizName:quizName,
          numOfOpt:numOfOptions,
          quizArray:quizArray,
          username:req.session.user.username
       });
    }else {
        res.sendStatus(400);
    }
    

});


editRoute.post('/storeEditedQuiz',async (req,res) => {
    let quizName = req.body.quizName;
    let quizArray = req.body.quizArray;
    let username = req.session.user.username;
   let result = await database.updateEditedQuiz(username,quizName,quizArray);
   if(result) res.sendStatus(200);
   else res.sendStatus(500);
})


module.exports = editRoute;