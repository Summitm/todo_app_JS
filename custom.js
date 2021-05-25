const targetlink = document.querySelector("#gotoRegister");
const targetlink2 = document.querySelector("#gotoLogin");
const gotoLogin = document.querySelector("#Login");
const gotoRegister = document.querySelector("#Register");
const gotoDashBoard = document.querySelector("#dashboard");
const defaultPage = document.querySelector("#default");

/*===============================Action on default btns==================================*/
const signIn = document.querySelector("#signIn");
const signUp = document.querySelector("#signUp");

defaultPage.addEventListener("click", landTo, {once: true, passive:false});

function landTo(event) {
    if(event.srcElement.id === 'signUp'){
        setTimeout(()=>{
            defaultPage.style.display = "none";
            gotoRegister.style.display = "block";
        }, 1000);
    }
    else{
        setTimeout(()=>{
            // alert("Are you sure you want to leave page?")
            defaultPage.style.display = "none";
            gotoLogin.style.display = "block";
        }, 1000);
    }
}

/*================================Login/Register and redirects==========================================*/
targetlink.addEventListener("click", hideShowSections, {once: true, passive:false});

targetlink2.addEventListener("click", hideShowSections, {once: true,passive:false});

// hide or show sections
function hideShowSections(event) {
    if(event.srcElement.id === 'gotoRegister'){
        setTimeout(()=>{
            gotoLogin.style.display = "none";
            gotoRegister.style.display = "block";
        }, 1000);
    }
    else{
        setTimeout(()=>{
            // alert("Are you sure you want to leave page?")
            gotoRegister.style.display = "none";
            gotoLogin.style.display = "block";
        }, 1000);
    }
}

/*===================================Register=======================================*/
const registerForm = document.getElementById("signup-form");
let errorSpace = registerForm.querySelector('.error');

// submit event
registerForm.addEventListener('submit', register, {once: true, passive:false});

function register(e) {
    e.preventDefault();
    // formfields
    const firstname = registerForm.querySelector("#first_name").value;
    const lastname = registerForm.querySelector("#last_name").value;
    const username = registerForm.querySelector("#user_name").value;
    const password = registerForm.querySelector("#password1").value;
    const password1 = registerForm.querySelector("#password2").value;
    const tcsChecked = registerForm.querySelector("#terms");
    errorSpace.innerHTML = "";
    if(firstname !== '' && lastname !== '' && username !== '' && password !== '' && password1 !== '' && tcsChecked.checked) {
        errorSpace.innerHTML = "";

        if(password === password1) {
            try{
                let users = localStorage.getItem('users'); //list of all users
                let newUsersArr = users ? JSON.parse(users) : {};
                let userId = username;
                function AddUser(fname, lname, email, passphrase, rememberMe) {
                    this.fname = fname;
                    this.lname = lname;
                    this.email = email;
                    this.passphrase = passphrase;
                    this.rememberMe = rememberMe;
                }

                let add_user = new AddUser(firstname, lastname, username,password,rememberMe=false);//instance of user
                // newUsersArr.push(addUser);//push user to users array
                // console.log(add_user());
                localStorage.setItem('users', add_user);//add to local storage

                setTimeout(()=>{//transition to dashboard
                    // alert("Are you sure you want to leave page?")
                    gotoDashBoard.style.display = "block";
                    gotoRegister.style.display = "none";
                }, 1000);
            }
            catch(e){
                console.log(e);
            }
            // localStorage.setItem( 'firstname', firstname);
            // localStorage.setItem( 'lastname', lastname);
            // localStorage.setItem('username', username);
            // localStorage.setItem( 'password', password);
        }
        else {
            errorSpace.innerHTML = "<span>Passwords did not match!</span>";
        }
    }
    else {
        errorSpace.innerHTML = "<span>All fields must be filled!</span>";
    }
}

/*===================================Login=======================================*/
const loginForm = document.getElementById("login-form");
let errorSpace1 = loginForm.querySelector(".error");
// let usernameSpace = document.querySelector('.navbar-brand');
// submit event
loginForm.addEventListener('submit', login, {once: true, passive:false});

function login(e) {
    e.preventDefault();
    // login fields
    const username = loginForm.querySelector("#user_name").value;
    const password = loginForm.querySelector("#passsword").value;
    const isChecked = loginForm.querySelector("#check");
    if(localStorage.getItem("rememberMe")) {
        gotoLogin.style.display = "none";
        gotoDashBoard.style.display = "block";
    }
    else if(username !== '' && password !== '') {
        if(password === localStorage.getItem('password') && username === localStorage.getItem('username') && isChecked.checked) {
            try {
                let users = localStorage.getItem('users').split(','); //list of all users
                console.log("Hello "+ users);
            }
            catch (e) {
                console.log(e);
            }

            // let newUsersArr = users ? users.split(',') : [];
            // localStorage.setItem('rememberMe', true);
            // setTimeout(()=>{
            //     // alert("Are you sure you want to leave page?")
            //     gotoDashBoard.style.display = "block";
            //     gotoLogin.style.display = "none";
            // }, 1000);
        }
        else if(password === localStorage.getItem('password') && username === localStorage.getItem('username')) {
            setTimeout(()=>{
                // alert("Are you sure you want to leave page?")
                gotoDashBoard.style.display = "block";
                gotoLogin.style.display = "none";
            }, 1000);
        }
        else {
            errorSpace1.innerHTML = "<span>Invalid username or password!</span>";
            try {
                let users = localStorage.getItem('users'); //list of all users
                let user = JSON.parse(users);
                console.log("Hello on error "+ user);
                // for(let userObj in users) {
                //     let user = JSON.parse(userObj);
                //     console.log("Hello on error "+ user);
                // }
            }
            catch (e) {
                console.log(e);
            }
        }
    }
    else {
        errorSpace1.innerHTML = "<span>All fields must be filled!</span>";
    }
}

/*===================================Logout=======================================*/
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener('click', logout, {once:true, passive:true});

function logout(event) {
    event.preventDefault();

    // clear logged in data
    localStorage.removeItem("rememberMe");
    gotoDashBoard.style.display = "none";
    gotoLogin.style.display = "block";
}

/*===================================Global rules=======================================*/
// loginForm.addEventListener('click', (event) => {
//     if(localStorage.getItem("rememberMe")) {
//         defaultPage.style.display = "none";
//         gotoDashBoard.style.display = "block";
//     }
// });

/*===================================adding task to task list=======================================*/
const newListForm = document.getElementById("addlist-form");
const listTableBody = document.querySelector("#table-body");
let errorSpace2 = newListForm.querySelector(".error");

newListForm.addEventListener('submit', addTaskLabel);

function addTaskLabel(event) {
    event.preventDefault();
    const taskLabel = newListForm.querySelector("#task-title").value;
    
    if(taskLabel !== '') {
        const existingTodoLabels = localStorage.getItem('tasklabels');
        let taskLabelsArr = existingTodoLabels ? existingTodoLabels.split(',') : [];

        taskLabelsArr.push(taskLabel);

        localStorage.setItem('tasklabels', taskLabelsArr);
        // listTableBody.appendChild(localStorage.getItem('tasklabel1'));
        // const newrow = document.createElement("tr");
        // listTableBody.appendChild(newrow);
        // newrow.innerHTML = "<td>"+taskLabel+"</td><td><i class='bi bi-pen'></i></td><td><i class='bi bi-trash'></i></td>";
    }
    else {
        errorSpace2.innerHTML = "<span>Cannot add an empty task label!</span>";
    }
}

window.addEventListener('load', ()=>{
    try{
        let listItem = localStorage.getItem('tasklabels').split(',');
        // console.log(listItem.length);
        for(let i in listItem) {
            // console.log(listItem[i]);
            const newrow = document.createElement("tr");
            listTableBody.appendChild(newrow);
            newrow.id = i;
            newrow.innerHTML = "<td>"+listItem[i]+"</td><td><i class='bi bi-pen'></i></td><td><i class='bi bi-trash'></i></td>";
        }
    }
    catch(e) {
        const newrow = document.createElement("tr");
        listTableBody.appendChild(newrow);
        newrow.innerHTML = "<h4>No records to display</h4>";
    }
})