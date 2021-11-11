
(function(){


 async function getData(){
    let qArray = await fetch('playQuiz/getCurrentQuiz')
    qArray = await qArray.json();
    quizArray = qArray;
    total = quizArray.length;
 } 

let body = document.querySelector('body'); 
let quizArray;
let total;
getData();
 let body_container = document.getElementById('body-container');

 window.addEventListener('DOMContentLoaded',() => {
    let submit = document.getElementById('submit-btn');
     submit.addEventListener('click',go_submit);
 });

 (function selectQuiz() {
     // let body_container = document.getElementById('body-container');
     body_container.addEventListener('click',(e) => {
  	     if(e.target.parentNode.getAttribute('class') === 'option'){
             let sibling_options = e.target.parentNode.parentNode.children;
             if(e.target.parentNode.style.border !== '5px solid black'){
                 for(let i = 0;i < sibling_options.length;i++){
                     sibling_options[i].style.border = '2px solid black';
                 }
                 e.target.parentNode.style.border = '5px solid black'; 
             }
         }
  
     })
 })();

function allChecked() {
    let quiz_container_list = document.getElementsByClassName('quiz-container');
    let passed = 0;
    // let checked = true;
    for(let i = 0;i < quiz_container_list.length;i++){
        let option_list = quiz_container_list[i].children[1].children;
        for(let j = 0;j < option_list.length;j++){
            if(option_list[j].style.border === '5px solid black'){
                passed++;
                break; 
            } 
        }

   }
   if(quiz_container_list.length === passed)return true;
   else return false;
}


async function loadValidateQuiz() {
    let body = document.querySelector('body');

    let frame = document.getElementById('validate-poppup-frame');
    if(frame){
        frame.style.display = 'flex';
    }else {
        let validate_poppup = await fetch('playQuizPagePoppups/validate.txt');
        validate_poppup = await validate_poppup.text();
        body.insertAdjacentHTML('beforeend',validate_poppup);
    }
    let understand = document.getElementById('ok');
    function callback(){
        frame = document.getElementById('validate-poppup-frame');
        frame.style.display = 'none';
        understand.removeEventListener('click',callback);
    }
    understand.addEventListener('click',callback);
 
}


function showScore() {
    let score = 0;
    let quiz_container_list = document.getElementsByClassName('quiz-container');
    for(let i = 0;i < quiz_container_list.length;i++){
        let option_list = quiz_container_list[i].children[1].children;
        for(let j = 0;j < option_list.length;j++){
            if(option_list[j].style.border === '5px solid black'){
                if((option_list[j].children[1].innerText.trim().toLowerCase()) === (quizArray[i].answer.trim().toLowerCase())){
                    score++;
                    break;   
                }
            }
        }
    }
    return score;
}

async function scorePoppup(score,name) {
    let score_poppup = await fetch('playQuizPagePoppups/score.txt');
    score_poppup = await score_poppup.text();
    body.insertAdjacentHTML('beforeend',score_poppup);
    
    let message = document.getElementById('score-message');
    message.innerText = `${name} you scored ${score} out of ${total}`

    let go_back = document.getElementById('score-btn');
    go_back.addEventListener('click',async () => {
        // now save this score to server and some back to home page
        let data = {
           quizName:document.getElementById('quiz-name').innerText.trim(),
           playerName:name,
           playerScore:score
        }
        let response = await fetch('playQuiz/updateScore',{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(data),
        });
        if(response.ok){
            location.replace('homepage');
        }else {
            alert('server error accured try again');
            let scoreFrame = document.getElementById('score-poppup-frame');
            scoreFrame.parentNode.removeChild(scoreFrame);
        }
    })
}


function go_submit(){
    let name = document.getElementById('player_name');
    if(name.value.length !== 0){
       if(allChecked()){
           let player_score = showScore();
           scorePoppup(player_score,name.value);
       }else {
           loadValidateQuiz();
           return;
       }
    }else {
        name.style.border = '2px solid red';
        name.placeholder = 'required';
    }
    
}



(function loadLogoutPoppup() {
    let username = document.getElementById('username');
    username.addEventListener('click',async () => {
        async function sub(){
             let response = await fetch('/logout');
             if(response.ok){
                location.replace('/');
             }else {
               alert('server error try again');
             }
        }
        loadPoppup(['logout-poppup-close','logout-btn'],'logout-poppup-frame','commonLogoutPoppup/logout.txt',sub);
    })
})();


(function loadLeavePoppup() {
    let back = document.getElementById('go-back');
    let body = document.querySelector('body');
    function sub(){location.replace('/homepage')};
    back.addEventListener('click',async () => {
    loadPoppup(['cancel','leave'] , 'leave-quiz-poppup-frame', 'playQuizPagePoppups/leave.txt',sub);
  });
})()



})();





async function loadPoppup(btns,frameId,path,submit_callback) {
  let body = document.querySelector('body');

     let frame = document.getElementById(frameId);
     body.style.overflow = 'hidden';
     if(frame){
        frame.style.display = 'flex';
     }else {
       let poppup = await fetch(path);
       poppup = await poppup.text();
       body.insertAdjacentHTML('beforeend',poppup);
     }


    let btn1 = document.getElementById(btns[0]);
    let btn2 = document.getElementById(btns[1]);
    function cancelCallback(){
        frame = document.getElementById(frameId);
       frame.style.display = 'none';
       body.style.overflow = 'visible';
       btn1.removeEventListener('click',cancelCallback);
       btn2.removeEventListener('click',submit_callback);
    }
    btn1.addEventListener('click',cancelCallback);
    submit_callback = submit_callback?submit_callback:function(){};
    btn2.addEventListener('click',submit_callback);
    if(frameId === 'logout-poppup-frame'){ 
         let logout_username = document.getElementById('logout-username');
         logout_username.innerText = document.getElementById('username').innerText.trim();
    }


}

