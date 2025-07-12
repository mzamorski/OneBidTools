let settings = {
	appFullName: "'XTB Tools'",
	appName: "XtbTools",
	appVersion: "1.0",
	appShortName: "XTBT",

	enableExtension: true
}

let globals = {
	portfolioContainer: null,
	profitContainer: null
}

function waitForPortfolioSummary() {
	console.log("Waiting for portfolio window...");

    return new Promise((resolve, reject) => {
        const checkExist = setInterval(() => {
            const container = document.querySelector('.balance-summary-container');
            if (container) {
				console.log("Portfolio window found.");

                clearInterval(checkExist);
                resolve(container);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(checkExist);
            reject(new Error('Portfolio container not found within timeout.'));
        }, 10000);
    });
}

function waitForPortfolioTrades() {
	console.log("Waiting for portfolio trades window...");

    return new Promise((resolve, reject) => {
        const checkExist = setInterval(() => {
            const container = document.querySelector('div[open-trades-module] .jspContainer');
            if (container) {
				console.log("Portfolio trades window found.");

                clearInterval(checkExist);
                resolve(container);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(checkExist);
            reject(new Error('Portfolio trades window not found within timeout.'));
        }, 10000);
    });
}

function waitForProfitBox(container) {
	console.log("Czekam na .profit-box z etykietą Zysk...");

	return new Promise((resolve, reject) => {
		// Czy już jest dostępna?
		const target = findProfitBox(container);
		if (target) {
			console.log("Znaleziono .profit-box z etykietą Zysk.");
			resolve(target);
			return;
		}

		// Obserwuj DOM
		const observer = new MutationObserver(() => {
			const box = findProfitBox(container);
			if (box) {
				console.log("profit-box się pojawił!");
				observer.disconnect();
				resolve(box);
			}
		});

		observer.observe(container, { childList: true, subtree: true });

		setTimeout(() => {
			observer.disconnect();
			reject(new Error("Nie znaleziono '.profit-box' w czasie oczekiwania."));
		}, 10000);
	});
}

function findProfitBox(container) {
	const labels = container.querySelectorAll('.profit-box label.profit');
	for (const label of labels) {
		if (label.textContent.includes("Zysk")) {
			return label;
		}
	}
	return null;
}

// function waitForElementInside(container, selector, timeout = 10000) {
//     console.log(`Czekam na element "${selector}" w kontenerze...`);

//     return new Promise((resolve, reject) => {
//         const element = container.querySelector(selector);
//         if (element) return resolve(element);

//         const observer = new MutationObserver(() => {
//             const el = container.querySelector(selector);
//             if (el) {
//                 observer.disconnect();
//                 resolve(el);
//             }
//         });

//         observer.observe(container, { childList: true, subtree: true });

//         setTimeout(() => {
//             observer.disconnect();
//             reject(new Error(`Element "${selector}" nie pojawił się w czasie ${timeout} ms`));
//         }, timeout);
//     });
// }


// ------------------------------------------------------------------------------------------------------------------------ //
//  MAIN
// ------------------------------------------------------------------------------------------------------------------------ //

console.log(settings.appFullName + " has started.");



window.onload = function () {
    waitForPortfolioTrades().then(container => {
        console.log("Container: " . container)
        globals.portfolioContainer = container; 
        console.log("Portfolio trades window is ready.");

        apply(container);        
    }).catch(error => {
        console.error("Błąd podczas oczekiwania na kontener:", error);
    });
};

function parseNumberOrDefault(value, defaultValue = 0) {
    if (value == null) return defaultValue;

    const str = String(value).replace(',', '.').trim();
    const num = parseFloat(str);

    return isNaN(num) ? defaultValue : num;
}

function handleRows() {
    const rows = document.querySelectorAll("div.slick-row");

    let markNextChildren = false;
    

    rows.forEach(row => {
        //console.debug("Row: ", row);

        let markRow = false;

        //row.style.display = null;
        //row.style.backgroundColor = null;

        const isParentRow = row.classList.contains('slick-group');

        // Parent row
        if (isParentRow) {      
            const rowInfo = AssetRowInfo.fromRow(row);
            console.debug("RowInfo: ", rowInfo);
            
            markNextChildren = false;

            if (rowInfo.assetType !== "CFD") {
                return;
            }

            markRow = true;

            if (rowInfo.isExpanded) {
                console.log(`${rowInfo.name}: Kolejne wiersze wymagają oznaczenia.`)
                markNextChildren = true;

                // if (parseNumberOrDefault(amount) > 0) {
                //     markNextChildren = true;
                // }
            }
            else {
                markNextChildren = false;
            }
        }
        // // Childrens
        // else {
        //     console.log(`Wiersz dziecka (${markNextChildren})`);

        //     if (markNextChildren) {
        //         row.classList.add('highlight-row');
        //     }
        // }

        // Główna akcja na wierszu (jeśli klasyfikuje się)
        if (markRow || markNextChildren) {
            row.classList.add('highlight-row');
        }
    });
}

function apply(container) {
    console.log("Apply..");

    const observer = new MutationObserver(mutations => {
        console.log("Zmiana drzewa DOM.");

        for (const mutation of mutations) {

            console.debug("Mutation: ", mutation);

            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    
                    handleRows();
                }
            }
        }
    });



    console.debug("Watching: ", container);

    observer.observe(container, { childList: true, subtree: true });
}
