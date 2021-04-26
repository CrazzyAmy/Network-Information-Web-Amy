function move_on() {
    var bar = document.getElementById("progress_bar").style.width;
    bar = parseInt(bar, 10);
    bar += 34;
    switch (bar / 34) {
        case 1:
            document.getElementById("user").style.animationName = "animate";
            document.getElementById("user_label").style.animationName = "animate";
            document.getElementById("password").style.animationName = "animate";
            document.getElementById("password_label").style.animationName = "animate";
            document.getElementById("user").style.animationDirection = "normal";
            document.getElementById("user_label").style.animationDirection = "normal";
            document.getElementById("password").style.animationDirection = "normal";
            document.getElementById("password_label").style.animationDirection = "normal";
            setTimeout(function () {
                document.getElementById("user").style.display = "none";
                document.getElementById("user_label").style.display = "none";
                document.getElementById("password").style.display = "none";
                document.getElementById("password_label").style.display = "none";
                document.getElementById("fortseim_account_label").style.display = "block";
                document.getElementById("fortseim_account").style.display = "inline";
                document.getElementById("fortseim_password_label").style.display = "block";
                document.getElementById("fortseim_password").style.display = "inline";
            }, 800);
            break;
        case 2:
            document.getElementById("fortseim_account").style.animationName = "animate";
            document.getElementById("fortseim_account_label").style.animationName = "animate";
            document.getElementById("fortseim_password_label").style.animationName = "animate";
            document.getElementById("fortseim_password").style.animationName = "animate";
            document.getElementById("fortseim_account").style.animationDirection = "normal";
            document.getElementById("fortseim_account_label").style.animationDirection = "normal";
            document.getElementById("fortseim_password_label").style.animationDirection = "normal";
            document.getElementById("fortseim_password").style.animationDirection = "normal";
            setTimeout(function () {
                document.getElementById("fortseim_account_label").style.display = "none";
                document.getElementById("fortseim_account").style.display = "none";
                document.getElementById("fortseim_password_label").style.display = "none";
                document.getElementById("fortseim_password").style.display = "none";
                document.getElementById("IP").style.display = "inline";
                document.getElementById("level").style.display = "inline";
                document.getElementById("IP_label").style.display = "block";
                document.getElementById("level_label").style.display = "block";
            },800);
            break;
        case 3:
            document.getElementById("IP").style.animationName = "animate";
            document.getElementById("level").style.animationName = "animate";
            document.getElementById("IP_label").style.animationName = "animate";
            document.getElementById("level_label").style.animationName = "animate";
            document.getElementById("IP").style.animationDirection = "normal";
            document.getElementById("level").style.animationDirection = "normal";
            document.getElementById("IP_label").style.animationDirection = "normal";
            document.getElementById("level_label").style.animationDirection = "normal";
            setTimeout(function () {
                document.getElementById("IP").style.display = "none";
                document.getElementById("level").style.display = "none";
                document.getElementById("IP_label").style.display = "none";
                document.getElementById("level_label").style.display = "none";
                document.getElementById("end_text").style.display = "block";
            }, 800);
            break;
    }
    document.getElementById("previous_btn").style.visibility = "visible";
    if (bar >= 100) {
        document.getElementById("next_btn").innerText = "finish";
    }
    document.getElementById("progress_bar").style.width = bar+"%";
}
function move_previous() {
    var bar = document.getElementById("progress_bar").style.width;
    document.getElementById("next_btn").innerText = "next>>";
    bar = parseInt(bar, 10);
    bar -= 34;
    switch (bar / 34) {
        case 0:
            document.getElementById("user").style.display = "inline";
            document.getElementById("user_label").style.display = "block";
            document.getElementById("password").style.display = "inline";
            document.getElementById("password_label").style.display = "block";
            document.getElementById("user").style.animationDirection = "reverse";
            document.getElementById("user_label").style.animationDirection = "reverse";
            document.getElementById("password").style.animationDirection = "reverse";
            document.getElementById("password_label").style.animationDirection = "reverse";
            document.getElementById("fortseim_account").style.animationName = "none";
            document.getElementById("fortseim_account_label").style.animationName = "move_up";
            document.getElementById("fortseim_password_label").style.animationName = "move_up";
            document.getElementById("fortseim_password").style.animationName = "none";
            document.getElementById("fortseim_account_label").style.display = "none";
            document.getElementById("fortseim_account").style.display = "none";
            document.getElementById("fortseim_password_label").style.display = "none";
            document.getElementById("fortseim_password").style.display = "none";

            setTimeout(function () {
                document.getElementById("user").style.animationName = "none";
                document.getElementById("user_label").style.animationName = "move_up";
                document.getElementById("password").style.animationName = "none";
                document.getElementById("password_label").style.animationName = "move_up";
                document.getElementById("user_label").style.animationDirection = "normal";
                document.getElementById("password_label").style.animationDirection = "normal";
            }, 800);
            break;
        case 1:
            document.getElementById("fortseim_account_label").style.display = "block";
            document.getElementById("fortseim_account").style.display = "inline";
            document.getElementById("fortseim_password_label").style.display = "block";
            document.getElementById("fortseim_password").style.display = "inline";
            document.getElementById("fortseim_account_label").style.animationDirection = "reverse";
            document.getElementById("fortseim_account").style.animationDirection = "reverse";
            document.getElementById("fortseim_password_label").style.animationDirection = "reverse";
            document.getElementById("fortseim_password").style.animationDirection = "reverse";
            document.getElementById("IP").style.animationName = "none";
            document.getElementById("level").style.animationName = "none";
            document.getElementById("IP_label").style.animationName = "move_up";
            document.getElementById("level_label").style.animationName = "move_up";
            document.getElementById("IP").style.display = "none";
            document.getElementById("level").style.display = "none";
            document.getElementById("IP_label").style.display = "none";
            document.getElementById("level_label").style.display = "none";

            setTimeout(function () {
                document.getElementById("fortseim_account_label").style.animationName = "move_up";
                document.getElementById("fortseim_account").style.animationName = "none";
                document.getElementById("fortseim_password_label").style.animationName = "move_up";
                document.getElementById("fortseim_password").style.animationName = "none";
                document.getElementById("fortseim_account_label").style.animationDirection = "normal";
                document.getElementById("fortseim_password_label").style.animationDirection = "normal";
            }, 800);
            break;
        case 2:
            document.getElementById("IP").style.animationDirection = "reverse";
            document.getElementById("level").style.animationDirection = "reverse";
            document.getElementById("IP_label").style.animationDirection = "reverse";
            document.getElementById("level_label").style.animationDirection = "reverse";
            document.getElementById("IP").style.display = "inline";
            document.getElementById("level").style.display = "inline";
            document.getElementById("IP_label").style.display = "block";
            document.getElementById("level_label").style.display = "block";
            document.getElementById("end_text").style.display = "none";
            setTimeout(function () {
                document.getElementById("IP").style.animationName = "none";
                document.getElementById("level").style.animationName = "none";
                document.getElementById("IP_label").style.animationName = "move_up";
                document.getElementById("level_label").style.animationName = "move_up";
                document.getElementById("IP_label").style.animationDirection = "normal";
                document.getElementById("level_label").style.animationDirection = "normal";
            }, 800);
            break;
    }
    if (bar<=0) {
        bar = 0;
        document.getElementById("previous_btn").style.visibility="hidden";
    }
    document.getElementById("progress_bar").style.width = bar + "%";
}