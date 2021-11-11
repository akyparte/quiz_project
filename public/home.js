//  total 50 characters for quiz name all lowercase

(function() {

  //code to play quiz and delete quiz 
  (function part1() {
    let quiz_container = document.getElementById('quiz-container');
    let body = document.querySelector('body');
     quiz_container.addEventListener('click',async (e) => {
         if(e.target.className === 'quiz-name-index'){
          let quizName = e.target.children[1].innerText.trim();
              location.replace(`playQuiz?quizName=${quizName}`);
         }else if(e.target.nodeName === 'SPAN'){
           let quizName = e.target.parentNode.children[1].innerText.trim(); 
              location.replace(`playQuiz?quizName=${quizName}`);
         }else if(e.target.nodeName === 'BUTTON'){
            let quizName = e.target.parentNode.children[0].children[1].innerText.trim();
            async function sub() {
                let response = await fetch(`homepage/delete?quizName=${quizName}`,{
                    method:'DELETE',
                });
                if(response.ok){
                    quiz_container.removeChild(e.target.parentNode);
                    let deleteFrame = document.getElementById('delete-pop-pup-frame');
                    deleteFrame.parentNode.removeChild(deleteFrame);
                    if(quiz_container.children.length === 0){
                        let no_quiz = `<div id = 'no-quiz'>
                            sorry currenly no quizes available click on add button to add quizes   
                                    </div>`
                        quiz_container.insertAdjacentHTML('beforeend',no_quiz);
                    }else {
                        for(let i = 0;i < quiz_container.children.length;i++){
                            quiz_container.children[i].children[0].children[0].innerText = i+1;
                        }
                    }
                }else {
                    alert('error accured try again');
                }
            }
              loadPoppup(['delete_poppup_cancel_btn','delete_poppup_delete_btn'],'delete-pop-pup-frame','homePoppups/delete.txt',sub);
         }
     })

  })();

 //code to add button and add_pop_pup to body 
  (function part2() {
     let add_button = document.getElementById('add-btn');
     let body = document.querySelector('body');

     add_button.addEventListener('click',(e) =>{ 
        async function sub(){
            let quiz_name = document.getElementById('quiz-name').value.trim();
            let num_of_questions = Number(document.getElementById('num-questions').value.trim());
            let num_of_options = Number(document.getElementById('num-options').value.trim());
            
            if(num_of_questions <= 50 && num_of_options <= 5 && quiz_name.length <= 50){
                location.replace(`addQuiz?quizName=${quiz_name}&NOQ=${num_of_questions}&NOO=${num_of_options}`);
            }else {
                alert('total 50 questions and 5 options are allowed \n question is allowed only 50 characters');
            }
            
        };  
        loadPoppup(['add-poppup-cancel-btn','add-poppup-submit-btn'],'add-pop-pup-frame','homePoppups/add.txt',sub);
     });

  })();

 //code for edit button and edit pop_pup
(function part3() {
    let edit_button = document.getElementById('edit-btn');
    let body = document.querySelector('body');
     
    edit_button.addEventListener('click',async (e) => {
        let edit_pop_pup = await fetch('homepage/editPoppup');
        edit_pop_pup = await edit_pop_pup.text();
        body.insertAdjacentHTML('beforeend',edit_pop_pup);
        body.style.overflow = 'hidden';
        let cancel = document.getElementById('edit-poppup-cancel-btn');
        let procede = document.getElementById('edit-poppup-procede-btn');
         
        cancel.addEventListener('click',(e) => {
            body.style.overflow = 'visible';
            let edit_pop_pup_frame = document.getElementById('edit-pop-pup-frame');
            edit_pop_pup_frame.parentElement.removeChild(edit_pop_pup_frame);
        });
        procede.addEventListener('click',async (e) => {
            let quiz_list = document.getElementById('select-quiz-list-container').children;
           
            for(let i = 0;i < quiz_list.length;i++){
                let single_quiz = quiz_list[i];
                if(single_quiz.children[0].checked){
                    let quizName = single_quiz.children[1].innerText.trim();
                    location.replace(`editQuiz?quizName=${quizName}`);
                    break;
                }else if(i === quiz_list.length-1){
                    alert('no quiz selected');
                    break;
                }
            }
        });

        // here working on check box

        let select_quiz_list_container = document.getElementById('select-quiz-list-container');
            select_quiz_list_container.addEventListener('change',(e) => {
                let quiz_list = select_quiz_list_container.children;
                let selectedQuiz = e.target.parentNode.children[1].innerText.trim();
               
                for(let i = 0;i < quiz_list.length;i++){
                    let single_quiz = quiz_list[i];
                    if(single_quiz.children[0].checked){
                        if(single_quiz.children[1].innerText.trim() !== selectedQuiz){
                            single_quiz.children[0].checked = false;
                        }
                    }  
                }
            });

    });



 })();

 // code for logout pop-Pup
 (function part4() {
     let username = document.getElementById('username'); 
     username.addEventListener('click',async (e) => {
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


 // code for search filter
(function part5() {
  let search = document.getElementById('search-filter');

  search.addEventListener('keyup',(e) => {
        let list_of_quiz = document.getElementById('quiz-container').children;
        let query = search.value.trim();
        let message = document.getElementById('no-quiz');
        function setIndex() {
           let i_for_quiz = 1;
           for(let i = 0;i < list_of_quiz.length;i++){
              let single_quiz = list_of_quiz[i];
              if(single_quiz.children.length >= 2){
                  if(window.getComputedStyle(single_quiz).display === 'flex'){
                     single_quiz.children[0].children[0].innerText = (i_for_quiz++);
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
                       let quiz_name = single_quiz.children[0].children[1].innerText;
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
                    let message = `<div id = 'no-quiz'> no results found ! </div>`;
                    let quiz_list_container = document.getElementById('quiz-container');              
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
                       let quiz_name = single_quiz.children[0].children[1].innerText;
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
                    let message = `<div id = 'no-quiz'> no results found ! </div>`;
                    let quiz_list_container = document.getElementById('quiz-container');              
                    quiz_list_container.insertAdjacentHTML('beforeend',message);
                    }
                     setIndex();
                };
        }

  })
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




})();














