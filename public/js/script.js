const onChange_select = (value) => {
    let channel = (value.value).toLowerCase();
    console.log(channel);
    let location = `${window.location.origin}/path/main/${channel}${window.location.search}`;
    window.location = location;
}

const goback = () => {
    history.back();
}