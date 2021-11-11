
(function () {
  
 // code for clicking on quiz and seeing players name
 (function part1() {
  let quiz_list = document.getElementById('quiz-list-container');

    quiz_list.addEventListener('click',(e) => {

        if(e.target.nodeName === 'SPAN'){
           let quiz_name = e.target.parentNode.children[1].innerText;
           location.replace(`playerspage?quizName=${quiz_name}`);
        }else if(e.target.getAttribute('class') === 'quiz'){
           let quiz_name = e.target.children[1].innerText;
           location.replace(`playerspage?quizName=${quiz_name}`);
        }
    })
  })();

  
  // code for search filter
(function part2() {
  let search = document.getElementById('search-filter');

  search.addEventListener('keyup',(e) => {
        let list_of_quiz = document.getElementById('quiz-list-container').children;
        let query = search.value.trim();
        let message = document.getElementById('no-score');
        function setIndex() {
           let i_for_quiz = 1;
           for(let i = 0;i < list_of_quiz.length;i++){
              let single_quiz = list_of_quiz[i];
              if(single_quiz.children.length >= 2){
                  if(window.getComputedStyle(single_quiz).display === 'flex'){
                     single_quiz.children[0].innerText = (i_for_quiz++);
                  }
              }
           }
        }
        if(e.key === 'Backspace'){
            if(query.length === 0){
                if(message){message.parentNode.removeChild(message)};
                for(let i = 0;i < list_of_quiz.length;i++){
                     let single_quiz = list_of_quiz[i];
                     single_quiz.style.display ='flex';
                }
                setIndex();
            }else {
              let results = 0;
                for(let i = 0;i < list_of_quiz.length;i++){
                    let single_quiz = list_of_quiz[i];
                    if(single_quiz.children.length >= 2){
                       let quiz_name = single_quiz.children[1].innerText;
                       if(quiz_name.includes(query)){
                          results++;
                          single_quiz.style.display = 'flex';
                       }else {
                          single_quiz.style.display = 'none';
                       }
                    }
                };
                if(results > 0){
                  if(message){message.parentNode.removeChild(message)};
                  setIndex();
                }else {
                  if(!message){
                    let message = `<div id = 'no-score'> no results found ! </div>`;
                    let quiz_list_container = document.getElementById('quiz-list-container');              
                    quiz_list_container.insertAdjacentHTML('beforeend',message);
                    }
                    setIndex();
                }
            }  
        }else {
           // for normal key strokes leaving 'Backspace'
               let results = 0;
                for(let i = 0;i < list_of_quiz.length;i++){
                    let single_quiz = list_of_quiz[i];
                    if(single_quiz.children.length >= 2){
                       let quiz_name = single_quiz.children[1].innerText;
                       if(quiz_name.includes(query)){
                          results++;
                       }else {
                          single_quiz.style.display = 'none';
                       }
                    }
                };
                if(results > 0){
                  if(message){message.parentNode.removeChild(message)};
                  setIndex();
                }else {
                  if(!message){
                    let message = `<div id = 'no-score'> no results found ! </div>`;
                    let quiz_list_container = document.getElementById('quiz-list-container');              
                    quiz_list_container.insertAdjacentHTML('beforeend',message);
                    }
                     setIndex();
                };
        }

  })
}
)();

  // code for logout poppup
(function part3() {
     
    let username = document.getElementById('username');
    let body = document.querySelector('body');
    username.addEventListener('click',async () => {
       
       let frame = document.getElementById('logout-poppup-frame');
         body.style.overflow = 'hidden';
       if(frame){
           frame.style.display = 'flex';
       }else {
           let logout_poppup = await fetch('commonLogoutPoppup/logout.txt');
           logout_poppup = await logout_poppup.text();
           body.insertAdjacentHTML('beforeend',logout_poppup);
       }       
       let logout_close = document.getElementById('logout-poppup-close');
       
       function closeCallback(){
          frame = document.getElementById('logout-poppup-frame');
           frame.style.display = 'none';
           body.style.overflow = 'visible';
           logout_close.removeEventListener('click',closeCallback);
           logout.removeEventListener('click',logoutCallback);
       }
       logout_close.addEventListener('click',closeCallback);

       let logout = document.getElementById('logout-btn');
       async function logoutCallback(){
           let response = await fetch('/logout');
             if(response.ok){
                location.replace('/');
             }else {
               alert('server error try again');
             }
       }
       logout.addEventListener('click',logoutCallback); 
       let logout_username = document.getElementById('logout-username');
         logout_username.innerText = document.getElementById('username').innerText.trim();
       
     })
 }

)();

 // code for back button

   (function () {
      let back_btn = document.getElementById('go-back');
      back_btn.addEventListener('click',() => {
        location.replace('homepage');
      }) 
   })()



})()

