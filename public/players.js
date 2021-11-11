(function(){

(function() {
	let reset = document.getElementById('reset');
	reset.addEventListener('click',async () => {
		// send request to server to delete all player 
		// then remove all players from here
  let quizName = document.getElementById('quiz_name').innerText.trim();

    let data = {
      quizName:quizName,
    }
      let response = await fetch('playerspage/deleteScore',{
        method:"POST",
        headers:{
          'content-type':'application/json',
        },
        body:JSON.stringify(data)
      });
      if(response.ok){
          let heading_container = document.getElementById('heading-container');
          if(heading_container){
             heading_container.parentNode.removeChild(heading_container);
          
             let players_list = document.getElementById('players-list-container');
             players_list.innerHTML = '';

             let message = `<div id = 'no-players-container' style = 'margin-top:2.5rem;'>
                         <span>you have deleted all records</span>
                         </div>`;
             players_list.insertAdjacentHTML('beforeend',message);
          }
          
      }
       

	})
})();

  (function() {
  	let back_btn = document.getElementById('go-back');

  	back_btn.addEventListener('click',() => {

  		location.replace('scorepage');

  	});
  })();


(function() {
     
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
        function closeCallback() {
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
})();

})();