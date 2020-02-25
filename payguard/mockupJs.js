var option1 = document.getElementById("option1");
var info = document.getElementById("info");
var tableNum = 13;
var tables = new Array();
var tablesInit = false;
var tipByPrice = true;

//interval variables
var interval;
var infoRemoved = false;

class Table{
	constructor(tableNo) {
		this.num = tableNo;
		this.isAuth = false;
		this.item = new Array();
		this.price = new Array();
		this.preauthAmt = 0;
		this.tableDiv = undefined;
	}

	getTableRows(){
		let tr = new Array();

		for(let i = 0; i < this.item.length; i++){
			let curTr = document.createElement("tr");

			let itemTd = document.createElement("td");
			itemTd.textContent = this.item[i];
			curTr.appendChild(itemTd);

			let priceTd = document.createElement("td");
			priceTd.textContent = '$' + this.price[i];
			curTr.appendChild(priceTd);

			let delTd = document.createElement("td");
			let delBtn = document.createElement("button");
			delBtn.textContent = 'X';
			delBtn.name = i;

			//remove the item from the bill
			delBtn.addEventListener('click', event => {
				let itemNo = Number(event.target.name);
				this.item[itemNo] = undefined;
				this.price[itemNo] = undefined;

				for(let j = itemNo; j < this.item.length - 1; j++){
					this.item[j] = this.item[j+1];
					this.price[j] = this.price[j+1];
				}

				this.item.length--;
				this.price.length--;

				curTr.remove();

				//update the total price
				document.getElementById("totalLabel").textContent
					= '$' + this.getCost();
			});

			delTd.appendChild(delBtn);
			curTr.appendChild(delTd);

			tr.push(curTr);
		}

		return tr;
	}

	assignDiv(tableDiv){
		this.tableDiv = tableDiv;
	}

	setTableRows(item, price){
		this.item.push(item);
		this.price.push(price);
	}

	getCost(){
		let total = 0;
		for(x of this.price){
			total += Number(x);
		}

		return total;
	}

	clearBill(){
		this.item = new Array();
		this.price = new Array();
	}
}

//preset amounts
var presetAmt1 = 40, presetAmt2 = 75, presetAmt3 = 100;

function clrInfo(){
	while(info.firstChild)
		info.firstChild.remove();

	//remove option 1 from header
	while(option1.firstChild)
		option1.firstChild.remove();
}

function getMainScreen(tableNo){
	clrInfo();

	tableNum = tableNo;

	//add the settings icon to the header
	let img = document.createElement("img");
	img.src = "settings.png";
	img.alt = "Settings";
	img.id = "settingsBtn";
	img.onclick = toggleDropDown;
	option1.appendChild(img);

	let table = document.createElement("table");
	table.align = "center";
	table.style.border = "none";
	let rows = Math.floor(Math.sqrt(tableNo));
	let rowEls = new Array();

	for(let i = 0; i < tableNo; i++){
		let colEl = document.createElement("td");
		let span = document.createElement("span");
		span.className = "tableIcon";
		span.textContent = 'T' + (i+1);
		span.onclick = function(){
			if(!tables[i].isAuth)
				getCollectPreauthScreen(tables[i].num);
			else
				getBillScreen(tables[i].num);
		};
		//set table color to green if preauthorized
		span.style.backgroundColor = (tables[i].isAuth) ? "#4ff032" : "grey";
		colEl.appendChild(span);

		//span.top = Math.floor((i+1) / rows) * window.innerHeight / rows + window.innerHeight / 2;
		//span.left = Math.floor((i+1) / rows)

		if(i % rows == 0)
			rowEls.push(document.createElement("tr"));

		let curRow = Math.floor(i / rows);
		rowEls[curRow].appendChild(colEl);
	}

	for(x of rowEls)
		table.appendChild(x);

	info.appendChild(table);
}

function getNumTables(){
	return document.getElementsByClassName("tableIcon").length;
}

function refreshTableNumValue(){
	document.getElementById("tableNum").value = getNumTables();
}

function refreshPresetInpValues(){
	if(presetAmt1 == undefined)
		presetAmt1 = 0;
	if(presetAmt2 == undefined)
		presetAmt2 = 0;
	if(presetAmt3 == undefined)
		presetAmt3 = 0;

	document.getElementById("preset1Inp").value = presetAmt1;
	document.getElementById("preset2Inp").value = presetAmt2;
	document.getElementById("preset3Inp").value = presetAmt3;
}

var ddShown = false;
function toggleDropDown(){
	let dd = document.getElementById("dropdown");

	refreshTableNumValue();
	refreshPresetInpValues();

	if(!ddShown){
		ddShown = true;
		dd.style.display = "block";
	} else {
		ddShown = false;
		dd.style.display = "none";
	}
}

function saveDD(){
	let tableNo = Number(document.getElementById("tableNum").value);
	let preset1 = Number(document.getElementById("preset1Inp").value);
	let preset2 = Number(document.getElementById("preset2Inp").value);
	let preset3 = Number(document.getElementById("preset3Inp").value);

	getMainScreen(tableNo);
	initTables();
	presetAmt1 = preset1;
	presetAmt2 = preset2;
	presetAmt3 = preset3;

	refreshPresetInpValues();

	//TODO change preset amounts on set-preauth page
}


document.getElementById("tableNum").onkeyup = saveDD;
document.getElementById("preset1Inp").onkeyup = saveDD;
document.getElementById("preset2Inp").onkeyup = saveDD;
document.getElementById("preset3Inp").onkeyup = saveDD;

function getBackIcon(){
	let h2 = document.createElement("h2");
	h2.textContent = "< Back";
	h2.style.color = "green";
	return h2;
}

function getCollectPreauthScreen(tableNo, returnToBill=false){
	clrInfo();
	refreshPresetInpValues();

	//add back option on header
	let h2 = getBackIcon();
	h2.onclick = function(){ getMainScreen(tableNum); }
	option1.appendChild(h2);

	let p = document.createElement("p");
	p.textContent = "Set Table " + (tableNo+1) + "'s pre authorization amount:";
	let button1 = document.createElement("button");
	button1.textContent = presetAmt1;
	button1.onclick = function(){
		if(tables[tableNo].preauthAmt > presetAmt1){
			window.alert("Alert: You cannot decrease pre auth amount.");
			return;
		}

		setPreauthAmt(0, tableNo);

		if(returnToBill){
			getBillScreen(tableNo);
			return;
		}

		getScanCardScreen(tableNo);
	};

	let button2 = document.createElement("button");
	button2.textContent = presetAmt2;
	button2.onclick = function(){
		if(tables[tableNo].preauthAmt > presetAmt2){
			window.alert("Alert: You cannot decrease pre auth amount.");
			return;
		}

		setPreauthAmt(1, tableNo);

		if(returnToBill){
			getBillScreen(tableNo);
			return;
		}

		getScanCardScreen(tableNo);
	};

	let button3 = document.createElement("button");
	button3.textContent = presetAmt3;
	button3.onclick = function(){
		if(tables[tableNo].preauthAmt > presetAmt3){
			window.alert("Alert: You cannot decrease pre auth amount.");
			return;
		}

		setPreauthAmt(2, tableNo);

		if(returnToBill){
			getBillScreen(tableNo);
			return;
		}

		getScanCardScreen(tableNo);
	};

	//custom pre auth amount
	let span = document.createElement("span");
	span.style.display = "inline";
	let customizeLabel = document.createElement("p");
	customizeLabel.textContent = "Custom amount: ";
	let customizeInp = document.createElement("input");
	customizeInp.type = "text";
	customizeInp.placeholder = "10";
	let applyBtn = document.createElement("button");
	applyBtn.textContent = "Apply";
	span.appendChild(customizeLabel);
	span.appendChild(customizeInp);
	span.appendChild(applyBtn);

	customizeInp.onkeyup = () => {
		customizeInp.value = customizeInp.value.replace('%', '');
		customizeInp.value = customizeInp.value.replace('$', '');
	}

	applyBtn.onclick = () => {
		//get inputted pre auth amount
		let inpPreauthAmt = getNumber(customizeInp, true);

		if(inpPreauthAmt == -1)
			return;

		if(tables[tableNo].preauthAmt > inpPreauthAmt){
			window.alert("Alert: You cannot decrease pre auth amount.");
			return;
		}

		tables[tableNo].preauthAmt = inpPreauthAmt;

		if(returnToBill){
			getBillScreen(tableNo);
			return;
		}

		getScanCardScreen(tableNo);
	};

	info.appendChild(p);
	info.appendChild(button1);
	info.appendChild(document.createElement("br"));
	info.appendChild(button2);
	info.appendChild(document.createElement("br"));
	info.appendChild(button3);
	info.appendChild(document.createElement("br"));
	info.appendChild(span);
}

function setPreauthAmt(buttonNo, tableNo){
	switch(buttonNo){
		case 0:
			tables[tableNo].preauthAmt = presetAmt1;
			break;
		case 1:
			tables[tableNo].preauthAmt = presetAmt2;
			break;
		default:
			tables[tableNo].preauthAmt = presetAmt3;
			break;
	}
}

function getScanCardScreen(tableNo){
	clrInfo();

	let h2 = getBackIcon();
	h2.onclick = function(){ getCollectPreauthScreen(tableNo); };
	option1.appendChild(h2);

	let h1 = document.createElement("h1");
	h1.textContent="Scan your card here.";

	let button = document.createElement("button");
	button.textContent = "Done";
	button.onclick = function(){
		tables[tableNo].isAuth = true;
		getMainScreen(tableNum);
	}

	info.appendChild(h1);
	info.appendChild(button);
}

function getBillScreen(tableNo){
	clrInfo();

	let totalPrice = 0;

	let h2 = getBackIcon();
	h2.onclick = function(){
		//stop the table-verifying interval
		getMainScreen(tables.length);
	};
	option1.appendChild(h2);

	let preauthAmtDiv = document.createElement("div");
	let preauthLabel = document.createElement("p");
	preauthLabel.textContent = "Pre auth amount: $" + tables[tableNo].preauthAmt;
	let changeBtn = document.createElement("button");
	changeBtn.textContent = "Change";
	changeBtn.onclick = function(){
		getCollectPreauthScreen(tableNo, true);
	};

	preauthAmtDiv.appendChild(preauthLabel);
	preauthAmtDiv.appendChild(changeBtn);
	info.appendChild(preauthAmtDiv);

	//bill info
	let title = document.createElement("h3");
	title.textContent = "Table " + (tableNo+1) + "'s Bill";
	info.appendChild(title);

	let table = document.createElement("table");
	table.id = "bill";
	table.align = "center";
	let tr = document.createElement("tr");
	tr.innerHTML = "<th>Item</th><th>Price</th>";
	table.appendChild(tr);
	table = getBillInfo(table, tableNo);

	/* After the table has been initialized, create an interval to call getBillInfo() again
	if info has been removed from the table. */


	tables[tableNo].assignDiv(table);

	//tip label on table
	let tipTr = document.createElement("tr");
	let tipLabelTd = document.createElement("td");
	tipLabelTd.textContent = "Tip:";
	let tipTd = document.createElement("td");
	tipTd.textContent = 0;
	tipTr.appendChild(tipLabelTd);
	tipTr.appendChild(tipTd);
	table.appendChild(tipTr);

	//total label on table
	let totalTr = document.createElement("tr");
	let totalLabelTd = document.createElement("td");
	let totalTd = document.createElement("td");
	totalTd.id = "totalLabel";
	totalLabelTd.textContent = "Total:";
	totalTd.textContent = '$' + tables[tableNo].getCost();
	totalTr.appendChild(totalLabelTd);
	totalTr.appendChild(totalTd);
	table.appendChild(totalTr);

	info.appendChild(table);

	let addItemDiv = document.createElement("div");
	let addItemBtn = document.createElement("button");
	addItemBtn.textContent = "Add Payment";
	addItemBtn.onclick = function(){
		getAddItemMenu(addItemDiv, tableNo);
	};
	addItemDiv.appendChild(addItemBtn);
	info.appendChild(addItemDiv);

	//proceed payment
	let proceedPaymentDiv = document.createElement("div");
	proceedPaymentDiv.id = "proceedPayment";
	let collectBtn = document.createElement("button");
	collectBtn.textContent = "Collect Payment";
	collectBtn.onclick = function(){
		proceedPaymentDiv.firstChild.remove();

		let tipInp = document.createElement("input");
		tipInp.placeholder = "Tip amount";

		let tipPriceBtn = document.createElement("button");
		tipPriceBtn.textContent = "$";
		tipPriceBtn.onclick = () => {
			tipByPrice = true;
			totalPrice = getNumber(tipInp, false);

			if(totalPrice != -1){
				tipTd.textContent = '$' + totalPrice;
				totalTd.textContent = '$' + (tables[tableNo].getCost() + totalPrice);
			}
		}

		let tipPercBtn = document.createElement("button");
		tipPercBtn.textContent = "%";
		tipPercBtn.onclick = () => {
			tipByPrice = false;
			totalPrice = getNumber(tipInp, false);

			if(totalPrice != -1){
				tipTd.textContent = totalPrice + '%';
				totalTd.textContent = '$' + (tables[tableNo].getCost() + (tables[tableNo].getCost() *
					(totalPrice / 100)));
			}
		}

		tipInp.onkeyup = () => {
			totalPrice = getNumber(tipInp, false);

			if(totalPrice != -1){
				if(tipByPrice){
					tipTd.textContent = '$' + totalPrice;
					totalTd.textContent = '$' + (tables[tableNo].getCost() + totalPrice);
				} else {
					tipTd.textContent = totalPrice + '%';
					totalTd.textContent = '$' + (tables[tableNo].getCost() + (tables[tableNo].getCost() *
						(totalPrice / 100)));
				}
			}
		}

		proceedPaymentDiv.appendChild(tipPriceBtn);
		proceedPaymentDiv.appendChild(tipPercBtn);

		let submitBtn = document.createElement("button");
		submitBtn.textContent = "Submit Payment";

		submitBtn.onclick = function(){
			let num = getNumber(tipInp, true);
			if(tipByPrice){
				totalPrice = tables[tableNo].getCost() + num;
			} else {
				totalPrice = tables[tableNo].getCost() +
					((tables[tableNo].getCost() / 100) * num);
			}

			if(totalPrice > tables[tableNo].preauthAmt){
				window.alert("Alert: Pre auth amount does not cover $" + totalPrice);
				return;
			}

			getBillConfirmation(tableNo, totalPrice);
			tables[tableNo].clearBill();
		};

		proceedPaymentDiv.appendChild(tipInp);
		proceedPaymentDiv.appendChild(submitBtn);
	};

	proceedPaymentDiv.appendChild(collectBtn);
	info.appendChild(proceedPaymentDiv);
}

function getBillInfo(table, tableNo){
	for(x of tables[tableNo].getTableRows())
		table.appendChild(x);
	return table;
}

function getAddItemMenu(div, tableNo){
	while(div.firstChild)
		div.firstChild.remove();

	let proceedPaymentDiv = document.getElementById("proceedPayment");
	proceedPaymentDiv.style.display = "none";

	let itemInp = document.createElement("input");
	itemInp.type = "text";
	itemInp.placeholder = "food item name";

	let priceInp = document.createElement("input");
	priceInp.type = "text";
	priceInp.placeholder = "food price";
	priceInp.onkeyup = function(){
		getNumber(priceInp, false);
	};

	let addBtn = document.createElement("button");
	addBtn.textContent = "Add";
	addBtn.onclick = function(){
		let item = itemInp.value;
		let price = getNumber(priceInp, true);

		if(price == -1 || item.trim() == '') {
			return;
		}

		//check that preauthorization covers price
		let totalPrice = price + tables[tableNo].getCost();
		if(totalPrice > tables[tableNo].preauthAmt){
			window.alert("Alert: Pre auth amount does not cover $" + totalPrice);
			return;
		}

		tables[tableNo].setTableRows(item, price);

		getBillScreen(tableNo);
		document.getElementById("totalLabel").textContent = '$' + tables[tableNo].getCost();

		proceedPaymentDiv.style.display = "block";
	};

	div.appendChild(itemInp);
	div.appendChild(priceInp);
	div.appendChild(addBtn);
}

function getBillConfirmation(tableNo, total){
	clrInfo();

	let h1 = document.createElement("h1");
	h1.textContent = "Table " + (tableNo+1) + "'s bill has been collected at $" + total + ".";

	let button = document.createElement("button");
	button.textContent = "Done";
	button.onclick = function(){
		tables[tableNo].isAuth = false;
		getMainScreen(tableNum);
	}

	info.appendChild(h1);
	info.appendChild(button);
}

function initTables(){
	for(let i = 0; i < tableNum; i++)
		tables[i] = new Table(i);
}

//returns the number value
function getNumber(tipInp, checkAlert){
	let str = tipInp.value;

	str = str.replace('%', '');
	str = str.replace('$', '');
	tipInp.value = str;

	let num = Number(str);

	//if an error occurs, raise an alert and highlight the input
	if(checkAlert && isNaN(num)){
		window.alert("Error: Please input a numerical value");
		tipInp.style.border = "solid red 1pt";
		return -1;
	} else
		tipInp.style.border = "solid black 1pt";//default?

	return num;
}

initTables();
getMainScreen(tables.length);