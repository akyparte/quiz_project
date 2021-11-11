
(function(){
   let form1 = document.getElementById('form1');
   let form2 = document.getElementById('form2');

   (function form1_code() { 
       form1.addEventListener('submit',(e) => {
           e.preventDefault();
           let username = document.getElementById('login-username');
           let password = document.getElementById('login-password');

           let userData = {
               username : username.value.trim(),
               password: password.value.trim()
           };
       
           fetch('/login',{
               method:'POST',
               headers:{
                   'content-type':'application/json'
               },
               body:JSON.stringify(userData),
           }).then((response) => {
                  return response.json();
           }).then((result) => {
                 if(result.passed){
                     location.replace('/homepage');
                 }else {
                     username.style.border = '1px solid red';
                     username.value = '';
                     username.placeholder = 'invalid username';

                     password.style.border = '1px solid red';
                     password.value = '';
                     password.placeholder = 'invalid password';
                 }
           });
       });
   })();

   (function form2_code() {
       form2.addEventListener('submit',(e) => {  
           e.preventDefault();
           let body = document.querySelector('body');  
           let username = document.getElementById('signup-username');
           let password = document.getElementById('signup-password');
           let confirm_password = document.getElementById('signup-confirm-password');
           let email = document.getElementById('signup-email');

           if(password.value.trim() === confirm_password.value.trim()){
               if(password.value.length < 8){
                   alert('password length should be atleast 8 characters');      
               }
               else if(username.value.trim().length > 19){
                   alert('username length must be <= 19 characters');
              }else {
                   let userData = {
                       username : username.value.trim(),
                       password: password.value.trim(),
                       email : email.value.trim()
                   };
                   fetch('/signup',{
                       method:'POST',
                       headers:{
                           'content-type':'application/json'
                       },
                       body:JSON.stringify(userData),
                   }).then((response) => {
                       return response.json();
                   }).then(async (result) => {
                       if(result.allowed){
                           form2.style.display = 'none';
                           form1.style.display = 'block';
                       }else {
                           let frame = document.getElementById('login-validate-poppup-frame');
                           body.style.overflow = 'hidden';
                           if(frame){
                               frame.style.display = 'flex';
                           }else {
                               let poppup = await fetch('loginPoppups/login-validate.txt');
                               poppup = await poppup.text();
                               body.insertAdjacentHTML('beforeend',poppup);
                           }
                           let message = result.message;
                           let pop_message = document.getElementById('login-validate-message');
                           pop_message.innerText = message;
                           let userstand = document.getElementById('ok');
                           userstand.addEventListener('click',() => {
                               frame = document.getElementById('login-validate-poppup-frame');
                               frame.style.display = 'none';
                               body.style.overflow = 'visible';
                           });

                       }
                   })
              }
               
           }else {
               password.style.border = '1px solid red';
               password.value = '';
               confirm_password.style.border = '1px solid red';
               confirm_password.value = '';
               confirm_password.placeholder = 'not matched with password';     
           }
       });
   })();

   (function go_to_signup() {
       let signup_tag = document.getElementById('go-signup');
       signup_tag.addEventListener('click',(e) => {
           e.preventDefault();
           form1.style.display ='none';
           form2.style.display = 'block';
       })
   })();     

})();

