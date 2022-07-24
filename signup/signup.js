function signup(e){
    e.preventDefault();
    const form = new FormData(e.target);

    const userDetails = {
        name: form.get('name'),
        email: form.get('email'),
        phone: form.get('phone'),
        password: form.get('password')
    }
    console.log(userDetails);

    axios.post('http://localhost:4000/user/signup',userDetails)
    .then(res=>{
        if(res.status===201){
            // alert('User Created Successfully! Please Login....')
            alert(`${res.data.message}`)
            console.log(res);
            // window.location.href = "../login/login.html";
        }
    })
    .catch(err=>{
        // console.log(err);
        alert(`${err.response.data.message}`)
        // window.location.href = "../login/login.html";
    })
}