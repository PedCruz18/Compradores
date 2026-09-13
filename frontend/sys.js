// arquivo inicial prototipo para conter todas as ligações com o backend

// formulario inicial login
document.getElementById("btn-login-submit").addEventListener("click", function() {

    var email = document.getElementById("login-email").value;
    var password = document.getElementById("login-password").value;

    console.log("E-mail informado:", email);
    console.log("Senha informada:", password);

});

console.log("Script sys.js carregado com sucesso.");