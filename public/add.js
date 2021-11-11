//question 350
// option  200
// window.addEventListener('load', (event) => {
//     alert('question is allowed 350 characters \n options are allowed 200 characters');
// });

window.addEventListener('DOMContentLoaded', (event) => {
    alert('question is allowed 350 characters \n options are allowed 200 characters');
});


function test() {
	 let quizArray = [];
   let body = document.querySelector('body');
	 let back = document.getElementById('back-quiz');
	 let next = document.getElementById('next-quiz');
   let q_heading = document.getElementById('question-index');
   let num_of_questions = Number(q_heading.getAttribute('nq'));
   let num_of_options = Number(q_heading.getAttribute('no'));   
   let question = document.getElementById('question-box').children[1];
   let opt_ans_list = [];
   let opt_ans_container = document.getElementById('options-answer').children;
   if(num_of_questions === 1){ next.innerText = 'submit'; }
   for(let i = 0;i < opt_ans_container.length;i++){
       opt_ans_list.push(opt_ans_container[i].children[1]);	
   }

   next.addEventListener('click',() => {
       makeFieldsReady();
    	 if(num_of_questions === 1){

           if(validate()){
               storeQuiz('next');
               finalProcess();
               return;
           }else {
            	 return;
           }
    	 }else {
           if(validate()){
               storeQuiz('next');
               let current_index = Number(q_heading.getAttribute('title'));
               if(current_index === num_of_questions){
                   finalProcess();
                   return;
               }
               if((current_index+1) === num_of_questions){
                   next.innerText = 'submit';
                   makeFieldsReady();
                   q_heading.setAttribute('title',current_index+1);
                   q_heading.innerText = `question ${current_index+1}`;
               }else {
                   q_heading.setAttribute('title',current_index+1);
                   q_heading.innerText = `question ${current_index+1}`;
                   makeFieldsReady();
               }
               
           }else return;       	 
    	 }
   });  

   back.addEventListener('click',() => {
       let current_index = Number(q_heading.getAttribute('title'));

       temperaryStore('back');
       if(current_index !== 1) makeFieldsReady();


       if(num_of_questions !== 1){
           if(!(current_index-1 <= 0)){
               if(next.innerText === 'submit'){next.innerText = 'next'};
                   let last_index = current_index-1;
                   let quiz = quizArray[last_index-1];
                   if(quiz){
                       q_heading.innerText = `question ${current_index-1}`;
                       q_heading.setAttribute('title',current_index-1);
                       question.value = quiz.question;
                       for(let i = 0;i < opt_ans_list.length;i++){
                           if(opt_ans_list[i].getAttribute('name') === 'option'){
                               opt_ans_list[i].value = quiz[`option${i+1}`];
                           }else if(opt_ans_list[i].getAttribute('name') === 'answer'){
                               opt_ans_list[i].value = quiz.answer;
                           }
                       }
                   }

           }else return;
       }else {
           return;
       }  
   });
    
// =============validate method starts ===================
   function validate() {
      let passed = true;
      fieldsEmptyCheck();
      limitCrossedCheck();
      if(passed)ansCheck();
 
      async function ansCheck() {
          let answer = opt_ans_list[opt_ans_list.length-1].value.trim();
          matched = false;
          for(let i = 0;i < opt_ans_list.length-1;i++){
              if(opt_ans_list[i].value.trim().toLowerCase() === answer.toLowerCase()) matched = true;
          }
          passed = matched;

          if(!matched){
              body.style.overflow = 'hidden';
              let poppup = await fetch('addPagePoppups/validate.txt');
              poppup = await poppup.text();
              body.insertAdjacentHTML('beforeend',poppup);
              let message_box = document.getElementById('message-box');
              let understand = document.getElementById('ok');
              let message = `<span> asnwer should be one of the options </span>`
              message_box.insertAdjacentHTML('beforeend',message);
              message_box.style.padding = '0.4rem 0.4rem 0.4rem 1.1rem';

              understand.addEventListener('click',() => {
                body.style.overflow = 'visible';
                let frame = document.getElementById('validate-quiz-poppup-frame');
                   frame.parentNode.removeChild(frame);
              });
          }  
      }

      function fieldsEmptyCheck() {
          let question_box = document.getElementById('question-box');
          if(question.value.length === 0 ){
              question_box.style.border = '3px solid red';
              passed = false;
          }
          for(let i = 0;i < opt_ans_list.length;i++){
              if(opt_ans_list[i].value.length === 0){
                  opt_ans_container[i].style.border = '2px solid red';
                  passed = false;
              }
          }
      }


      async function limitCrossedCheck() {
          crossed_options = [];
          if(question.value.length > 350){
              crossed_options.push('Q');
              passed = false;
          }
          for(let i = 0;i < opt_ans_list.length;i++){
              if(opt_ans_list[i].getAttribute('name') === 'option'){
                  if(opt_ans_list[i].value.length > 200){
                      if(i === 0){crossed_options.push('a')}
                      else if(i === 1){crossed_options.push('b')}
                      else if(i === 2){crossed_options.push('c')}
                      else if(i === 3){crossed_options.push('d')}
                      else if(i === 4){crossed_options.push('e')} 
                      passed = false;   
                  }
              }else if(opt_ans_list[i].getAttribute('name') === 'answer'){
                      if(opt_ans_list[i].value.length > 200){
                          crossed_options.push('ans');
                          passed = false;
                      }
              }    
          }
           
          // checking for both options and question 
          // if validation failed then poppup will be shown
          if(crossed_options.length > 0){
              let poppup = await fetch('addPagePoppups/validate.txt');
              poppup = await poppup.text();
              body.insertAdjacentHTML('beforeend',poppup);
              body.style.overflow = 'hidden';
              let validate_poppup_container = document.getElementById('message-box');
                
              let question_string = '';
              if(crossed_options[0] === 'Q') {
                  question_string = 'question crossed 350 limit';
                  crossed_options.shift();
              }
              let option_string = '';
              for(let index = 0; index < crossed_options.length; index++){
                  if(index === 0){
                      option_string = crossed_options[index];
                  }else{
                      option_string = option_string+`,${crossed_options[index]}`;
                  }
              }
              if(option_string.length > 0) {option_string = option_string+' crossed 200 limit'; }
              if((question_string.length > 0) && (option_string.length > 0)){
                  let m = `
                        <span>${question_string}</span>
                        <span>${option_string}</span> 
                     `;
                  validate_poppup_container.insertAdjacentHTML('beforeend',m); 
              }else if(question_string.length > 0){
                  let m = `<span>${question_string}</span>`
                  validate_poppup_container.insertAdjacentHTML('beforeend',m);
              }else if(option_string.length > 0){
                  let m = `<span>${option_string}</span>`;
                  validate_poppup_container.insertAdjacentHTML('beforeend',m); 
              }

              let understand = document.getElementById('ok');
              understand.addEventListener('click',() => {
                body.style.overflow = 'visible';
                  let frame = document.getElementById('validate-quiz-poppup-frame');
                  frame.parentNode.removeChild(frame);
              })
          }
      }

     return passed;
   }
// ============= validate method ends ===================

// ================ storage related methods=================
// this method works for both back and next operation
   function temperaryStore(btn) {
       let current_index = Number(q_heading.getAttribute('title'));
       if(quizArray[current_index-1] || !(quizArray[current_index-1]) ){
           let quiz = {};
           quiz.question = question.value.trim();

           if(btn === 'back' && current_index !== 1){
               question.value = '';
           }else if(btn === 'next' && (current_index !== num_of_questions)){
               question.value = '';
           } 

           for(let i = 0;i < opt_ans_list.length;i++){
               if(opt_ans_list[i].getAttribute('name') === 'option'){
                   quiz[`option${i+1}`] = opt_ans_list[i].value.trim();

                   if(btn === 'back' && current_index !== 1){
                       opt_ans_list[i].value = '';
                   }else if(btn === 'next' && (current_index !== num_of_questions)){
                       opt_ans_list[i].value = '';
                   }

               
               }else if(opt_ans_list[i].getAttribute('name') === 'answer'){
                   quiz.answer = opt_ans_list[i].value.trim();

                   if(btn === 'back' && current_index !== 1){
                       opt_ans_list[i].value = '';
                   }else if(btn === 'next' && (current_index !== num_of_questions)){
                       opt_ans_list[i].value = '';
                   }

               }
           }
           if(quizArray[current_index-1]){
               quizArray[current_index-1] = quiz;
           }else{
               quizArray.push(quiz);
           } 
          
       }
   }

   function storeQuiz(btn) {
       let current_index = Number(q_heading.getAttribute('title'));
       temperaryStore(btn);

       //because in array values get stored from zero
       // and we store quiz index with 1,2,3... counting
       //so this current_index represt next quiz here
       if(quizArray[current_index]){
           let quiz = quizArray[current_index];
           question.value = quiz.question;
           for(let i = 0;i < opt_ans_list.length;i++){
               if(opt_ans_list[i].getAttribute('name') === 'option'){
                   opt_ans_list[i].value = quiz[`option${i+1}`];             
               }else if(opt_ans_list[i].getAttribute('name') === 'answer'){
                   opt_ans_list[i].value = quiz.answer;
               }
           }
       } 	
   }

//====================== storage ends here ========================== 

   function makeFieldsReady() {
       let question_box = document.getElementById('question-box');
       question_box.style.border = '2px solid black';
       for(let i = 0;i < opt_ans_list.length;i++){
       	   opt_ans_container[i].style.border = '2px solid black';
       }	 
   }

   function finalProcess() {
       async function sub() {
         let quiz_name = q_heading.getAttribute('qn');  
         let data = {
            quizName:quiz_name.trim(),
            quizArray:quizArray
         };
        let result = await fetch('/addQuiz/storeToDB',{
            method:'post',
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(data),
           });
        if(result.ok){
            location.replace('/homepage');
        }else {
            alert('server error accured try again');
        }
       }
       leaveAndSavePoppup(['btn1','btn2'],'save-leave-quiz-poppup-frame','addPagePoppups/leave.txt','quiz will be added to list',['check','save'],sub);
   }

  
   (function leavePage() {
       let go_back = document.getElementById('go-back');

       go_back.addEventListener('click',async () => {
         function sub(){
            location.replace('homepage');
         }
           leaveAndSavePoppup(['btn1','btn2'],'save-leave-quiz-poppup-frame','addPagePoppups/leave.txt','do you want to leave ?',['cancel','do it'],sub);
        
       });
   })();

   (function logoutPoppupCode() {
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
       });
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

async function leaveAndSavePoppup(btns,frameId,path,message,btn_content,submit_callback) {
    let body = document.querySelector('body');

    let frame = document.getElementById(frameId);
     body.style.overflow = 'hidden';
     if(frame){
        frame.style.display = 'flex';
     }else {
       let poppup = await fetch(path);
       poppup = await poppup.text();
       body.insertAdjacentHTML('beforeend',poppup);
       let message_holder = document.getElementById('p-m');
       message_holder.innerText = message;
       let btn1 = document.getElementById('btn1');
       let btn2 = document.getElementById('btn2');
       btn1.innerText = btn_content[0];
       btn2.innerText = btn_content[1];
     }

    let btn1 = document.getElementById(btns[0]);
    let btn2 = document.getElementById(btns[1]);

    

    btn1.innerText = btn_content[0];
    btn2.innerText = btn_content[1];
    function cancelCallback(){
       frame = document.getElementById(frameId);
       frame.style.display = 'none';
       body.style.overflow = 'visible';
       btn1.removeEventListener('click',cancelCallback);
       btn2.removeEventListener('click',submit_callback);   
    }
    btn1.addEventListener('click',cancelCallback)

    submit_callback = submit_callback?submit_callback:function(){};
    btn2.addEventListener('click',submit_callback);

}


}

test();




