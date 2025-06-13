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

function waitForElementInside(container, selector, timeout = 10000) {
    console.log(`Czekam na element "${selector}" w kontenerze...`);

    return new Promise((resolve, reject) => {
        const element = container.querySelector(selector);
        if (element) return resolve(element);

        const observer = new MutationObserver(() => {
            const el = container.querySelector(selector);
            if (el) {
                observer.disconnect();
                resolve(el);
            }
        });

        observer.observe(container, { childList: true, subtree: true });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element "${selector}" nie pojawił się w czasie ${timeout} ms`));
        }, timeout);
    });
}


// ------------------------------------------------------------------------------------------------------------------------ //
//  MAIN
// ------------------------------------------------------------------------------------------------------------------------ //

console.log(settings.appFullName + " has started.");



window.onload = function () {
    waitForPortfolioSummary().then(container => {
        console.log("Container: " . container)
        globals.portfolioContainer = container; 
        console.log("Portfolio trades window is ready.");

        apply();        
    }).catch(error => {
        console.error("Błąd podczas oczekiwania na kontener:", error);
    });
    
};

function apply() {
    console.log("Apply..");


    console.log("Globals: " . globals.portfolioContainer);

    //const openTradesPanel = document.querySelector('div[open-trades-module] .jspContainer');
    // const openTradesPanel = globals.portfolioContainer;
    // console.log(openTradesPanel);


    // const rows = openTradesPanel.querySelectorAll('.slick-row.slick-group');
    // console.log("Rows: " . rows);

    // rows.forEach(row => {
    //     console.log('Znaleziony element:', row);
        
    // });


        // const observer = new MutationObserver((mutationsList, observer) => {
        //     console.log("Start")

        //     for (const mutation of mutationsList) {
        //         if (mutation.type === 'childList') {
        //             console.log("Wykryto zmianę w dzieciach:", mutation);
        //             // Możesz dodać własną logikę np. odświeżenie widoku
        //         }
        //         if (mutation.type === 'attributes') {
        //             console.log("Zmieniono atrybut:", mutation.attributeName);
        //         }
        //     }
        // });

        // // Konfiguracja obserwatora
        // observer.observe(openTradesPanel, {
        //     childList: true,        // śledź dodawanie/usuwanie elementów
        //     subtree: true,          // śledź zmiany także w potomnych elementach
        //     attributes: true        // śledź zmiany atrybutów
        // });

        // console.log("MutationObserver uruchomiony.");

    // const wc = globals.portfolioContainer.querySelector('xs6-balance-summary');
    // if (!wc) {
    //     console.error("Nie znaleziono komponentu xs6-balance-summary.");
    //     return;
    // }

    // const shadow = wc.shadowRoot;
    // if (!shadow) {
    //     console.error("Brak dostępu do shadowRoot.");
    //     return;
    // }

    // waitForElementInside(shadow, '.profit-box')
    //     .then(profitBox => {
    //         console.log("profit-box znaleziony:", profitBox);

    //         const label = profitBox.querySelector('label.profit');
    //         if (label) {
    //             label.textContent = 'Zysk: 666 PLN';
    //             console.log('Zmieniono tekst w profit-box.');
    //         } else {
    //             console.log("Nie znaleziono label.profit w środku profit-box.");
    //         }
    //     })
    //     .catch(error => {
    //         console.error("Błąd:", error.message);
    //     });
}