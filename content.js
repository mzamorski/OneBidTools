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


function hideRows() {
    console.debug("hideRows()");
    const rows = document.querySelectorAll("div.slick-row");

    let hiddenCount = 0;

    // rows.forEach(row => {



    //     if (row.innerText.includes("Akcje")) {
    //         //row.style.display = "none";
    //         row.style.backgroundColor = 'rgba(255, 255, 0, 0.15)';
            
    //         console.log("Ukryto wiersz zawierający 'Akcje':", row);
    //     }
    // });

    rows.forEach(row => {
        console.debug("Row: ", row);

        const isMainRow = row.classList.contains('slick-group');
        if (!isMainRow) {          
            const rowNo = row.getAttribute('row');  
            console.log(" > ", rowNo)
            return;
        }

        const assetTypeNode = row.querySelector("span.xs-btn-asset-class");
        const assetType = assetTypeNode.textContent.trim();
        console.log("Type: ", assetType)


        //const x = row.querySelector("span.slick-group-title");
        const assetInfo = row.querySelector("span.slick-group-title > div");

        // 1. Nazwa akcji – tylko tekst spoza spanów (czyli czysty tekstowy node)
        const assetName = Array.from(assetInfo.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent.trim())
        .join('');

        // 2. Ilość – zawartość .slick-group-rectangle
        const amount = assetInfo.querySelector('.slick-group-rectangle')?.textContent.trim() ?? '';

        // 3. Opis – zawartość .slick-group-toggle-description
        const description = assetInfo.querySelector('.slick-group-toggle-description')?.textContent.trim() ?? '';

        console.log('Nazwa:', assetName);      // Apple
        console.log('Ilość:', amount);          // 2
        console.log('Opis:', description);      // AAPL.US, Apple Inc

        
        
        return;


//         const x = row.querySelector('.slick-group-toggle-description')?.title.split(',')[0];
//         if (!x) return;


//         const assetTicker = row.querySelector('.slick-group-toggle-description')?.title.split(',')[0];
//         if (!assetTicker) return;
        
//         console.log("assetTicker: ", assetTicker);

//         if (assetTicker !== "GOLD") return;


        

// row.style.backgroundColor = 'rgba(255, 255, 0, 0.15)';

//         const assetType = row.querySelector(".xs-btn-asset-class");
//         if (!assetType) return;

        
//         const text = assetType.textContent.trim();
//         console.log("hideMatchingRows: ", text);

//         if (text == "Akcje") {
//             //row.style.display = "none";
//             row.style.backgroundColor = 'rgba(255, 255, 0, 0.15)';
//             hiddenCount++;
//         }
    });

    console.log(`[content.js] Ukryto ${hiddenCount} rzędów`);
}

function apply(container) {
    console.log("Apply..");

    // const observer = new MutationObserver(() => {
    //     console.log("[content.js] Zmiana w DOM — stosuję filtry");

    //     hideRows();

    // });


    const observer = new MutationObserver(mutations => {
        console.log("Zmiana drzewa DOM.");

        for (const mutation of mutations) {

            console.debug("Mutation: ", mutation);

            for (const node of mutation.addedNodes) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    
                    hideRows();
                }
            }
        }
    });



    console.debug("Watching: ", container);

    observer.observe(container, { childList: true, subtree: true });
}
