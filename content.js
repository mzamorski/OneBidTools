let settings = {
	appFullName: "'OneBid Tools'",
	appName: "OneBidTools",
	appVersion: "1.1",
	appShortName: "OBT",

	showBasePrice: false,
	commisionRate: 20,
	enableExtension: true
}

let globals = {
	finalPriceElement: null,
}

window.onload = function () {
	//simulatingLiveBidding();
    waitForLiveBidding();
	sendMessagePageLoaded();
};

var mutationObserver = new MutationObserver(onDocumentChanged);

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	console.debug("!!!! onMessage() !!!!: ", message, sender);

//     if (message.type === "enable-extension-changed") {

//         hideFinalPrice();
//     }
// });

chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.debug("Storage changed.");

	let value = changes["commisionRate"];
	if (value) {
		console.debug("New commision rate is: ", value.newValue);

		settings.commisionRate = value.newValue;
	}

	value = changes["showBasePrice"];
	if (value) {
		console.debug("showBasePrice: ", value.newValue);

		settings.showBasePrice = value.newValue;
	}
	
	value = changes["enableExtension"];
	if (value) {
		console.debug("enableExtension: ", value.newValue);

		settings.enableExtension = value.newValue;

		hideFinalPrice();
	}
});

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function simulatingLiveBidding() {

	console.log("Bid!");

	var price = getRandomInt(100, 100000);

	var node = window.document.querySelector("span#currprice.currprice > strong");
	if (node !== null) {

		node.parentNode.innerHTML = `<strong>${price}</strong>`;
	}

	let bidButtonNode = document.querySelector("button#bidbutton > div > div#bidprice");
	
	if (bidButtonNode !== null) {
		bidButtonNode.innerHTML = price;
	}

	setTimeout(simulatingLiveBidding, 2000);
}

function priceButtonNodeFormatter(priceNode) {
	var parentNode = priceNode.parentNode;

	//console.debug("priceButtonNodeFormatter:", priceNode, parentNode);

	
	//parentNode.style.fontSize = "12px";
	//parentNode.style.color = "gray";

	//var computedStyle = window.getComputedStyle(priceNode);
	//var parentFontSize = parseFloat(computedStyle.fontSize);

	//node.style.fontSize = `${(parentFontSize * 1.2)}px`;
	//priceNode.style.fontSize = `${(parentFontSize * 0.5)}px`;

	//console.log("original font size: ", computedStyle.fontSize);

	//priceWithCommisionNode.style.fontSize = computedStyle.fontSize;
	//priceWithCommisionNode.style.fontWeight = computedStyle.fontWeight;

	//priceNode.style.fontSize = "0.5em";
	//priceNode.style.fontWeight = "normal";

	priceNode.style.marginLeft = "10px";
	priceNode.style.color = "yellow";
	priceNode.style.fontSize = "18px";
	priceNode.style.fontWeight = "bold";

	return priceNode;
}

function priceInfoFormatter(priceNode) {
	//console.debug("priceInfoFormatter:", priceNode);



	var computedStyle = window.getComputedStyle(priceNode);
	//var parentFontSize = parseFloat(computedStyle.fontSize);


	//node.style.fontSize = `${(parentFontSize * 1.2)}px`;
	//priceNode.style.fontSize = `${(parentFontSize * 0.5)}px`;

	//console.log("original font size: ", computedStyle.fontSize);

	//priceWithCommisionNode.style.fontSize = computedStyle.fontSize;
	//priceWithCommisionNode.style.fontWeight = computedStyle.fontWeight;

	//priceNode.style.fontSize = "0.5em";
	//priceNode.style.fontWeight = "normal";

	//priceWithCommisionNode.style.fontSize = "16px";
	//priceWithCommisionNode.style.fontWeight = "bold";

	//priceNode.style.fontSize = "10px";
	//priceNode.style.fontWeight = "normal";

	priceNode.style.marginLeft = "10px";
	priceNode.style.color = "red";
	priceNode.style.fontSize = "32px";
	priceNode.style.fontWeight = "bold";

	return priceNode;
}

function onDocumentChanged(mutations, observer)
{
	if (!settings.enableExtension) {
		console.log(settings.appName, ": ", "Extension is disabled.");

		return;
	}

	mutations.forEach((mutation) => {

		if (
			(mutation.target.tagName === "EM")
			|| (mutation.target.tagName === "OL")
			|| (mutation.target.tagName === "UL")
			|| (mutation.target.matches("ul.list-group.list-group-flush.historylist"))
			|| (mutation.target.matches("div#winner.alert.alert.mb-0.p-0.text-muted.text-truncate"))
		) {
			//console.warn("Mutation skipped: ", mutation);
		}
		else {
			//console.log("Mutation target: ", mutation);


			switch (mutation.type) {
				case 'childList':
					/* One or more children have been added to and/or removed
					from the tree.
					(See mutation.addedNodes and mutation.removedNodes.) */

					// Price info
					if (mutation.target.matches("span#currprice.currprice")) {
						
						// Only if nodes added, not removed.
						if (mutation.addedNodes.length === 0) {
							return;
						}

						onPriceInfoNodeChanged(mutation);
					}
					// Price button
					else if (mutation.target.matches("button#bidbutton > div > div#bidprice")) {

						// Only if nodes added, not removed.
						if (mutation.addedNodes.length === 0) {
							return;
						}

						//console.log("bidprice: ", mutation.target);

						//var priceNode = mutation.addedNodes[1];
						//var priceNode = mutation.target;

						/*
						//var bidButtonDivNode = mutation.addedNodes[0];
						
					   
						//console.log(bidButtonPriceNode);
					  
						// bidButtonDivNode.style.maxWidth = "100%";
						// bidButtonDivNode.style.paddingLeft = "0px";
						// bidButtonDivNode.style.paddingRight = "30px";
						// bidButtonDivNode.style.textAlign = "left";
					  
						var bidButtonRowNode = bidButtonPriceNode.parentNode;
						//console.log("Row: ", bidButtonRowNode);
	
						var bidButtonInfoNode = bidButtonRowNode.children[0];
						//var bidButtonPriceNode = bidButtonRowNode.children[1];
	
						
	
						bidButtonInfoNode.style.flex = "2 1 auto";
						bidButtonPriceNode.style.flex = "2 1 auto";
						//row.children[1].style.backgroundColor = "yellow";
						*/

						onPriceButtonNodeChanged(mutation);
					}

					break;

				case 'attributes':
					/* An attribute value changed on the element in
						mutation.target. 
						The attribute name is in mutation.attributeName, and 
						its previous value is in mutation.oldValue. */
					break;
			}
		}
	});
}

function onPriceInfoNodeChanged(mutation) {
	//console.log("onPriceInfoNodeChanged(): ", mutation);

	globals.priceNode = Array.from(mutation.addedNodes).find((node) => node.tagName === "STRONG");
	console.debug("priceNode: ", globals.priceNode);

	addFinalPriceElement(globals.priceNode, priceInfoFormatter, settings.showBasePrice);
}

function onPriceButtonNodeChanged(mutation) {
	//console.log("onPriceButtonNodeChanged(): ", mutation);

	var priceNode = mutation.target;

	addFinalPriceElement(priceNode, priceButtonNodeFormatter, settings.showBasePrice);
}

function createFinalPriceElement(priceNode, priceNodeFormatter) {

	var price = calculatePriceWithCommission(priceNode.innerHTML);
	console.debug("priceWithCommission: ", price);
	console.debug("settings: ", settings);

	let node = document.createElement('span');

	//console.debug("New node: ", node);

	var formattedPrice = price.toLocaleString('en-EN', {
		useGrouping: 'true', style: 'decimal'
	}).replace(",", " ");

	node.textContent = formattedPrice;
	
	return priceNodeFormatter(node, formattedPrice);

	//node.innerHTML = `<span style='margin-left: 10px; ${cssStyle}'>${formattedPrice}</span>`
	//node.innerHTML = ` 999 999 999 999`;
	
    //return node;
}

function calculatePriceWithCommission(text)
{
	var priceText = text.replace(/ /g, '');
	var price = parseInt(priceText, 10);

	var amount = settings.commisionRate / 100;

	return Math.ceil(price + (price * amount));
}

function addFinalPriceElement(priceNode, priceFormatter, hideBasePrice)
{
	if (priceNode.children.length > 0) {
		//console.warn(`The 'price' node (${priceNode.tagName}) already has children!`);
		return;
	}

	globals.finalPriceElement = createFinalPriceElement(priceNode, priceFormatter);

	if (hideBasePrice === true) {
		priceNode.textContent  = null;
	}

	priceNode.appendChild(globals.finalPriceElement)
}

function hideFinalPrice() {
	console.debug("Globals: ", globals);

	//globals.priceNode.removeChild();

	// if (globals.finalPriceElement) {
    //     globals.finalPriceElement.style.display = 'none'; 
    // }
}

function contains(parent, selector, text) {
	var elements = parent.querySelectorAll(selector);

	return Array.prototype.filter.call(elements, function (element) {
		return RegExp(text).test(element.textContent);
	});
}

function findAuctionCommision(regulationsNode) {
	let commisionRate = null;

    const regex = /opłat[ay] (?:aukcyjn(a|ej))/i;
	const text = regulationsNode.innerText;

	if (regex.test(text)) {
		const amountRegex = /(\d+)\s*%/; 
		const match = text.match(amountRegex);

		if (match) {
			commisionRate = parseInt(match[1], 10);
		}
	}

    return commisionRate;
}

function waitForLiveBidding() {
	console.log("Waiting for live bidding window...");

	let livePageNode = document.querySelector("div#livepage");
	if (livePageNode === null) {
		setTimeout(waitForLiveBidding, 500);
		return;
	}
	else {
		console.log("Live bidding window found.");
	}

	let regulationsNode = document.querySelector("div#regulationsModalWindow");
	console.debug("regulationsWindow: ", regulationsNode);

	if (regulationsNode !== null) {
		let commisionRate = findAuctionCommision(regulationsNode)
		console.debug("commisionRate: ", commisionRate);

		sendMessageCommisionRateChanged(commisionRate)
	}
	else {
		console.warn("Regulations window not found! The commission amount is set to a default value (%d%)", settings.commisionRate)		
	}

	const params = {
		attributes: false,
		characterData: false,
		childList: true, 	// report added/removed nodes
		subtree: true, 	// observe any descendant elements
		attributeOldValue: false,
		characterDataOldValue: false
	};

	// Unfortunately, we cannot observe the node '<strong>' (which contains price value) at the start as it does not exist at this point.
	let priceNode = document.querySelector("span#currprice.currprice");
	if (priceNode !== null) {
		console.log("Node 'price info' will be observed: ", priceNode);

		mutationObserver.observe(priceNode, params);
	}

	let bidButtonNode = document.querySelector("button#bidbutton > div > div#bidprice");
	if (bidButtonNode !== null) {
		console.log("Node 'price button' will be observed: ", bidButtonNode);

		mutationObserver.observe(bidButtonNode, params);
	}
};



