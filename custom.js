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

function getLoggedInUser() {
    let session_list = sessionStorage.getItem('loggedIn');
    let isAlreadyLogged = JSON.parse(session_list);
    const this_user = isAlreadyLogged.user;
    return this_user;
}

const targetlink = document.querySelector("#gotoRegister");
const targetlink2 = document.querySelector("#gotoLogin");
const gotoLogin = document.querySelector("#Login");
const gotoRegister = document.querySelector("#Register");
const gotoDashBoard = document.querySelector("#dashboard");
const defaultPage = document.querySelector("#default");
const list_section = document.querySelector("#listlabel_section");



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
            context_user = getUser(username);

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
const errorSpace2 = newListForm.querySelector(".error");
const todo_task_list = document.querySelector("#task-lists");
let taskLabelsArr = [];

// adding new task labels
newListForm.addEventListener('submit', addTaskLabel);

function addTaskLabel(event) {
    event.preventDefault();
    const taskLabel = newListForm.querySelector("#task-title").value;

    if(taskLabel !== '') {
        let user = getLoggedInUser();
        const existingTodoLabels = localStorage.getItem('tasklabels');

        const new_task = {
            taskId: ~~((Math.random() * 100) + 1),
            label: taskLabel,
            completed: false
        };
        taskLabelsArr.push(new_task);
        saveTaskToStorage(taskLabelsArr);
    }
    else {
        errorSpace2.innerHTML = "<span>Cannot add an empty task label!</span>";
    }
}

function saveTaskToStorage(task) {
    localStorage.setItem('tasklabels', JSON.stringify(task));
    displayTaskLabels(task);
}

function displayTaskLabels(allTasks) {
    todo_task_list.innerHTML = "";

    allTasks.forEach( taskItem => {
        const isCompleted = taskItem.completed ? 'checked' : '';
        const li = document.createElement("li");
        li.setAttribute('class', 'task');
        li.id = taskItem.taskId;

        li.innerHTML = `<input type="checkbox" ${isCompleted}>
                        ${taskItem.label}
                        <i class="bi bi-trash delete"></i>`;

        if(taskItem.completed) {
            li.classList.add(isCompleted);
        }


        todo_task_list.appendChild(li);
    });
}

function fetchTasksLabels() {
    const get_labels = localStorage.getItem('tasklabels');
    if(get_labels) {
        taskLabelsArr = JSON.parse(get_labels);
        displayTaskLabels(taskLabelsArr);
    }
}

fetchTasksLabels();

function markAsCompleted(id) {
    taskLabelsArr.forEach((task)=>{
        if(task.taskId == id) {
            task.completed = !task.completed;
        }
    })

    saveTaskToStorage(taskLabelsArr);
}

function deleteTask(id) {
    taskLabelsArr = taskLabelsArr.filter((a_task)=>{
        return a_task.taskId != id;
    });

    saveTaskToStorage(taskLabelsArr);
}


// clicking any todolist
todo_task_list.addEventListener('click', (event)=>{
    if(event.target.type === 'checkbox') {
        markAsCompleted(event.target.parentElement.getAttribute('id'));
    }

    
    if(event.target.classList.contains('delete')) {
        deleteTask(event.target.parentElement.getAttribute('id'));
    }
});

/*===================================profile settings=======================================*/
const profile_btn = document.querySelector("#account-settings");
const profile_pg = document.querySelector("#profile-tools");
const update_form = document.getElementById("update-form");
// update fields
const u_name = update_form.querySelector("#u_name");
const f_name = update_form.querySelector("#f_name");
const l_name = update_form.querySelector("#l_name");
const p1 = update_form.querySelector("#p1");

profile_btn.addEventListener('click', viewProfile, {once:true, passive: false});

function viewProfile(event) {
    event.preventDefault();

    let current_user = getLoggedInUser();
    profile_pg.style.display = "block";
    list_section.style.display = "none";
    let data = getUser(current_user);
    u_name.value = current_user;
    f_name.value = data.fname;
    l_name.value = data.lname;
    p1.value = data.pass;
}

function getUser(this_user) {
    let users_list = localStorage.getItem('users'); //list of all users
    let to_obj = JSON.parse(users_list);
    let context_user = to_obj[this_user];
    return context_user;
}

function updateProfile(event) {
    event.preventDefault();
    let users_list = localStorage.getItem('users'); //list of all users
    let to_obj = JSON.parse(users_list);
    let current_user = getLoggedInUser();

    let olderData = to_obj;


    const new_fname = update_form.querySelector("#f_name").value;
    const new_lname = update_form.querySelector("#l_name").value;
    const new_p1 = update_form.querySelector("#p1").value;

    olderData[current_user] = {
        fname: new_fname,
        lname: new_lname,
        pass: new_p1,
        rememberMe: false
    };
    localStorage.setItem('users', JSON.stringify(olderData));
    setTimeout(()=>{
        alert("Your Profile was updated successfuly!");
    }, 1000);
}

update_form.addEventListener('submit', updateProfile, {once: true, passive: false})
