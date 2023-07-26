// Requête POST avec Fetch
  const form = {
    email: document.querySelector("#email"),
    password: document.querySelector("#motdepasse"),
    submit: document.querySelector("#btn-connecter"),
  };



  //console.log(form.email.value, form.motdepasse.value);

form.submit.addEventListener("click", (e) => {
    e.preventDefault();
    const url="http://localhost:5678/api/users/login";
  fetch(url, {
    method: 'POST',
    //mode: 'no-cors',
    headers: {
      "accept": "application/json",
      "Content-Type": "application/json"
    },
    // body: '{\n  "email": "sophie.bluel@test.tld",\n  "password": "S0phie"\n}',
    body: JSON.stringify({
      'email': form.email.value,
      'password': form.password.value
    })
  })
    .then((response) => {
      if (response.status == 200) {
        return response.json()
      } else {
        alert("Error Password or Username")
      }
    })
    .then((data) => {
      if (data.error) {
        alert("Error Password or Username") /*displays error message*/
      } else {
        sessionStorage.setItem('token', data.token);//stocker le token en local pour le récuperer dans la page index
        
        //logResponse("loginResponse", `localStorage set with token value: ${data.token}`)
        console.log(data.token)
        window.open("index.html","_self"); /*opens the target page while Id & password matches*/
      }

    })
    .catch(console.error)
  });
