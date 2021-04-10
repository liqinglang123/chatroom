var socket = io('localhost:3000');

let user = {};


$('#loginbtn').on('click', function() {
    var portrait = $('.user_portrait img').attr('src');
    // console.log(portrait);
    var username = $('.input-group input').val().trim();

    if (!username) {
        alert('请输入用户名');
        return;
    }
    socket.emit('login', {
        username: username,
        portrait: portrait
    });
});

socket.on('loginFail', data => {
    $('#loginInfo').fadeIn();
    return;
    // setTimeout(() => {
    //     $('#loginInfo').fadeOut();

    // }, 4000);
});

socket.on('loginSuccess', data => {
    $('#loginScene').fadeOut();
    $('#loginScene').remove();

    $('#roomScene').fadeIn();

    user.username = data.username;
    user.portrait = data.portrait;

});

socket.on('addNew', data => {
    $('.chat_info').append(`
    <li class="systeminfo">
                    <span>【${data.username}】加入了房间</span>
                </li>
    `);
    scrollBottom();
});

socket.on('userOut', data => {
    $('.chat_info').append(`
    <li class="systeminfo">
                    <span>【${data.username}】离开了房间</span>
                </li>
    `);
    scrollBottom();
});

socket.on('userList', data => {
    $('.popover-title').text(`在线用户${data.length}人`);
    // console.log(data);
    $('.popover-content ul').html('');
    data.forEach(item => {
        $('.popover-content ul').append(`
        <li>
        <img src="${item.portrait}" alt="portrait_1">
        <b>${item.username}</b>
    </li>
        `)
    })
});

$('#subxx').on('click', function() {
    var content = $('.text input').val().trim();
    $('.text input').val('');
    // console.log('clicking')
    if (!content) {
        return;
    }

    socket.emit('sendMessage', {
        username: user.username,
        portrait: user.portrait,
        message: content,
        date: new Date().toLocaleTimeString()
    });
});

socket.on('receiveMessage', data => {
    if (data.username != user.username) {
        $('.chat_info').append(`
            <li class="left">
                    <img src="${data.portrait}" alt="">
                    <b>${data.username}</b>
                    <i>${data.date}</i>
                    <div>${data.message}</div>
                </li>
            `);
        scrollBottom();
    } else {
        $('.chat_info').append(`
        <li class="right">
        <img src="${data.portrait}" alt="">
        <b>${data.username}</b>
        <i>${data.date}</i>
        <div class="aaa">${data.message}</div>
    </li>
        `);
        scrollBottom();
    }
});

socket.on('receiveImg', data => {
    if (data.username != user.username) {
        $('.chat_info').append(`
            <li class="left">
                    <img src="${data.portrait}" alt="">
                    <b>${data.username}</b>
                    <i>${data.date}</i>
                    <div><img src="${data.message}" ></div>
                </li>
            `);
        scrollBottom();
    } else {
        $('.chat_info').append(`
        <li class="right">
        <img src="${data.portrait}" alt="">
        <b>${data.username}</b>
        <i>${data.date}</i>
        <div class="aaa"><img src="${data.message}" ></div>
    </li>
        `);
        scrollBottom();
    }
});

$('.imgFileBtn').on('change', function() {
    var file = this.files[0];

    var fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = function() {
        socket.emit('sendImg', {
            username: user.username,
            portrait: user.portrait,
            message: fr.result,
            date: new Date().toLocaleTimeString()
        });
    }
});

function scrollBottom() {
    $('.scrollbar-macosx.scroll-content.scroll-scrolly_visible').animate({
        scrollTop: $('.scrollbar-macosx.scroll-content.scroll-scrolly_visible').prop('scrollHeight')
    }, 500);
}