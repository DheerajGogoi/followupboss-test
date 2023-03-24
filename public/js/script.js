console.log(window.location);
document.getElementById("btn-text").style.display = "block";
document.getElementById("loading-status").style.display = "none";

const onChange_select = (value) => {
    let channel = (value.value).toLowerCase();
    console.log(channel);
    console.log(window.location);
    let location = `${window.location.origin}/path/main/${channel}${window.location.search}`;
    window.location = location;
}

const goback = () => {
    history.back();
}

const formSubmit = () => {
    document.getElementById("btn-text").style.display = "none";
    document.getElementById("loading-status").style.display = "block";
}