/*===================================Global rules=======================================*/
// default check if any user is logged in
window.addEventListener('load', () => {
    try {
        let session_list = sessionStorage.getItem('loggedIn');
        let isAlreadyLogged = JSON.parse(session_list);
        if(isAlreadyLogged.rememberMe) {
            setTimeout(()=>{
                // alert("Are you sure you want to leave page?")
                gotoDashBoard.style.display = "block";
                gotoLogin.style.display = "none";
                defaultPage.style.display = "none";
            }, 1000);
        }
    } catch (e) {
        console.log();
    }
});

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
                let users = localStorage.getItem('users'); //list of all existing users
                let new_user_arr = users ? JSON.parse(users) : {};

                let new_user = {
                    fname: firstname,
                    lname: lastname,
                    pass: password,
                    rememberMe: false
                };
                new_user_arr[username] = new_user;
                localStorage.setItem('users', JSON.stringify(new_user_arr));
                //transition to dashboard
                setTimeout(()=>{
                    gotoDashBoard.style.display = "block";
                    gotoRegister.style.display = "none";
                }, 1000);
            }
            catch(e){
                console.log(e);
            }
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

loginForm.addEventListener('submit', login, {once: true, passive:false});

function login(e) {
    e.preventDefault();
    // login fields
    const username = loginForm.querySelector("#username").value;
    const password = loginForm.querySelector("#passsword").value;
    const isChecked = loginForm.querySelector("#check");

    if(username !== '' && password !== '' && isChecked.checked) {
        try {
            let users_list = localStorage.getItem('users'); //list of all users
            let to_obj = JSON.parse(users_list);
            let context_user = to_obj[username];
            if(context_user) {
                if(password === context_user.pass) {
                    let sessionlist = sessionStorage.getItem('loggedIn');
                    let sess_to_obj = sessionlist ? JSON.parse(sessionlist) : {}
                    let new_session_data = {
                        user: username,
                        rememberMe: true
                    }
                    sess_to_obj['new'] = new_session_data;
                    sessionStorage.setItem('loggedIn', JSON.stringify(new_session_data));
                    
                    setTimeout(()=>{
                        // alert("Are you sure you want to leave page?")
                        gotoDashBoard.style.display = "block";
                        gotoLogin.style.display = "none";
                    }, 1000);
                }
                else {
                    errorSpace1.innerHTML = "<span>Wrong password!</span>";
                }
            }
            else{
                errorSpace1.innerHTML = "<span>Invalid username or password!</span>";
            }
        }
        catch (e) {
            console.log(e);
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
    //get current session
    let session_list = window.sessionStorage.removeItem('loggedIn');
    // do
    gotoDashBoard.style.display = "none";
    gotoLogin.style.display = "block";
}



/*===================================adding task to task list=======================================*/
const newListForm = document.getElementById("addlist-form");
const listTableBody = document.querySelector("#table-body");
let errorSpace2 = newListForm.querySelector(".error");

// adding new task labels
newListForm.addEventListener('submit', addTaskLabel);

function addTaskLabel(event) {
    event.preventDefault();
    const taskLabel = newListForm.querySelector("#task-title").value;
    let taskId = 0;
    
    if(taskLabel !== '') {
        const existingTodoLabels = localStorage.getItem('tasklabels');
        let taskLabelsArr = existingTodoLabels ? JSON.parse(existingTodoLabels) : {};
        taskId = ~~((Math.random() *10) + 1);
        let new_task = {
            label: taskLabel,
            subtasks: {},
        }

        taskLabelsArr[taskId] = new_task;

        window.localStorage.setItem('tasklabels', JSON.stringify(taskLabelsArr));
    }
    else {
        errorSpace2.innerHTML = "<span>Cannot add an empty task label!</span>";
    }
}

window.addEventListener('load', ()=>{
    try{
        let listItems = localStorage.getItem('tasklabels');
        let list_to_obj = listItems ? JSON.parse(listItems) : {};
        let obj_keys = Object.entries(list_to_obj);
        for(let i of obj_keys) {
            for(let another in i) {
                console.log(another);
                const newrow = document.createElement("tr");
                listTableBody.appendChild(newrow);
                newrow.id = i[another][0];
                newrow.innerHTML = "<td>"+i[another].label+"</td><td><i class='bi bi-pen'></i></td><td><i class='bi bi-trash'></i></td>";
            }
        }
    }
    catch(e) {
        // const newrow = document.createElement("tr");
        // listTableBody.appendChild(newrow);
        // newrow.innerHTML = "<h4>No records to display</h4>";
    }
})