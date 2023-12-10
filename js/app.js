
//init
//global variables to always access user data; needed for gallery initialization, modal views, and search
let profiles, currProfiles, currProfile;

//the modal HTML container exists from base index.html file
//by default we want to hide it
document.querySelector('.modal-container').style.visibility = 'hidden';

//create and populate gallery -- aka initApp()
getUserProfiles();
