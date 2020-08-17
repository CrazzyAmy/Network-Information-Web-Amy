let YMD = ['2020/2/23', '2020/2/23', '2020/2/23', '2020/2/24', '2020/2/24', '2020/2/24', '2020/2/25'];
let Time = ['18:54', '18:55', '18:56', '18:57', '18:58', '18:59', '19:00'];
let IP_from = ['46.229.168.154', '101.15.163.68', '49.159.115.3', '120.126.194.247', '120.126.194.155', '101.15.163.68', '66.249.64.212'];
let IP_to = ['120.126.198.7', '120.126.193.166', '120.126.193.166', '104.244.43.131', '162.125.36.1', '120.126.193.166', '120.126.193.166'];
let count = 0;


let openNav = function () {
    document.getElementById("mySidenav").style.width = "250px";
    $('.info').fadeIn();
}
let closeNav = function () {
    document.getElementById("mySidenav").style.width = "0px";
    $('.info').fadeOut('fast');
}

let randomInRange = function (from, to) {
    let x = Math.random() * (to - from);
    return x + from;
};
let infoAdd = function () {
    $(".info:last").append('<div class="info_div"></div>');
    $('.info_div:last').append('<div class="info_div_ymd_time"><div class="info_date">Date : ' +
        YMD[count] + '</div><div class="info_time">Time : ' +
        Time[count] + '</div></div><div class="info_div_ipFrom_ipTo"><div class="info_ipFrom">IP from : ' +
        IP_from[count] + '</div><div class="info_ipTo">IP to : ' +
        IP_to[count] + '</div></div>')

    if ($('.info').height() > window.innerHeight - 50) {
        $('.info_div:first').remove();
    }

    count++;
    if (count == 7) {
        count = 0;
    }
}
let CountDown = setInterval(infoAdd, randomInRange(5, 10) * 1000)