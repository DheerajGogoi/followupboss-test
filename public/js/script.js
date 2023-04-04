console.log(window.location);
document.getElementById("btn-text").style.display = "block";
document.getElementById("loading-status").style.display = "none";

if(document.getElementById("select-channel").value !== "SMS"){
    document.getElementById("channel_select").disabled = true;
}

if(document.getElementById("select-channel").value === "[delete]"){
    document.getElementById("msg-text").style.display = "none";
    document.getElementById("msg-text").required = false;
} else {
    document.getElementById("msg-text").style.display = "block";
    document.getElementById("msg-text").required = true;
}

const onChange_select = (value) => {
    let channel = (value.value).toLowerCase();
    console.log(channel);
    if(channel === "[delete]"){
        document.getElementById("msg-text").style.display = "none";
        document.getElementById("msg-text").required = false;
    } else {
        document.getElementById("msg-text").style.display = "block";
        document.getElementById("msg-text").required = true;
    }
    
    if(channel !== "sms"){
        document.getElementById("channel_select").disabled = true;
    } else {
        document.getElementById("channel_select").disabled = false;
    }
}

const goback = () => {
    history.back();
}

const formSubmit = () => {
    document.getElementById("btn-text").style.display = "none";
    document.getElementById("loading-status").style.display = "block";
}