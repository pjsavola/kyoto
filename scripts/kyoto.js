// Global variable definitions

var deckItem = document.getElementById("deck");
var deckButton = document.getElementById("deckButton");
var card1Button = document.getElementById("card1Button");
var card2Button = document.getElementById("card2Button");
var card3Button = document.getElementById("card3Button");
var log = document.getElementById("history");
var animations = true;
var hands; // player hands
var areas; // player areas
var data;  // game data
var playerNames;
var playerCount;
var coalCells;
var oilCells;
var gasCells;
var woodCells;
var uraniumCells;
var totalCells;
var handCells;
var fineCells;
var cleanseCells;
var scoreCells;
var currentDeck;
var deck1;
var deck2;
var deck3;
var cardsLeft;
var lastTurn;
var turn;
var card1;
var card2;
var card3;
var startPlayer;
var quota1 = [0, 0, 6, 8, 6, 5, 4, 3];
var quota2 = [0, 0, 12, 16, 12, 10, 8, 7];
var quota3 = [0, 0, 18, 24, 18, 15, 12, 10];
var coalFines = [0, 2, 4];
var oilFines = [0, 2, 3];
var gasFines = [0, 1, 3];
var woodFines = [0, 2, 2];
var uraniumFines = [0, 1, 2];
var rawData;

// Object definitions

function Hand() {
    this.coal = 0;
    this.oil = 0;
    this.gas = 0;
    this.wood = 0;
    this.uranium = 0;
}

function Data() {
    this.total = 0;
    this.hand = 0;
    this.fines = 0;
    this.cleansed = 0;
    this.score = 0;
}

// Game initialization functions

function createData() {
    hands = new Array(playerCount);
    areas = new Array(playerCount);
    data = new Array(playerCount);
    for (i = 0; i < playerCount; i++) {
	hands[i] = new Hand();
	areas[i] = new Hand();
	data[i] = new Data();
    }
}

function deleteCells(row) {
    while (row.cells.length > 1) {
	row.deleteCell(1);
    }
}

function createPlayers() {
    playerNames = new Array(playerCount);
    coalCells = new Array(playerCount);
    oilCells = new Array(playerCount);
    gasCells = new Array(playerCount);
    woodCells = new Array(playerCount);
    uraniumCells = new Array(playerCount);
    totalCells = new Array(playerCount);
    handCells = new Array(playerCount);
    fineCells = new Array(playerCount);
    cleanseCells = new Array(playerCount);
    scoreCells = new Array(playerCount);
    var dataPlayers = document.getElementById("dataPlayers");
    var dataCoal = document.getElementById("dataCoal");
    var dataOil = document.getElementById("dataOil");
    var dataGas = document.getElementById("dataGas");
    var dataWood = document.getElementById("dataWood");
    var dataUranium = document.getElementById("dataUranium");
    var dataTotal = document.getElementById("dataTotal");
    var dataHand = document.getElementById("dataHand");
    var dataFines = document.getElementById("dataFines");
    var dataCleansed = document.getElementById("dataCleansed");
    var dataScore = document.getElementById("dataScore");
    deleteCells(dataPlayers);
    deleteCells(dataCoal);
    deleteCells(dataOil);
    deleteCells(dataGas);
    deleteCells(dataWood);
    deleteCells(dataUranium);
    deleteCells(dataTotal);
    deleteCells(dataHand);
    deleteCells(dataFines);
    deleteCells(dataCleansed);
    deleteCells(dataScore);
    for (i = 0; i < playerCount; i++) {
	playerNames[i] = "P" + (i + 1);
	if (i == 0) {
            dataPlayers.insertCell(i + 1).innerHTML = "<b>" + playerNames[i] + "</b>";
	} else {
            dataPlayers.insertCell(i + 1).innerHTML = playerNames[i];
	}
	coalCells[i] = dataCoal.insertCell(i + 1);
	coalCells[i].innerHTML = 0;
	oilCells[i] = dataOil.insertCell(i + 1);
	oilCells[i].innerHTML = 0;
	gasCells[i] = dataGas.insertCell(i + 1);
	gasCells[i].innerHTML = 0;
	woodCells[i] = dataWood.insertCell(i + 1);
	woodCells[i].innerHTML = 0;
	uraniumCells[i] = dataUranium.insertCell(i + 1);
	uraniumCells[i].innerHTML = 0;
	totalCells[i] = dataTotal.insertCell(i + 1);
	totalCells[i].innerHTML = 0;
	handCells[i] = dataHand.insertCell(i + 1);
	handCells[i].innerHTML = 0;
	fineCells[i] = dataFines.insertCell(i + 1);
	fineCells[i].innerHTML = 0;
	cleanseCells[i] = dataCleansed.insertCell(i + 1);
	cleanseCells[i].innerHTML = 0;
	scoreCells[i] = dataScore.insertCell(i + 1);
	scoreCells[i].innerHTML = 0;
    }
    document.getElementById("quota1").innerHTML = quota1[playerCount];
    document.getElementById("quota2").innerHTML = quota2[playerCount];
    document.getElementById("quota3").innerHTML = quota3[playerCount];
}

function init(count) {
    var isOperaMini = Object.prototype.toString.call(window.operamini) === "[object OperaMini]"
    animations = !isOperaMini;
    playerCount = count;
    createData();
    createPlayers();
    startPlayer = Math.floor(Math.random() * playerCount);
    turn = startPlayer;

    var deck = new Array(110);
    for (i = 0; i < 30; i++) deck[i] = "Coal";
    for (i = 30; i < 55; i++) deck[i] = "Oil";
    for (i = 55; i < 75; i++) deck[i] = "Gas";
    for (i = 75; i < 95; i++) deck[i] = "Wood";
    for (i = 95; i < 110; i++) deck[i] = "Uranium";

    // shuffle
    for (i = 0; i < 110; i++) {
	var x = Math.floor(Math.random() * 110);
	var tmp = deck[i];
	deck[i] = deck[x];
	deck[x] = tmp;
    }

    if (count == 2) {
	// Use only half the deck with 2 players
	deck1 = new Array(18);
	deck2 = new Array(18);
	deck3 = new Array(19);
	for (i = 0; i < 18; i++) deck1[i] = deck[i];
	for (i = 18; i < 36; i++) deck2[i - 18] = deck[i];
	for (i = 36; i < 55; i++) deck3[i - 36] = deck[i];      
    } else {
	deck1 = new Array(36);
	deck2 = new Array(37);
	deck3 = new Array(37);
	for (i = 0; i < 36; i++) deck1[i] = deck[i];
	for (i = 36; i < 73; i++) deck2[i - 36] = deck[i];
	for (i = 73; i < 110; i++) deck3[i - 73] = deck[i];
    }

    useDeck(deck1);

    document.Coalform.select.disabled = true;
    document.Oilform.select.disabled = true;
    document.Gasform.select.disabled = true;
    document.Woodform.select.disabled = true;
    document.Uraniumform.select.disabled = true;
    document.Cleanseform.select.disabled = true;

    updateHand("Coal", 0);
    updateHand("Oil", 0);
    updateHand("Gas", 0);
    updateHand("Wood", 0);
    updateHand("Uranium", 0);
    updateCleanseSelect();
    log.innerHTML = "";
    updateColors();
    moveAI();
}

// Other functions

function useDeck(a) {
    lastTurn = null;
    cardsLeft = a.length;
    currentDeck = a;
    deckItem.innerHTML = cardsLeft;
    card1 = draw();
    card2 = draw();
    card3 = draw();
    updateButton();
    card1Button.disabled = false;
    card2Button.disabled = false;
    card3Button.disabled = false;
    card1Button.className = card1;
    card2Button.className = card2;
    card3Button.className = card3;
}

function updateButton() {
    if (cardsLeft > 0) {
	if (card1 != card2 || card1 != card3) {
            deckButton.disabled = false;
            return;
	}
    }
    deckButton.disabled = true;
}

function draw() {
    if (cardsLeft == 0) {
	return null;
    }
    cardsLeft = cardsLeft - 1;
    var x = currentDeck[cardsLeft];
    deckItem.innerHTML = cardsLeft;
    return x;
}

function updateHand(a, b) {
    if (turn != 0) return;
    document.getElementById(a).innerHTML = b;
    updateSelect(a, b);
}

function updateSelect(a, b) {
    var select;
    if (a == "Coal") select = document.Coalform.select;
    if (a == "Oil") select = document.Oilform.select;
    if (a == "Gas") select = document.Gasform.select;
    if (a == "Wood") select = document.Woodform.select;
    if (a == "Uranium") select = document.Uraniumform.select;
    select.disabled = b == 0;
    select.options.length = 0;
    for (i = 0; i < b; i++) {
	select.options[i] = new Option(b - i, b - i, i == 0, false);
    }
}

function updateCleanseSelect() {
    if (turn != 0) return;
    var coal = areas[turn].coal;
    var oil = areas[turn].oil;
    var gas = areas[turn].gas;
    var wood = areas[turn].wood;
    var uranium = areas[turn].uranium;
    var select = document.Cleanseform.select;
    select.disabled = coal + oil + gas + wood + uranium == 0;
    select.options.length = 0;
    var i = 1; 
    if (coal > 1) select.options[i++] = new Option("Coal, Coal", "cc");
    if (oil > 1) select.options[i++] = new Option("Oil, Oil", "oo");
    if (gas > 1) select.options[i++] = new Option("Gas, Gas", "gg");
    if (wood > 1) select.options[i++] = new Option("Wood, Wood", "ww");
    if (uranium > 1) select.options[i++] = new Option("Uranium, Uranium", "uu");
    if (coal > 0 && oil > 0) select.options[i++] = new Option("Coal, Oil", "co");
    if (coal > 0 && gas > 0) select.options[i++] = new Option("Coal, Gas", "cg");
    if (coal > 0 && wood > 0) select.options[i++] = new Option("Coal, Wood", "cw");
    if (coal > 0 && uranium > 0) select.options[i++] = new Option("Coal, Uranium", "cu");
    if (oil > 0 && gas > 0) select.options[i++] = new Option("Oil, Gas", "og");
    if (oil > 0 && wood > 0) select.options[i++] = new Option("Oil, Wood", "ow");
    if (oil > 0 && uranium > 0) select.options[i++] = new Option("Oil, Uranium", "ou");
    if (gas > 0 && wood > 0) select.options[i++] = new Option("Gas, Wood", "gw");
    if (gas > 0 && uranium > 0) select.options[i++] = new Option("Gas, Uranium", "gu");
    if (wood > 0 && uranium > 0) select.options[i++] = new Option("Wood, Uranium", "wu");
    if (coal > 0) select.options[i++] = new Option("Coal", "cx");
    if (oil > 0) select.options[i++] = new Option("Oil", "ox");
    if (gas > 0) select.options[i++] = new Option("Gas", "gx");
    if (wood > 0) select.options[i++] = new Option("Wood", "wx");
    if (uranium > 0) select.options[i++] = new Option("Uranium", "ux");
}

function getMost() {
    var max = [0, 0, 0, 0, 0];
    for (i = 0; i < playerCount; i++) {
	if (areas[i].coal > max[0]) max[0] = areas[i].coal;
	if (areas[i].oil > max[1]) max[1] = areas[i].oil;
	if (areas[i].gas > max[2]) max[2] = areas[i].gas;
	if (areas[i].wood > max[3]) max[3] = areas[i].wood;
	if (areas[i].uranium > max[4]) max[4] = areas[i].uranium;
    }
    return max;
}

function calculateFines(phase) {
    var quota;
    switch (phase) {
    case 0: quota = quota1[playerCount]; break;
    case 1: quota = quota2[playerCount]; break;
    case 2: quota = quota3[playerCount]; break;
    }
    for (i = 0; i < playerCount; i++) {
	var count = areas[i].coal + areas[i].oil + areas[i].gas + areas[i].wood + areas[i].uranium;
	if (count < quota) {
            var fine = quota - count;
            log.innerHTML += playerNames[i] + " loses " + fine + " points for not meeting production quota<br>";
            fineCells[i].innerHTML = data[i].fines += fine;
            scoreCells[i].innerHTML = data[i].score -= fine;
	}
    }
    if (phase == 0) return;
    var max = getMost();
    for (i = 0; i < playerCount; i++) {
	if (max[0] > 0 && areas[i].coal == max[0]) {
            fineCells[i].innerHTML = data[i].fines += coalFines[phase];
            scoreCells[i].innerHTML = data[i].score -= coalFines[phase];
            log.innerHTML += playerNames[i] + " loses " + coalFines[phase] + " points for having most coal<br>";
	}
	if (max[1] > 0 && areas[i].oil == max[1]) {
            fineCells[i].innerHTML = data[i].fines += oilFines[phase];
            scoreCells[i].innerHTML = data[i].score -= oilFines[phase];
            log.innerHTML += playerNames[i] + " loses " + oilFines[phase] + " points for having most oil<br>";
	}
	if (max[2] > 0 && areas[i].gas == max[2]) {
            fineCells[i].innerHTML = data[i].fines += gasFines[phase];
            scoreCells[i].innerHTML = data[i].score -= gasFines[phase];
            log.innerHTML += playerNames[i] + " loses " + gasFines[phase] + " points for having most gas<br>";
	}
	if (max[3] > 0 && areas[i].wood == max[3]) {
            fineCells[i].innerHTML = data[i].fines += woodFines[phase];
            scoreCells[i].innerHTML = data[i].score -= woodFines[phase];
            log.innerHTML += playerNames[i] + " loses " + woodFines[phase] + " points for having most wood<br>";
	}
	if (max[4] > 0 && areas[i].uranium == max[4]) {
            fineCells[i].innerHTML = data[i].fines += uraniumFines[phase];
            scoreCells[i].innerHTML = data[i].score -= uraniumFines[phase];
            log.innerHTML += playerNames[i] + " loses " + uraniumFines[phase] + " points for having most uranium<br>";
	}
    }
}

function getPhase() {
    if (currentDeck == deck1) return 1;
    if (currentDeck == deck2) return 2;
    return 3;
}

function nextPhase() {
    var phase = getPhase();
    if (phase == 1) {
	log.innerHTML += "Phase 1 is over!<br>";
	calculateFines(0);
	useDeck(deck2);
	log.innerHTML += "Phase 2 begins!<br>";
	showWarning("Phase 2 begins");
    } else if (phase == 2) {
	log.innerHTML += "Phase 2 is over!<br>";
	calculateFines(1);
	useDeck(deck3);
	log.innerHTML += "Phase 3 begins!<br>";
	showWarning("Phase 3 begins");
    } else {
	updateColors();
	log.innerHTML += "Game is over!<br>";
	showWarning("Game over");
	calculateFines(2);
	deckButton.disabled = true;
	card1Button.disabled = true;
	card2Button.disabled = true;
	card3Button.disabled = true;
	document.Coalform.select.disabled = true;
	document.Oilform.select.disabled = true;
	document.Gasform.select.disabled = true;
	document.Woodform.select.disabled = true;
	document.Uraniumform.select.disabled = true;
	document.Cleanseform.select.disabled = true;
	for (i = 0; i < playerCount; i++) {
            var scoreElem = scoreCells[i];
            scoreElem.innerHTML = "<b>" + scoreElem.innerHTML + "</b>";
	}
	var pos = 1;
	var tiebreak = (0 + playerCount - startPlayer) % playerCount;
	for (i = 1; i < playerCount; i++) {
            if (data[i].score > data[0].score) pos++;
            else {
		var tb = (i + playerCount - startPlayer) % playerCount;
		if (data[i].score == data[0].score && tiebreak < tb) pos++;
            }
	}
	if (pos == 1) log.innerHTML += "You win!!!<br>";
	$.ajax({
            url: "log.php",
            type: "POST",
            data: {pc: playerCount, pos: pos, score: data[0].score},
            success: function(data, status, jqxhr) {
		//alert(jqxhr.responseText);
            }
	});
	throw { name: 'Game Over', message: 'Game is over' };
    }
}

function colorCell(count, most, cell) {
    var content;
    var red = "<font color=\"#f44\">" + count + "</font>";
    if (count > 0 && count == most) {
	content = red;
    } else {
	content = count;
    }
    cell.innerHTML = content;
}

function colorTotalCell(count, quota, cell) {
    var content;
    var blue = "<font color=\"#44f\">" + count + "</font>";
    if (count < quota) {
	content = blue;
    } else {
	content = count;
    }
    cell.innerHTML = content;
}

function updateColors() {
    var most = getMost();
    var quota;
    if (currentDeck == deck1) quota = quota1;
    if (currentDeck == deck2) quota = quota2;
    if (currentDeck == deck3) quota = quota3;
    for (p = 0; p < playerCount; p++) {
	colorCell(areas[p].coal, most[0], coalCells[p]);
	colorCell(areas[p].oil, most[1], oilCells[p]);
	colorCell(areas[p].gas, most[2], gasCells[p]);
	colorCell(areas[p].wood, most[3], woodCells[p]);
	colorCell(areas[p].uranium, most[4], uraniumCells[p]);
	colorTotalCell(data[p].total, quota[playerCount], totalCells[p]);
    }
}

function showWarning(text) {
    if (animations == true) {
	var txt = document.getElementById("Info");
	txt.innerHTML = text;
	txt.style.display = null;
	$(txt).fadeOut(2000);
    }
}

function checkEnd() {
    if (lastTurn == playerNames[turn]) {
	nextPhase();
    } else if (cardsLeft == 0 && lastTurn == null) {
	lastTurn = playerNames[turn];
	log.innerHTML += playerNames[turn] + " triggered Phase ending, LAST TURN!<br>";
	showWarning("Last turn of Phase " + getPhase());
    }
    updateColors();
}

function moveAI() {
    while (turn != 0) {
	var played = areas[turn].coal + areas[turn].oil + areas[turn].gas + areas[turn].wood + areas[turn].uranium;
	var quota;
	if (currentDeck == deck1) quota = quota1[playerCount];
	if (currentDeck == deck2) quota = quota2[playerCount];
	if (currentDeck == deck3) quota = quota3[playerCount];
	var diff = quota - played;
	var stop = playerCount;
	if (currentDeck == deck3) {
            stop = 0;
            if (hands[turn].coal > 1) stop++;
            if (hands[turn].oil > 1) stop++;
            if (hands[turn].gas > 1) stop++;
            if (hands[turn].wood > 1) stop++;
            if (hands[turn].uranium > 1) stop++;
            if (stop == 0) {
		stop = hands[turn].coal + hands[turn].oil + hands[turn].gas + hands[turn].wood + hands[turn].uranium;
            } else {
		stop = stop * playerCount;
            }
	} else {
            if (hands[turn].coal >= diff) stop = 0;
            if (hands[turn].oil >= diff) stop = 0;
            if (hands[turn].gas >= diff) stop = 0;
            if (hands[turn].wood >= diff) stop = 0;
            if (hands[turn].uranium >= diff) stop = 0;
	}
	var choice = -1;
	if ((currentDeck != deck3 && diff <= 0) || cardsLeft > stop) {
            choice = decideCard();
	}
	if (choice == -1) {
            var max = 0;
            var type = null;
            if (hands[turn].coal > max) {
		max = hands[turn].coal;
		type = "Coal";
            }
            if (hands[turn].oil > max) {
		max = hands[turn].oil;
		type = "Oil";
            }
            if (hands[turn].gas > max) {
		max = hands[turn].gas;
		type = "Gas";
            }
            if (hands[turn].wood > max) {
		max = hands[turn].wood;
		type = "Wood";
            }
            if (hands[turn].uranium > max) {
		max = hands[turn].uranium;
		type = "Uranium";
            }
            if (max > 0) {
		log.innerHTML += playerNames[turn] + " played " + max + " of " + type + "<br>";
		playCards(type, max);
		checkEnd();
            } else {
		decideCard();
            }
	}
	turn = (turn + 1) % playerCount;
    }
}

function endTurn() {
    if (turn == 0) {
       log.innerHTML = "";
    }
    checkEnd();
    if (turn != 0) {
	return;
    }
    turn = (turn + 1) % playerCount;
    moveAI();
}

function take(type) {
    var result;
    switch (type) {
    case "Coal": result = ++hands[turn].coal; break;
    case "Oil": result = ++hands[turn].oil; break;
    case "Gas": result = ++hands[turn].gas; break;
    case "Wood": result = ++hands[turn].wood; break;
    case "Uranium": result = ++hands[turn].uranium; break;
    }
    handCells[turn].innerHTML = ++data[turn].hand;
    updateHand(type, result);
    updateButton();
    endTurn();
}

function takeFrom(old, button, drawn) {
    if (animations == true) {
	var pos = $(button).offset();
	var oImg = document.getElementById(old + "Image");
	var img = oImg.cloneNode(true);
	document.body.appendChild(img);
	img.style.left = pos.left;
	img.style.top = pos.top;
	img.style.display = null;
	var tpos;
	if (turn == 0) {
            tpos = $("#" + old).offset();
            tpos.top -= 42;
            tpos.left -= 30;
	} else {
            tpos = $(handCells[turn]).offset();
	}
	$(img).animate({'top' : tpos.top + "px", 'left' : tpos.left + "px"}).fadeOut(300);
    }
    var card = old;
    if (drawn == null) {
	button.className = "Empty";
	button.disabled = true;
    } else {
	button.className = drawn;
    }
    take(card);
}

function playCards(type, count) {
    var pos;
    if (animations == true) {
	if (turn == 0) {
            pos = $("#" + type).offset();
            pos.top -= 42;
            pos.left -= 30;
	} else {
            pos = $(handCells[turn]).offset();
	}
	var oImg = document.getElementById(type + "Image");
	var img = oImg.cloneNode(true);
	document.body.appendChild(img);
	img.style.left = pos.left;
	img.style.top = pos.top;
	img.style.display = null;
    }
    var cell;
    var result;
    var played;
    var most;
    switch (type) {
    case "Coal":
	result = hands[turn].coal -= count;
	played = areas[turn].coal += count;
	cell = coalCells[turn];
	break;
    case "Oil":
	result = hands[turn].oil -= count;
	played = areas[turn].oil += count;
	cell = oilCells[turn];
	break;
    case "Gas":
	result = hands[turn].gas -= count;
	played = areas[turn].gas += count;
	cell = gasCells[turn];
	break;
    case "Wood":
	result = hands[turn].wood -= count;
	played = areas[turn].wood += count;
	cell = woodCells[turn];
	break;
    case "Uranium":
	result = hands[turn].uranium -= count;
	played = areas[turn].uranium += count;
	cell = uraniumCells[turn];
	break;
    }
    if (animations == true) {
	var tpos = $(cell).offset();
	$(img).animate({'top' : tpos.top + "px", 'left' : tpos.left + "px"}).fadeOut(500);
    }

    handCells[turn].innerHTML = data[turn].hand -= count;
    scoreCells[turn].innerHTML = data[turn].score += count;
    data[turn].total += count;

    updateHand(type, result);
    updateCleanseSelect();
}

function play(a, type) {
    if (a.disabled == false) {
	var x = a.selectedIndex;
	var count = parseInt(a.options[x].value);
	playCards(type, count);
	endTurn();
    }
}

// BUTTONS

function takeRandom() {
    if (animations == true) {
	var pos = $(deckButton).offset();
	var card = currentDeck[cardsLeft - 1];
	var oImg;
	if (turn == 0) {
            oImg = document.getElementById(card + "Image");
	} else {
            oImg = document.getElementById("BackImage");
	}
	var img = oImg.cloneNode(true);
	document.body.appendChild(img);
	img.style.left = pos.left;
	img.style.top = pos.top;
	img.style.display = null;
	var tpos;
	if (turn == 0) {
            tpos = $("#" + card).offset();
            tpos.top -= 42;
            tpos.left -= 30;
	} else {
            tpos = $(handCells[turn]).offset();
	}
	$(img).animate({'top' : tpos.top + "px", 'left' : tpos.left + "px"}).fadeOut(500);
    }
    take(draw());
}

function take1() {
    takeFrom(card1, card1Button, card1 = draw());
}

function take2() {
    takeFrom(card2, card2Button, card2 = draw());
}

function take3() {
    takeFrom(card3, card3Button, card3 = draw());
}

function playCoal() {
    play(document.Coalform.select, "Coal");
}

function playOil() {
    play(document.Oilform.select, "Oil");
}

function playGas() {
    play(document.Gasform.select, "Gas");
}

function playWood() {
    play(document.Woodform.select, "Wood");
}

function playUranium() {
    play(document.Uraniumform.select, "Uranium");
}

function cleanse() {
    var a = document.Cleanseform.select;
    if (a.disabled == false) {
	var x = a.selectedIndex;
	if (x == 0) {
            return;
	}
	var y = a.options[x].value;
	for (i = 0; i < 2; i++) {
            var c = y.charAt(i);
            switch (c) {
            case 'c': --areas[turn].coal; break;
            case 'o': --areas[turn].oil; break;
            case 'g': --areas[turn].gas; break;
            case 'w': --areas[turn].wood; break;
            case 'u': --areas[turn].uranium; break;
            default: continue;
            }
            cleanseCells[turn].innerHTML = ++data[turn].cleansed;
            --data[turn].total;
	}
	updateCleanseSelect();
	endTurn();
    }
}

// AI FUNCTIONS

function getAmounts() {
    var amounts = new Array(5);
    var coalArray = new Array(playerCount);
    var oilArray = new Array(playerCount);
    var gasArray = new Array(playerCount);
    var woodArray = new Array(playerCount);
    var uraniumArray = new Array(playerCount);
    for (i = 0; i < playerCount; i++) {
	coalArray[i] = areas[i].coal;
	oilArray[i] = areas[i].oil;
	gasArray[i] = areas[i].gas;
	woodArray[i] = areas[i].wood;
	uraniumArray[i] = areas[i].uranium;
    }
    coalArray.sort(function(a, b) { return b - a });
    oilArray.sort(function(a, b) { return b - a });
    gasArray.sort(function(a, b) { return b - a });
    woodArray.sort(function(a, b) { return b - a });
    uraniumArray.sort(function(a, b) { return b - a });
    amounts[0] = coalArray;
    amounts[1] = oilArray;
    amounts[2] = gasArray;
    amounts[3] = woodArray;
    amounts[4] = uraniumArray;
    return amounts;
}

function getCardValues() {
    var amounts = getAmounts();
    var values = [0, 1, 2, 2, 3];
    var cmp;
    cmp = (amounts[0][0] == areas[turn].coal) ? amounts[0][1] : amounts[0][0];
    values[0] += Math.abs(hands[turn].coal + areas[turn].coal - cmp);
    cmp = (amounts[1][0] == areas[turn].oil) ? amounts[1][1] : amounts[1][0];
    values[1] += Math.abs(hands[turn].oil + areas[turn].oil - cmp);
    cmp = (amounts[2][0] == areas[turn].gas) ? amounts[2][1] : amounts[2][0];
    values[2] += Math.abs(hands[turn].gas + areas[turn].gas - cmp);
    cmp = (amounts[3][0] == areas[turn].wood) ? amounts[3][1] : amounts[3][0];
    values[3] += Math.abs(hands[turn].wood + areas[turn].wood - cmp);
    cmp = (amounts[4][0] == areas[turn].uranium) ? amounts[4][1] : amounts[4][0];
    values[4] += Math.abs(hands[turn].uranium + areas[turn].uranium - cmp);
    if (hands[turn].coal > 0) values[0]++;
    if (hands[turn].oil > 0) values[1]++;
    if (hands[turn].gas > 0) values[2]++;
    if (hands[turn].wood > 0) values[3]++;
    if (hands[turn].uranium > 0) values[4]++;
    return values;
}

function getValueIndex(type) {
    var index = -1;
    switch (type) {
    case "Coal": index = 0; break;
    case "Oil": index = 1; break;
    case "Gas": index = 2; break;
    case "Wood": index = 3; break;
    case "Uranium": index = 4; break;
    }
    return index;
}

function decideCard() {
    if (deckButton.disabled && card1 == null && card2 == null && card3 == null) return -1;
    var values = getCardValues();
    var bestValue = (30 * values[0] + 25 * values[1] + 20 * values[2] + 20 * values[3] + 15 * values[4]) / 110;
    var bestValueIndex = 0;
    if (deckButton.disabled) { bestValue = -1; bestValueIndex = -1; }
    var value;
    if (card1 != null) {
	value = values[getValueIndex(card1)];
	if (value > bestValue) { bestValue = value; bestValueIndex = 1; }
    }
    if (card2 != null) {
	value = values[getValueIndex(card2)];
	if (value > bestValue) { bestValue = value; bestValueIndex = 2; }
    }
    if (card3 != null) {
	value = values[getValueIndex(card3)];
	if (value > bestValue) { bestValue = value; bestValueIndex = 3; }
    }
    switch (bestValueIndex) {
    case 0:
        log.innerHTML += playerNames[turn] + " took card from the deck<br>";
        takeRandom();
        break;
    case 1:
        log.innerHTML += playerNames[turn] + " took " + card1 + " from table";
        if (cardsLeft > 0) log.innerHTML += ", new card is " + currentDeck[cardsLeft - 1];
        log.innerHTML += "<br>";
        take1();
        break;
    case 2:
        log.innerHTML += playerNames[turn] + " took " + card2 + " from table";
        if (cardsLeft > 0) log.innerHTML += ", new card is " + currentDeck[cardsLeft - 1];
        log.innerHTML += "<br>";
        take2();
        break;
    case 3:
	log.innerHTML += playerNames[turn] + " took " + card3 + " from table";
        if (cardsLeft > 0) log.innerHTML += ", new card is " + currentDeck[cardsLeft - 1];
        log.innerHTML += "<br>";
        take3();
        break;
    }
    updateButton();
    return bestValueIndex;
}

// Stats

$(".finesText").mouseover(function() {
    $(this).children(".description").show();
}).mouseout(function() {
    $(this).children(".description").hide();
});

function stats() {
    var elem = document.getElementById("stats");
    if (elem.innerHTML != "") {
	elem.innerHTML = "";
	return;
    }
    readTextFile("logs/out.log");
    var result = "";
    var games = [0, 0, 0, 0, 0, 0, 0, 0];
    var wins = [0, 0, 0, 0, 0, 0, 0, 0];
    var high = [0, 0, 0, 0, 0, 0, 0, 0];
    var rows = rawData.split(";");
    for (i = 0; i < rows.length; i++) {
	var row = rows[i].trim();
	if (row == "") continue;
	var cols = row.split(",");
	var pc = parseInt(cols[0]);
	var pos = parseInt(cols[1]);
	var score = parseInt(cols[2]);
	games[pc]++;
	if (pos == 1) wins[pc]++;
	if (score > high[pc]) high[pc] = score;
    }
    result += "<p>"
    result += "Total number of games: " + (rows.length - 1) + "<br>";
    for (i = 2; i <= 7; i++) {
	result += "Wins in " + i + " player games: " + wins[i] + " / " + games[i] + "<br>";
    }
    result += "</p><p>"
    for (i = 2; i <= 7; i++) {
	result += "High score in " + i + " player games: " + high[i] + "<br>";
    }
    result += "</p>"
    elem.innerHTML = result;
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                rawData = allText;
            }
        }
    }
    rawFile.send(null);
}
