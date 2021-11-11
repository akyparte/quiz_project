let express = require('express');
let database = require('./database.js');
let playRoute = express.Router();


playRoute.use((req,res,next) => {
   if(req.session.user){
     next();
   }else {
      res.redirect('/');
   }
})



playRoute.get('/',async (req,res) => {
    let quizName = req.query.quizName;
    let username = req.session.user.username;
    let quizArray = await database.getQuiz(username,quizName);
    let numOfOptions = Object.keys(quizArray[0]).length-2;
    req.session.user.currentPlayingQuiz = quizArray;
    if(quizArray.length !== 0){
        res.render('playQuizPage',{
        numOfOpt:numOfOptions,
        quizArray:quizArray,
        quizName:quizName,
        username:username
    });
    }else {
        res.sendStatus(404);
    }
    
});

playRoute.get('/getCurrentQuiz',(req,res) => {
     res.set('Content-Type','application/json');
     res.json(req.session.user.currentPlayingQuiz);
     delete req.session.user.currentPlayingQuiz;
})


playRoute.post('/updateScore',async (req,res) => {
   let playerName = req.body.playerName;
   let playerScore = req.body.playerScore;
   let quizName = req.body.quizName;
   let username = req.session.user.username;
   let response = await database.updateScores(username,quizName,playerName,playerScore);
   if(response) res.sendStatus(200);
   else res.sendStatus(500);
})


module.exports = playRoute;