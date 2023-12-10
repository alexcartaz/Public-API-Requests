//generates gallery
function generateGallery(profiles){

    //grab gallery container
    let gallery = document.getElementById('gallery');
    //clear gallery
    gallery.innerHTML = '';

    //map over each user profile to create HTML card with unique user data
    profiles.map((p) => {
        let newDate = new Date(p.dob.date);
        gallery.insertAdjacentHTML('beforeend', 
        `<div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${p.picture.thumbnail}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${p.name.first + ' ' + p.name.last}</h3>
                <p class="card-text">${p.email}</p>
                <p class="card-text cap">${p.location.city + ', ' + p.location.state}</p>
            </div>
        </div>`);
    });

    //grabs all cards just created
    cards = document.querySelectorAll('.card');

    //assigned event listeners to each
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            let email = card.querySelector('.card-text').innerHTML;
            let user = getFullUserData(email);
            generateProfile(user);
        });
    });
};


//gets full user data from an assumed unique email address input
function getFullUserData(email){

    let user;
    //maps over global profile array to find an email match
    profiles.map(p => {
        if(p.email === email) user = p;
    });

    //returns matched user or null
    return user;
}

//this function is called whenever a new user needs to be displayed in modal (detailed) overlay
function generateModalHTML(modalContainer, user){
    
    //update currProfile
    currProfile = user;

    //clear old modal
    modalContainer.innerHTML = '';

    //create date object from string
     let newDate = new Date(user.dob.date);
    
     //create modal profile HTML element block
     modalContainer.insertAdjacentHTML('beforeend', 
     `<div class="modal">
         <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
         <div class="modal-info-container">
             <img class="modal-img" src="${user.picture.thumbnail}" alt="profile picture">
             <h3 id="name" class="modal-name cap">${user.name.title + ' ' + user.name.first + ' ' + user.name.last}</h3>
             <p class="modal-text">${user.email}</p>
             <p class="modal-text cap">${user.location.city}</p>
             <hr>
             <p class="modal-text">${user.cell}</p>
             <p class="modal-text">${user.location.street.number + ' ' + user.location.street.name + ', ' + user.location.city + ', ' + user.location.state + ' ' + user.location.postcode}</p>
             <p class="modal-text">Birthday: ${newDate.toLocaleDateString("en-US")}</p>
         </div>
     </div>
     <div class="modal-btn-container">
         <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
         <button type="button" id="modal-next" class="modal-next btn">Next</button>
     </div>`);
    
    //make modal visible
    modalContainer.style.visibility = 'visible';
}

//currProfile is the user object corresponding to whatever user is currently displayed in the modal
//j corresponds to an intended direction in the array: -1 prev, 1 next
function updateCurrProfile(j){

    //if only one user in current gallery b/c of search
    if(currProfiles.length <= 1){
        //return the existing current user (no change to modal)
        return currProfile;
    }else{
        //if more than 1 user in gallery
        let k = 0;
        //iterate over all user objects displayed in gallery
        for(i=0; i<currProfiles.length; i++){
            //find the current user position in the array
            if(currProfiles[i] === currProfile){
                k=i;
            }
        }
        //add the prev (-1) or next (1) modifier to the array position
        k+=j;

        //account for wrapping, if at end, go to begging. If at beginning, go to end
        if(k === -1){ k=currProfiles.length-1 }
        if(k === currProfiles.length){ k=0 }

        //update global variable for currProfile
        currProfile = currProfiles[k];
    }
}

//handles request to creat expanded user detailed modal
function generateProfile(user){
    
    //get modal container
    let modalContainer = document.querySelector(".modal-container");

    //generate modal HTML and add it to the document
    generateModalHTML(modalContainer, user);
   
    //add event handler for close button to erase and then hide modal upon click
    document.querySelector('#modal-close-btn').addEventListener('click', e => {
        modalContainer.innerHTML = '';
        modalContainer.style.visibility = 'hidden';
        currProfile = null;
    });

    document.querySelector('#modal-prev').addEventListener('click', e => {
        updateCurrProfile(-1);
        generateProfile(currProfile);
    });

    document.querySelector('#modal-next').addEventListener('click', e => {
        updateCurrProfile(1);
        generateProfile(currProfile);
    });
}

//adds search HTML to the document
function initSearch(){

   let searchContainer = document.querySelector('.search-container');
   searchContainer.insertAdjacentHTML('beforeend', 
   `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>`);
}

//filters cards to display based on search substring match
function filterCards(cards){

    //get user search text input
    let searchText = document.querySelector('#search-input').value;

    //create new gallery array
    let newProfiles = [];

    //iterate over every profile
    profiles.forEach(p => {
        //should we include title?
        let name = p.name.first + ' ' + p.name.last;
        //if a substring match is found, add profile to new gallery
        if(name.indexOf(searchText) != -1){
            newProfiles.push(p);
        }
    });

    //update currProfiles
    currProfiles = newProfiles;

    //create new gallery
    generateGallery(newProfiles);
}

//gets user profiles, then initializes view based on data
//entire app functionality happens after fetch has resolved
async function getUserProfiles(){

    //limit profiles to english alphabet countries (US, Great Britain, Canada, New Zealand, Ireland)
    const response = await fetch("https://randomuser.me/api/?results=12&nat=us,gb,ca,nz,ie");
    let data = await response.json();
    profiles = data.results;
    currProfiles = data.results;

    //once have users, populate gallery
    generateGallery(profiles);

    //init search UI elements
    initSearch();
    
    //input catches any change to text inside the input field; this one event listener should catch all required search text modifications
    document.querySelector('#search-input').addEventListener('input', e => {
        filterCards(cards);
    });
}





