const signupForm = document.getElementById("signupForm")
const loginForm = document.getElementById("loginForm")
const tokenForm = document.querySelector(".tokenConfirmForm")
const tokenInput = document.getElementById("token_value")
const tokenCopyBtn = document.getElementById("copy_token_btn")

const errorMsg = document.getElementById("errorMsg")
const confirmErrorMsg = document.getElementById("confirmErrorMsg")

if(signupForm) signupForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(signupForm);
    const login = formData.get('login');
    const password = formData.get('password');
    const passwordConfirm = formData.get('passwordConfirm');

    if(!login || !password || !passwordConfirm) {
         errorMsg.textContent = "Login, senha e confirmaçao de senha não podem ser vazios!"
         return
    }
    if(password !== passwordConfirm) {
        errorMsg.textContent = "Senha e confirmação de senha precisam ser iguais."
        return
    }
    if(password.length < 8){
        errorMsg.textContent = "O tamanho da senha não pode ser menor que 8 caracteres."
        return
    }

    let response = null;
    await fetch("/auth/signup", {
        method:"POST", 
        body: JSON.stringify({ login, password, passwordConfirm }),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((resp) => {
        if(!resp.ok) {
            if(resp.status === 404) {
                errorMsg.textContent = "Login e/ou senha está incorreto."
            }
            else if(resp.status === 422) {
                errorMsg.textContent = "Login ou senha não podem ser vazios!"
            }
            else {
                errorMsg.textContent = "Não foi possível registrar o usuário"
            }
            throw new Error("Could not register user!")
        }
        return resp.json()
    })
    .then((data) => response = data)
    .catch((err) => console.error(err))

    if(response) {
        signupForm.classList.add("hidden")
        tokenForm.classList.remove("hidden")
        tokenInput.value = response.token.trim()
    }
})

if(loginForm) loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = new FormData(loginForm);
    const login = formData.get('login');
    const password = formData.get('password');

    if(!login || !password) {
        errorMsg.textContent = "Login ou senha não podem ser vazios!"
        return
    }

    let response = null;
    await fetch("/auth/login", {
        method:"POST", 
        body: JSON.stringify({ login, password }),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then((resp) => {
        if(!resp.ok) {
            if(resp.status === 404) {
                errorMsg.textContent = "Login e/ou senha está incorreto."
            }
            else if(resp.status === 422) {
                errorMsg.textContent = "Login ou senha não podem ser vazios!"
            }
            else {
                errorMsg.textContent = "Não foi possível autenticar o usuário"
            }
            throw new Error("Could not authenticate user!")
        }
        return resp.json()
    })
    .then((data) => response = data)
    .catch((err) => console.error(err))

    if(response){
        saveLocalUser(response.user, response.token)
        window.location.href = "/"
    }
})

if(tokenForm) tokenForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const token = tokenInput.value

    const success = await verifyUser(token)
    if(!success) {
        confirmErrorMsg.textContent = "Não foi possível confirmar o token. Verifique se enviou o texto correto."
    }
})

if(tokenInput) tokenInput.addEventListener('click', () => {
    tokenInput.select();
    tokenInput.setSelectionRange(0, 99999);
})

if(tokenCopyBtn) tokenCopyBtn.addEventListener("click", async () => {
    tokenInput.select();
    tokenInput.setSelectionRange(0, 99999);

    try {
        await navigator.clipboard.writeText(tokenInput.value);
        tokenCopyBtn.textContent = "COPIADO!"
        tokenCopyBtn.disabled = true
    } catch (err) {
        console.error('Error while copying:', err);
    }
})

const saveLocalUser = (user, token) => {
    localStorage.setItem("token", JSON.stringify(token))
    localStorage.setItem("user", JSON.stringify(user))
}

const removeLocalUser = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}


const verifyUser = async (token) => {
    let response = null;
    await fetch("/token/confirm", {
            method:"POST", 
            body: JSON.stringify({token}),
            headers: {
                'Content-Type': 'application/json'
            },
    }).then((resp) => {
            if(!resp.ok) throw new Error("Could not confirm token!")
            return resp.json()
    })
    .then((data) => response = data)
    .catch((err) => console.error(err))

    if(response) {
        saveLocalUser(response.user, response.token)
        const locationPath = window.location.pathname
        if(['/login', '/signup'].includes(locationPath)) {
            window.location.href = "/"
        }
    }
    else {
        removeLocalUser()
        const locationPath = window.location.pathname
        if(!['/login', '/signup'].includes(locationPath)) {
            window.location.href = "/login"
        }
    }

    console.log(response)
    return !!response
}

document.addEventListener("DOMContentLoaded", async () => {
    const logoutBtn = document.getElementById("logoutBtn")
    const json = localStorage.getItem("token")
    
    if(json) {
        const token = JSON.parse(json)
        await verifyUser(token)
    }

    if(logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            await fetch("/auth/logout", {method:"POST"}).then((resp) => {
                if(!resp.ok) throw new Error("Could not logout user!")
                else {
                    removeLocalUser()
                    window.location.href = "/login"
                }
            })
            .catch((err) => console.error(err))
        })
    }
})