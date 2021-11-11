let express = require('express');
let database = require('./database.js');
let scoreRoute = express.Router();



scoreRoute.use((req,res,next) => {
   if(req.session.user){
     next();
   }else {
      res.redirect('/');
   }
})

scoreRoute.get('/',async (req,res) => {
   
   let username = req.session.user.username;
   
   let quizObj = await database.getQuizNames(username);

   res.render('scorePage',{
      quizNames:quizObj.quizNames,
      username:username
   });
   
});


module.exports = scoreRoute;
