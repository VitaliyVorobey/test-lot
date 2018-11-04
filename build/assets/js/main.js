var mas = [];
function formSubmit() {
    var n = document.getElementById('nameInput').value;
    var s = document.getElementById('surnameInput').value;
    var e = document.getElementById('emailInput').value;
    var p = document.getElementById('phoneInput').value;
    var d = document.getElementById('dateInput').value;
    var val = {name: n, surname: s, email: e, phone: p, date: d};
    mas.push(val);
    console.log(mas);
    var countMas = mas.length;
    var tr = document.createElement('tr');
    var items = ['name', 'surname', 'email', 'phone', 'date'];
    for (var i = 0; i < countMas; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 5; j++) {
            var td = document.createElement('td');
            var item = mas[i][items[j]];
            td.innerHTML = item ? item : item;
            tr.appendChild(td);
        }
    }
    document.getElementById('tbodyMas').appendChild(tr);
}


var winnerBtn = document.getElementById('winnerBtn');
winnerBtn.addEventListener('click', function () {
    var result = document.getElementById('result');
    var rand = Math.floor(Math.random() * mas.length);
    var randName = mas[rand].name;
    result.innerHTML = randName;
});