let mongoose = require('mongoose');
const bcrypt = require("bcrypt");
let onlineUrl = 'mongodb+srv://akshayPP:Wisky%40mazza%40kutra@cluster0.idhhq.mongodb.net/quizUsers?retryWrites=true&w=majority';
let uri = 'mongodb://127.0.0.1:27017/quizUsers';

mongoose.connect(onlineUrl, { useNewUrlParser: true }).then(() => {
    console.log('connection established');
}).catch(() => {
    console.log('connections failed');
})

// it is schema
let user = mongoose.Schema({
	username:{
		type:String,
		unique:true,
		index:true
	},
	password:{
		type:String
	},
	email:{
		type:String
	},
	quizArray:{
		type:[{}]
	},
	quizNames:[],
    quizScores:{
        type:[{}]
    }

});

user.statics.hashPassword = async function(pass){
	 const salt = await bcrypt.genSalt(10);
	 let hashedPassword = await bcrypt.hash(pass, salt);
	 return hashedPassword;
}

user.statics.validateUser = async function(username){
    let data = await userData.findOne({username});
    if(data) return true;
    else return false;
}

user.statics.loginValidation = async function(username,receivedPassword) {
	 let user = await userData.findOne({username:username});
     if(user){
        let isPasswordMatched = await bcrypt.compare(receivedPassword, user.password);
        return receivedPassword;
     }else {
     	return false;
     }
}

user.statics.getQuizNames = async function(username) {
	let quizNames = await userData.findOne({username:username}).select({ quizNames: 1,_id: 0 });
    return quizNames;
}


user.statics.deleteQuiz = async function(username,quizName){
    let result = await userData.findOne({username:username});
    for(let i = 0;i < result.quizArray.length;i++){
           if(result.quizArray[i][quizName]){
           	result.quizArray[i] = result.quizArray[result.quizArray.length-1];
           	result.quizArray.pop();
           	result.quizNames[i] = result.quizNames[result.quizNames.length-1];
           	result.quizNames.pop();
           	break;
           }
    }
    result.markModified('quizArray');
    result.markModified('quizNames');
    let response = await result.save();
    if(response) return true;
    else return false;
}

user.statics.storeQuiz = async function(username,quizName,quizArray){
    let userObject = await userData.findOne({username:username});
    if(userObject){
    	let quiz = {};
    	quiz[quizName]=quizArray;
    	userObject.quizArray.push(quiz);
    	userObject.quizNames.push(quizName);
       userObject.markModified('quizArray');
       userObject.markModified('quizNames');
    	let result = await userObject.save();
    	if(result) return true;
    	else return false;
    }
}

 user.statics.getQuiz = async function(username,quizName) {
 	 let quiz = await userData.findOne({username:username}).select({quizArray:1,_id:0});
 	 for(let i = 0; i < quiz.quizArray.length;i++){
 	 	if(quiz.quizArray[i][quizName]) return quiz.quizArray[i][quizName];
 	 }
     return [];
 }

user.statics.updateEditedQuiz = async function(username,quizName,quizArray) {
    let result = await userData.findOne({username:username});
     for(let i = 0;i < result.quizArray.length;i++){
     	if(result.quizArray[i][quizName]){
     		result.quizArray[i][quizName] = quizArray;
     		break;
     	}
     }
       result.markModified('quizArray');
     let response =  await result.save();
     if(response) return true;
     else return false;
}



user.statics.updateScores = async function(username,quizName,playerName,playerScore){
    let result = await userData.findOne({username:username});
    if(result.quizScores.length === 0){
        let obj = {};
        obj[quizName] = [ { [playerName]:playerScore } ];
       result.quizScores.push(obj);
    }else {
       for(let i = 0;i < result.quizScores.length;i++){
           if(result.quizScores[i][quizName]){
               for(let j = 0; j < result.quizScores[i][quizName].length;j++){
                   if(result.quizScores[i][quizName][j][playerName]){
                       result.quizScores[i][quizName][j][playerName] = playerScore;
                       break;
                   }else if(j === result.quizScores[i][quizName].length-1){
                       let playerObject = {};
                        playerObject[playerName] = playerScore;
                        result.quizScores[i][quizName].push(playerObject);
                        break;
                   }
               }
           }else if(i === result.quizScores.length-1){
                let data = {};
                data[quizName] = [{[playerName]:playerScore}];
                result.quizScores.push(data);
           }
       }
    }
    result.markModified('quizScores');
    let response = await result.save();
    if(response) return true;
    else return false;

}


user.statics.getQuizScores = async function(username,quizName) {
  let response = {};
  let result = await userData.findOne({username:username});

  if(result.quizScores.length === 0){
     return [];
  }else {
     for(let i = 0;i < result.quizScores.length;i++){
        if(result.quizScores[i][quizName]){
             response.quizScores = result.quizScores[i][quizName];
             break;
        }else if(i === result.quizScores.length-1){
           return [];
        }
      }

      for(let i = 0;i < result.quizArray.length;i++){
           if(result.quizArray[i][quizName]){
              response.total = result.quizArray[i][quizName].length;
              return response;
           }
      }
  }

  return [];
}

 user.statics.deleteQuizScore = async function(username,quizName){

    let result = await userData.findOne({username:username});
 
    if(result.quizScores.length !== 0){
        let deleteProcessHappend = false;
        for(let i = 0;i < result.quizScores.length;i++){
            if(result.quizScores[i][quizName]){
                result.quizScores[i][quizName] = result.quizScores[result.quizScores.length-1];
                result.quizScores.pop();
                deleteProcessHappend = true;
                break;
            }
        }
        if(deleteProcessHappend){
            result.markModified('quizScores');
            let response = await result.save();
            if(response) return true;
            else return false;
        }
 
    }
    return true;
  
 }


// model -> collection
 let userData = mongoose.model('userdata',user);

 

module.exports = userData;

