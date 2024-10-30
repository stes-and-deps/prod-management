var sec_left = 0;
var is_running = false;
var timer;


document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('after_btn')
        .addEventListener('click', start1);
    document.getElementById('when_btn')
        .addEventListener('click', start2);
    document.getElementById('reset_btn')
        .addEventListener('click', reset);
    main();
});


function main() {
    is_running = (localStorage.getItem("is_running") == 1);
    if (is_running) {
        document.getElementById("hour")
            .readOnly = true;
        document.getElementById("min")
            .readOnly = true;
        var end_time = new Date(localStorage.getItem("end_time"));
        var current_time = Date.now();
        sec_left = (end_time - current_time) / 1000;
        var msg = "<strong>Alarm At " + end_time.getHours() + " : " + end_time.getMinutes() + "</strong>";
        document.getElementById("msg")
            .innerHTML = msg;
        var temp = Math.floor(sec_left / 3600);
        document.getElementById("hour")
            .value = temp;
        temp = sec_left % 3600;
        document.getElementById("min")
            .value = Math.floor(temp / 60);
        temp = temp % 60;
        document.getElementById("sec")
            .value = temp;
        update_time();
    } else {
        document.getElementById("hour")
            .readOnly = false;
        document.getElementById("min")
            .readOnly = false;
        var msg = "<strong> Alarm </strong>";
        document.getElementById("msg")
            .innerHTML = msg;
    }
}


function start1() {
    is_running = (localStorage.getItem("is_running") == 1);
    if (!is_running) {
        var h = parseInt(document.getElementById("hour")
            .value);
        var m = parseInt(document.getElementById("min")
            .value);
        var is_valid = validate1(h, m);

        if (is_valid) {
            var start_time = new Date();
            sec_left = (h * 60 + m) * 60;
            var end_time = new Date(start_time.getTime() + (sec_left * 1000));
            chrome.runtime.sendMessage({
                ends: end_time.getTime(),
                seconds: sec_left,
            });
            var msg = "<strong>Alarm At " + end_time.getHours() + " : " + end_time.getMinutes() + "</strong>";
            document.getElementById("msg")
                .innerHTML = msg;
            update_time();
        } else {
            var msg = "<strong style='color: red'>Invalid Input!</strong>";
            document.getElementById("msg")
                .innerHTML = msg;
        }
    }
}


function start2() {
    is_running = (localStorage.getItem("is_running") == 1);
    if (!is_running) {
        var h = parseInt(document.getElementById("hour")
            .value);
        var m = parseInt(document.getElementById("min")
            .value);
        var is_valid = validate2(h, m);

        if (is_valid) {
            document.getElementById("hour")
                .readOnly = true;
            document.getElementById("min")
                .readOnly = true;

            var start_time = new Date();
            var end_time = new Date();
            end_time.setHours(h);
            end_time.setMinutes(m);
            end_time.setSeconds(0);
            var diff = (end_time - start_time) / 1000;
            sec_left = diff;

            chrome.runtime.sendMessage({
                ends: end_time.getTime(),
                seconds: sec_left,
                isAfter: false
            });

            var temp = Math.floor(diff / 3600);
            document.getElementById("hour")
                .value = temp;
            temp = diff % 3600;
            document.getElementById("min")
                .value = Math.floor(temp / 60);
            temp = temp % 60;
            document.getElementById("sec")
                .value = temp;
            var msg = "<strong>Alarm At " + end_time.getHours() + " : " + end_time.getMinutes() + "</strong>";
            document.getElementById("msg")
                .innerHTML = msg;
            update_time();
        } else {
            var msg = "<strong style='color: red'>Invalid Input!</strong>";
            document.getElementById("msg")
                .innerHTML = msg;
        }
    }
}


function reset() {
    document.getElementById("hour")
        .readOnly = false;
    document.getElementById("min")
        .readOnly = false;
    document.getElementById("hour")
        .value = 0;
    document.getElementById("min")
        .value = 0;
    document.getElementById("sec")
        .value = 0;
    clearTimeout(timer);
    var msg = "<strong>reset complete</strong>";
    document.getElementById("msg")
        .innerHTML = msg;

    chrome.runtime.sendMessage({
        isReset: true
    });
}


function validate1(h, m) {
    if (h == 0 && m == 0) return false;
    return (h >= 0 && h <= 24) && (m >= 0 && m <= 60);
}


function validate2(h, m) {
    var b1 = validate1(h, m);
    if (!b1) return false;
    var d1 = new Date();
    var d2 = new Date();
    d2.setHours(h);
    d2.setMinutes(m);
    d2.setSeconds(0);
    return (d2 - d1) > 0;
}


function update_time() {
    timer = setTimeout(update_time, 1000);

    var hour = document.getElementById("hour");
    var min = document.getElementById("min");
    var sec = document.getElementById("sec");
    var hour_value = hour.value;
    var min_value = min.value;
    var sec_value = sec.value;

    if (sec_value == 0) {
        sec.value = 59;
        if (min_value == 0) {
            min.value = 59;
            if (hour_value == 0) {
                sec.value = 0;
                min.value = 0;
                var msg = "<strong>Time is Up!</strong>";
                document.getElementById("msg")
                    .innerHTML = msg;
                clearTimeout(timer);
            } else {
                hour.value = hour_value - 1;
            }
        } else {
            min.value = min_value - 1;
        }
    } else {
        sec.value = Math.floor(sec_value - 1);
    }
}
