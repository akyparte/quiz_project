let express = require('express');
let database = require('./database.js');
let playerRoute = express.Router();


playerRoute.use((req,res,next) => {
   if(req.session.user){
     next();
   }else {
      res.redirect('/');
   }
})


playerRoute.get('/',async (req,res) => {
  
    let username = req.session.user.username;
    let quizName = req.query.quizName;
    let scoreResponse = await database.getQuizScores(username,quizName);
    let scoreArray;
    let total;

    if(scoreResponse instanceof Array){
  	    scoreArray = [];
  	    total = 0;
    }else if(scoreResponse instanceof Object){
  	    scoreArray = scoreResponse.quizScores;
  	    total = scoreResponse.total;

  	    scoreArray = scoreArray.map( e => {
            let key = Object.keys(e);
            let obj = {
                playerName:key[0],
                playerScore:e[key[0]]
            };
            return obj;
        });
    }
    res.render('playersPage',{
  	    total:total,
  	    scoresArray:scoreArray,
  	    quizName:quizName,
        username:username
    })

});


playerRoute.post('/deleteScore',async (req,res) => {
   let quizName = req.body.quizName;
    let username = req.session.user.username;
   let result = await database.deleteQuizScore(username,quizName);
   if(result) res.sendStatus(200);
   else res.sendStatus(500);
})




module.exports = playerRoute;