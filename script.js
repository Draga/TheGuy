var cellsX = 20;
var cellsY = 20;
var startPoint = { x: cellsX / 2, y: cellsY / 2 };
var posDelimiter = '-';
var updateFrequency = 100;
var chances = {// per update
    "trolley": 0.05
};
var directions = {
    'West': { x: -1, y: 0 },
    'East': { x: 1, y: 0 },
    'North': { x: 0, y: -1 },
    'South': { x: 0, y: 1 },
};
var types = {
    0: 'none',
    2: 'TheGuy',
    3: 'trolley',
    4: 'wall',
};

var TheGuy = Array();
var map = Array();
var TheGuyDirection;

function init() {
    for (var i = 0; i < cellsY; i++) {
        map[i] = Array();
        for (var j = 0; j < cellsX; j++) {
            $('#board').append('<div id="' + j + posDelimiter + i + '"></div>');
            map[i][j] = 0;
        }
    }
    TheGuyDirection = directions['East'];
    TheGuy.push({ x: startPoint.x, y: startPoint.y }); // Init
    addTrolley(TheGuy);
    addTrolley(TheGuy);
    addTrolley(TheGuy);
    for (var i = 0; i < TheGuy.length; i++) {
        getMapDiv(TheGuy[i].x, TheGuy[i].y).addClass('TheGuy');
    }
}

function normalizePos(pos, maxPos) {
    if (pos > maxPos) {
        pos = 0;
    }
    else if (pos < 0) {
        pos = maxPos;
    }
    return pos;
}

function move(element, direction) {
    element.x += direction.x;
    element.y += direction.y;
    element.x = normalizePos(element.x, cellsX - 1);
    element.y = normalizePos(element.y, cellsY - 1);
}

function addTrolley(guy) {
    var index = Math.max(guy.length - 1, 0);
    var trolley = { x: guy[index].x, y: guy[index].y };
    guy.push(trolley);
}

function getMapDiv(x, y) {
    return $('#' + x + posDelimiter + y);
}

// Takes a new map 2d array and update the map divs
function draw(newMap) {
    for (var i = 0; i < cellsY; i++) {
        for (var j = 0; j < cellsX; j++) {
            if (map[j][i] != newMap[j][i]) {
                getMapDiv(j, i).removeClass(types[map[j][i]]);
                getMapDiv(j, i).addClass(types[newMap[j][i]]);
            }
        }
    }
}

function update() {
    var startTime = new Date().getTime();

    var newMap = Array();

    var oldEnd = TheGuy.pop();
    getMapDiv(oldEnd.x, oldEnd.y).removeClass('TheGuy');

    var newHead = { x: TheGuy[0].x, y: TheGuy[0].y };
    move(newHead, TheGuyDirection);
    TheGuy.unshift(newHead);
    getMapDiv(TheGuy[0].x, TheGuy[0].y).addClass('TheGuy');
    
    // Randomly puts a trolley on the map
    if (Math.random() < chances["trolley"]) {
        var foundPos = false;
        var x;
        var y;
        while (!foundPos) {
            x = Math.round(Math.random() * cellsX);
            y = Math.round(Math.random() * cellsY);
            if (newMap[x][y] == 0) {
                foundPos = true;
                newMap[x][y] = types["trolley"];
            }
        }
    }
    
    // Draw the newly generated map
    draw(newMap);
    map = newMap;

    var elapsedTime = (new Date().getTime()) - startTime;
    setTimeout(function() { update(); }, updateFrequency - elapsedTime);
}
function main() {
    init();
    setTimeout(function() { update(); }, updateFrequency);
}

$(document).ready(function () {
    $(document).keypress(function (event) {
        switch (event.keyCode) {
            case 37://Left
                if (TheGuyDirection != directions['East'])
                    TheGuyDirection = directions['West'];
                event.preventDefault();
                break;
            case 38://Up
                if (TheGuyDirection != directions['South'])
                    TheGuyDirection = directions['North'];
                event.preventDefault();
                break;
            case 39://Right
                if (TheGuyDirection != directions['West'])
                    TheGuyDirection = directions['East'];
                event.preventDefault();
                break;
            case 40://Down
                if (TheGuyDirection != directions['North'])
                    TheGuyDirection = directions['South'];
                event.preventDefault();
                break;
            default:
                break;
        }
    });
    $(document).focus();
    main();
});