const opan = document.getElementById('open');
const close = document.getElementById('close');
const container = document.getElementById('container');

opan.addEventListener('click', ()=>{
    container.classList.add('active')
    
    
});

close.addEventListener('click', ()=>{
    container.classList.remove('active')
});





const token = localStorage.getItem('authToken');
let localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
let lastMsgId;


// loading page calling backend to get user list and msgs
window.addEventListener('load',()=>{
    showGroupMembers(); //this will print user 

    if(localTextSaved){
        getMessageFromLocal();
    }
    userGroups();

    setInterval(()=>{
    updateMessage();
    },3000)
})


function showGroupMembers(){
    axios.get('http://localhost:4000/chat/join',{headers:{authanticate:token}})
    .then(response=>{
        if(response.status===200){
            response.data.listOfUser.forEach(user => {
                addUserToDOM(user);
            });
        }
    })
    .catch(err=>{
        console.log(err)
        if(err.response.status===404){
            window.location.href="../404.html"
        }else{
        console.log('err')
            // window.location.href="../signup/signup.html"
        }
    })
}


// showing user list on dom
function addUserToDOM(quser){
    const parentElement = document.getElementById('user');
    parentElement.innerHTML += `
        <li id=${quser}>
            ${quser} joined the group
        </li>`
}


//mesage sending to backend and same time showing on the 
function sendmessage(e){
    e.preventDefault();

    const form = new FormData(e.target)
    const message = {
        message: form.get('message')
    }
    console.log(message);

    axios.post('http://localhost:4000/chat/message',message,{headers:{authanticate:token}})
    .then(res=>{
        if(res.status===201){
            // const userMsg = res.data.msg.message;
            // const name = res.data.msg.senderName;
            // addMsgToDOM(userMsg,name);
            document.getElementById('text-content').value = "";
        }
    })
    .catch(err=>{
        console.log(err)
        if(err.response.status===500){
            window.location.href="../signup/signup.html"
        }
    })
}

function getMessageFromLocal(){
    let  localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
    // console.log(localTextSaved);
    localTextSaved.forEach(element => {
        addMsgToDOM(element.message,element.senderName)
    });
}


function addMsgToDOM(message,name){
    const parentElement = document.getElementById('message');
    // parentElement.innerHTML = " ";
    parentElement.innerHTML += `
        <li id=${name}>
            ${name}: ${message}
        </li>`
}


function updateMessage(){
    let localTextSaved = JSON.parse(localStorage.getItem('localMessage'));
    let lastMsgId;
    if(localTextSaved){
        lastMsgId = localTextSaved[localTextSaved.length-1].id;
    }else{
        lastMsgId = 0;
    }
    // console.log(lastMsgId)
    let mergeMessageArray;
    axios.get(`http://localhost:4000/chat/recieve?id=${lastMsgId+1}`,{headers:{authanticate:token}})
    .then(res=>{
        if(res.status===200){
            const msgs = res.data.messages
            if(msgs.length>0){
                if(localTextSaved){
                    mergeMessageArray = localTextSaved.concat(msgs)
                    msgs.forEach(messageData => {
                        // console.log(messageData.message,messageData.senderName, 'inside local storage');
                        addMsgToDOM(messageData.message,messageData.senderName)
        
                    })
                }else{
                    mergeMessageArray = msgs;
                    msgs.forEach(messageData => {
                        // console.log(messageData.message,messageData.senderName,'inside backend');
                        addMsgToDOM(messageData.message,messageData.senderName)
                    })
                }
                if(mergeMessageArray.length>100){
                    let popFrontMsg = mergeMessageArray.length-100; //
                    for(var i=0;i<popFrontMsg;i++){
                        mergeMessageArray.shift();
                    }
                }
            }
            else{
                mergeMessageArray = JSON.parse(localStorage.getItem('localMessage'))
            }
            localStorage.setItem('localMessage',JSON.stringify(mergeMessageArray))

            mergeMessageArray.forEach(messageData => {
                // console.log(messageData);

            });
        }
    })
    .catch(err=>{
        console.log(err);
        if(err.response.status===404){
            window.location.href="../404.html"
        }else{
            window.location.href="../signup/signup.html"
        }
    })
}

function createGroup(e){
    e.preventDefault();

    const form = new FormData(e.target);

    const grpName = {
        groupName: form.get('groupname'),
        isAdmin: true
    }
    console.log(grpName);
    axios.post('http://localhost:4000/group/creategroup',grpName,{headers:{authanticate:token}})
    .then(response=>{
        console.log(response);
        if(response.status === 201){
            document.getElementById('groupname-input').value = "";
            alert(response.data.message)
    }
    })
    .catch(err=>{
        console.log(err);
        alert(err.response.data.message)
        if(err.response.status===404){
            window.location.href="../404.html"
        }
    })

    
}

function addMemberToGroup(e){
    e.preventDefault();

    const form = new FormData(e.target);

    const member = {
        memberEmail: form.get('member'),
        groupId: form.get('groupID')
    }
    console.log(member);
    axios.post('http://localhost:4000/group/addmember',member,{headers:{authanticate:token}})
    .then(response=>{
        if(response.status ===201){
            document.getElementById('groupname-input').value = "";
            alert(response.data.message)
        }
    })
    .catch(err=>{
        console.log(err);
        alert(err.response.data.message)
        if(err.response.status===404){
            window.location.href="../404.html"
        }
    })
}


async function userGroups(){
    try {
        const allGrpDetails = await axios.get('http://localhost:4000/group/name',{headers:{authanticate:token}})
        const list = (allGrpDetails.data.allgroupName)
        list.forEach(element => {
            const parentElement = document.getElementById('groups-list')
            parentElement.innerHTML += `
            <li id=${element.id}> 
            <button onclick="showGrpMsg(${element.id})">${element.groupName}</button>
            </li>`
        });

    } catch (error) {
        console.log(error);
        alert(error.response.data.message)
        if(error.response.status===404){
            window.location.href="../404.html"
        }
    }
}

async function showGrpMsg(id){
    try {
        const grpMessages = await axios.get(`http://localhost:4000/group/getchat?id=${id}`,{headers:{authanticate:token}});

        const textsArr = grpMessages.data.messages;

        const parentElement = document.getElementById('message');
        const userElement = document.getElementById('user');
        const form = document.getElementById("input-area")
        form.innerHTML = "";
        userElement.innerHTML = " ";
        parentElement.innerHTML = " ";
        const msgForm = document.createElement('form');
        let fn = "return myfunc(event)"
        msgForm.setAttribute('onSubmit',fn);
        
        textsArr.forEach(element => {
            parentElement.innerHTML += `
            <li id=${element.id}>
                ${element.senderName}: ${element.message}
            </li>`

        });
        let input = document.createElement('input');
        let hidden = document.createElement('input');
        hidden.name = "grp-id";
        hidden.type = "hidden";
        hidden.value = `${id}`
        input.name = 'message';
        input.type = 'text';
        input.setAttribute("id","text-input");
        input.setAttribute("placeholder","Type Message For Group...");
        let button = document.createElement('button');
        button.type = 'submit';
        button.innerHTML = "Send"
        button.na
        button.className = "fas fa-paper-plane";
        msgForm.appendChild(input);
        msgForm.appendChild(hidden);
        msgForm.appendChild(button);
        form.appendChild(msgForm);
        // console.log(textsArr);
    } catch (error) {
        console.log(error);
        if(error.response.status===404){
            window.location.href="../404.html"
        }
    }

}

async function myfunc(e){
    try {
        e.preventDefault();
    
    const form = new FormData(e.target);

    const message = {
        // message: form.get('message'),
        message: undefined,
        groupId: form.get('grp-id')
    }
    // console.log(message);

    const grpchat = await axios.post('http://localhost:4000/group/sendchat',message,{headers:{authanticate:token}})
    if(grpchat){
        const messageDetail = grpchat.data.messages;
        addMsgToDOM(messageDetail.message,messageDetail.senderName);
    }
    } catch (error) {
        console.log(error);
        if(error.response.status===404){
            window.location.href="../404.html"
        }
    }
}