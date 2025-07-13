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
            const container = document.querySelector('div[open-trades-module] .jspPane:has(.slick-row)');
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


// (function () {
//     const originalLog = console.log;
//     console.log = function (...args) {
//         const now = new Date();
//         const time = now.toLocaleTimeString('pl-PL', { hour12: false }) + '.' + now.getMilliseconds().toString().padStart(3, '0');
//         originalLog.call(console, `[${time}]`, ...args);
//     };
// })();

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

// const selectedMarkerType = settings.rowMarkerType;
const rowMarker = RowMarkerFactory.create('grayed');
//const rowFilter = new AssetNameFilter(["Microsoft", "AAVE"]);
const rowFilter = new OrFilter(
    new StockRowFilter(),
    new AssetNameFilter(["Microsoft", "AAVE"])
);

function handleRows(container) {
    const rows = container.querySelectorAll("div.slick-row");
    //console.debug("Rows: ", rows)
    
    

    let markNextChildren = false;
    

    rows.forEach(row => {
        //console.debug("Row: ", row);

        // Wymagane czyszczenie by nowo dodane wiersze (np. rozwinięcie grupy wyżej) nie miały błędnie oznaczonego stylu.
        rowMarker.clear(row);

        let markRow = false;

        const rowInfo = AssetRowInfo.fromRow(row);
        //console.debug("RowInfo: ", rowInfo);

        // Parent row
        if (rowInfo.isParent) {      
            markNextChildren = false;

            if (rowFilter.matches(rowInfo)) {
                markRow = true;

                if (rowInfo.isExpanded) {
                    markNextChildren = true;

                    // if (parseNumberOrDefault(amount) > 0) {
                    //     markNextChildren = true;
                    // }
                }
                else {
                    markNextChildren = false;
                }
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
            console.log("Mark current row.")

            rowMarker.apply(row);
        }
    });
}

function apply(container) {
    console.log("Apply..");

    const observer = new MutationObserver(mutations => {
        console.log("Zmiana drzewa DOM.");
        handleRows(container);
    });

    console.debug("Watching: ", container);

    observer.observe(container, { childList: true, subtree: true });
}
