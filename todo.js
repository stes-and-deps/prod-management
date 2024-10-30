(function() {

    var list = document.querySelector('#list'),
        form = document.querySelector('form'),
        item = document.querySelector('#item');



    document.addEventListener('DOMContentLoaded', function() {

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            list.innerHTML += '<li>' + item.value + '</li>';
            store();
            item.value = "";
        }, false)

        list.addEventListener('click', function(e) {
            var t = e.target;
            if (t.classList.contains('checked')) {
                t.parentNode.removeChild(t);
            } else {
                t.classList.add('checked');
            }
            store();
        }, false)
    });

    function store() {
        window.localStorage.myitems = list.innerHTML;
    }

    function getValues() {
        var storedValues = window.localStorage.myitems;
        if (storedValues) {
            list.innerHTML = storedValues;
        }
    }
    getValues();
})();
