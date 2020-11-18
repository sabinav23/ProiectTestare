window.onload = init;

function init() {
    setRegisterEvents();
}

function setRegisterEvents() {
    $('.register-btn').on('click', function () {
        const fullName = $('#fullName').val();
        const username = $('#username').val();
        const password = $('#password').val();
        const email = $('#email').val();
        const gender = $('#gender').val();

        const user = {
            fullName: fullName,
            username: username,
            password: password,
            email: email,
            gender: gender
        };

        if (validForm(user) != false) {
            sendCreateRequest(user);
        } 
    })
}

function sendCreateRequest(user) {
    $.ajax({
        url: 'http://localhost:3000/api/user/',
        type: 'POST',
        data: JSON.stringify(user),
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            toastr['success']('You can log in now!', 'Successfully Registered', toastrOptions);
            window.location = '/login';
        },
        error: function (error) {
            toastr['error']('Username is already taken!', 'Registration Failure', toastrOptions);
        }
    });
}

function validForm(user) {
    if (user.fullName.length >= 4) {
        if (user.username.length >= 4) {
            if (user.password.length >= 4) {
                if (user.email.includes('@') && user.email.includes('.')) {
                    return true;
                } else {
                    toastr['error']('Please insert a valid email address!', 'Registration Failure', toastrOptions);
                    return false;
                }
            } else {
                toastr['error']('Password must contain at least 4 characters!', 'Registration Failure', toastrOptions);
                return false;
            }
        } else {
            toastr['error']('Username must contain at least 4 characters', 'Registration Failure', toastrOptions);
            return false;
        }
    } else {
        toastr['error']('Full Name must contain at least 4 characters', 'Registration Failure', toastrOptions);
        return false;
    }
}