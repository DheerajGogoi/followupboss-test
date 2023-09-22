console.log(window.location);
document.getElementById("btn-text").style.display = "block";
document.getElementById("loading-status").style.display = "none";

//for ai textarea
document.getElementById("ai-text").style.display = "none";
document.getElementById("ai-text").required = false;

if(document.getElementById("select-channel").value !== "SMS"){
    document.getElementById("channel_select").disabled = true;
}

if(document.getElementById("select-channel").value === "[delete]" || document.getElementById("select-channel").value === "opt lead out-dnd" || document.getElementById("select-channel").value === "OPT LEAD OUT-DND"){
    document.getElementById("msg-text").style.display = "none";
    document.getElementById("msg-text").required = false;

    document.getElementById("ai-text").style.display = "none";
    document.getElementById("ai-text").required = false;
} else if (document.getElementById("select-channel").value === "ask.ai - beta" || document.getElementById("select-channel").value === "Ask.Ai - Beta"){
    document.getElementById("msg-text").style.display = "none";
    document.getElementById("msg-text").required = false;

    document.getElementById("ai-text").style.display = "block";
    document.getElementById("ai-text").required = true;
} else {
    document.getElementById("ai-text").style.display = "none";
    document.getElementById("ai-text").required = false;

    document.getElementById("msg-text").style.display = "block";
    document.getElementById("msg-text").required = true;
}

const onChange_select = (value) => {
    let channel = (value.value).toLowerCase();
    console.log(channel);
    if(channel === "[delete]" || channel === "opt lead out-dnd"){
        document.getElementById("msg-text").style.display = "none";
        document.getElementById("msg-text").required = false;

        document.getElementById("ai-text").style.display = "none";
        document.getElementById("ai-text").required = false;
    } else if (channel === "ask.ai - beta") {
        document.getElementById("msg-text").style.display = "none";
        document.getElementById("msg-text").required = false;

        document.getElementById("ai-text").style.display = "block";
        document.getElementById("ai-text").required = true;
    } else {
        document.getElementById("msg-text").style.display = "block";
        document.getElementById("msg-text").required = true;

        document.getElementById("ai-text").style.display = "none";
        document.getElementById("ai-text").required = false;
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

const connectCall = () => {
    document.getElementById("call-text").style.display = "none";
    document.getElementById("call-subtext").style.display = "none";
    document.getElementById("call-loading").style.display = "block";
}