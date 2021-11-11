  

(function test() {

 window.addEventListener('DOMContentLoaded',validate);
 window.addEventListener('DOMContentLoaded',() => {
    alert('make sure that answer must be one of the options before you submit your quiz with exact same spelled');
 })

  function getQuizArray() {
    let quizArray = [];
     let edit_quiz_list = document.getElementsByClassName('edit-quiz-container');
     for(let i = 0;i < edit_quiz_list.length;i++){
        let quiz = {};
        let optCount = 1;
          let single_quiz_children = edit_quiz_list[i].children;
          for(let j = 1;j < single_quiz_children.length;j++){
              let fieldBox = single_quiz_children[j];
              if(fieldBox.children[0].innerText === 'Q:'){
                   quiz.question = fieldBox.children[1].value.trim();
              }else if(fieldBox.children[0].innerText === 'ans:'){
                   quiz.answer = fieldBox.children[1].value.trim();
              }else {
                   quiz[`option${optCount++}`] = fieldBox.children[1].value.trim();
              }
          }
        quizArray.push(quiz);
     }   
    return quizArray;
  }

  function validate() {
   let edit_quiz_list = document.getElementsByClassName('edit-quiz-container');
   let save = document.getElementById('save-changes');

   save.addEventListener('click',async () => {
        if(emptyFieldsCheck() && limitCrossedCheck()){
           let quizArray = getQuizArray();
           let quizName = document.getElementById('quiz_name').innerText.trim();
           let data = {
            quizName:quizName,
            quizArray:quizArray,
           }
           let response = await fetch('editQuiz/storeEditedQuiz',{
            method:'POST',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(data),
           })
           if(response.ok){
             location.replace('homepage');
           }else {
             alert('sorry server error came try again');
           }
            return;
        }else{
            return;
        }
        function emptyFieldsCheck() {
            let selected = true;
            for(let i = 0;i < edit_quiz_list.length;i++){
                // s_q_c = single_quiz_children
                let s_q_c = edit_quiz_list[i].children;
         
                for(let j = 1;j < s_q_c.length;j++){
                    if(s_q_c[j].children[1].value.length === 0){
                        s_q_c[j].children[1].style.border = '2px solid red';
                        selected = false;
                    }
                }
            }           
            return selected;
        }
        function limitCrossedCheck() {
            let notCrossed = true;
            let crossedQuizes = [];
            for(let i = 0;i < edit_quiz_list.length;i++){
                let options = ['a:','b:','c:','d:','e:'];
                // s_q_c = single_quiz_children
                let s_q_c = edit_quiz_list[i].children;
                let quiz = {};
                let opt_index = 0;
                for(let j = 1;j < s_q_c.length;j++){
                    if(s_q_c[j].children[0].innerText === 'Q:'){
                        if(s_q_c[j].children[1].value.length > 350){
                            quiz.index = Number(s_q_c[0].innerText);
                            quiz.Q = true;
                        }
                    }else if( s_q_c[j].children[0].innerText.trim() === options[0]){
                        if(s_q_c[j].children[1].value.length > 200){
                            quiz.index = Number(s_q_c[0].innerText);
                            quiz[options.shift()] = true;
                        }else options.shift();
                    }else if(s_q_c[j].children[0].innerText.trim() === 'ans:'){
                        if(s_q_c[j].children[1].value.length > 200){
                            quiz.index = Number(s_q_c[0].innerText);
                            quiz.ans = true;
                        }
                    }
                }
                if(Object.keys(quiz).length) crossedQuizes.push(quiz);
            }
            if(crossedQuizes.length > 0){
            notCrossed = false; 
              loadMessage(crossedQuizes);
            }
            return notCrossed;           
        }   

        function loadMessage(quizArray) {
            let body = document.querySelector('body');
            let frame = document.createElement('div');
            frame.setAttribute('id','validate-frame');
             body.style.overflow = 'hidden';
            let container = document.createElement('div');
            container.setAttribute('id','validate-container');

            let btn_container = document.createElement('div');
            btn_container.setAttribute('id','validate-btn-container');
            let userstand = document.createElement('button');
            userstand.innerText = 'understand';
            btn_container.appendChild(userstand);
            userstand.addEventListener('click',() => {
                frame.parentNode.removeChild(frame);
                body.style.overflow = 'visible';
            });

            let messege_center = document.createElement('div');
            messege_center.setAttribute('id','message-center');

            for(let i = 0;i < quizArray.length;i++){
                let quiz = document.createElement('div');
                quiz.setAttribute('class','quiz');
                let index = document.createElement('span');
                index.innerText = `Q-${quizArray[i].index}`;
                quiz.appendChild(index);
                let message1;
                if(quizArray[i].Q){
                    message1 = document.createElement('span');
                    message1.innerText = 'Q crossed 300 character limit';
                    quiz.appendChild(message1);
                }

                let options = ['a:','b:','c:','d:','e:'];
                let message2 = document.createElement('span');

               for(let j = 0;j < options.length;j++){
                   if(quizArray[i][options[j]]){
                       message2.innerText = message2.innerText+`,${options[j].replace(':','')}`;
                   }
               }
               if(message2.innerText.length > 0) message2.innerText = message2.innerText.replace(',','');
               if(quizArray[i].ans){     
                   if(message2.innerText.length > 0) message2.innerText = message2.innerText+',';
                   message2.innerText = message2.innerText + 'ans crossed 200 character limit';
               }else if(message2.innerText.length > 0){
                    message2.innerText = message2.innerText + ' crossed 200 character limit';
               }

               if(message2.innerText.length){
                   quiz.appendChild(message2);
               }
               messege_center.appendChild(quiz);
            }

            container.append(messege_center,btn_container);
            frame.appendChild(container);
            body.appendChild(frame);
            body.style.overflow = 'hidden';
        }
  
   })
      

}



(function logoutPoppup() {
     let username = document.getElementById('username');
     let body = document.querySelector('body');
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


(function leavePoppup() {
  let back = document.getElementById('go-back');
  let body = document.querySelector('body');
  back.addEventListener('click',async () => {
     function sub() {
        location.replace('/homepage');
    }
        loadPoppup(['cancel','submit'] , 'leave-quiz-poppup-frame', 'editPagePoppups/leave.txt',sub);
  });
})()





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
    function cancelCallback (){
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


})();













