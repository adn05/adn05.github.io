// These are the constraints used to validate the form
var constraints = {
    username: {
        // You need to pick a username too
        presence: true,
        // And it must be between 3 and 20 characters long
        length: {
            minimum: 3,
            maximum: 20
        },
        format: {
            // We don't allow anything that a-z and 0-9
            pattern: "[a-z0-9]+",
            // but we don't care if the username is uppercase or lowercase
            flags: "i",
            message: "can only contain a-z and 0-9"
        }
    },
    "buy-btc": {
        presence: true,
        // Number of children has to be an integer >= 0
        numericality: {
            greaterThanOrEqualTo: 0.002,
            notGreaterThanOrEqualTo: "min amount 0.002 BTC"
        }
    },
    "buy-cfa": {
        presence: true,
        // Number of children has to be an integer >= 0
        numericality: {
            greaterThanOrEqualTo: 10000,
            notGreaterThanOrEqualTo: "min amount 10.000 CFA"
        }
    },
    "sell-btc": {
        presence: true,
        // Number of children has to be an integer >= 0
        numericality: {
            greaterThanOrEqualTo: 0.001,
            notGreaterThanOrEqualTo: "min amount 0.001 BTC"
        }
    },
    "sell-cfa": {
        presence: true,
        // Number of children has to be an integer >= 0
        numericality: {
            greaterThanOrEqualTo: 5000,
            notGreaterThanOrEqualTo: "min amount 5.000 CFA"
        }
    }
};

var prix_btc_eur = 0;
var taux_eur_buy = 700;
var taux_eur_sell = 495;

var buy_btc_input = document.getElementById("buy-btc");
var buy_cfa_input = document.getElementById("buy-cfa");
var sell_btc_input = document.getElementById("sell-btc");
var sell_cfa_input = document.getElementById("sell-cfa");

function calcule(input) {
    var amount = input.value;
    var cfa = 0;
    var btc = 0;
    // fcfa = ((prix_BTC_EUR + 100) * amount_btc + 6 ) * 700 * 1.02
    // btc = ((amount_cfa / 1.02) / 700 - 6) / (prix_BTC_EUR + 100)
    if (input.name == "buy-btc") {
        cfa = ((prix_btc_eur + 100) * amount + 6) * taux_eur_buy * 1.02;
        buy_cfa_input.value = Math.round(cfa / 100) * 100;
    }
    if (input.name == "buy-cfa") {
        btc = ((amount / 1.02) / taux_eur_buy - 6) / (prix_btc_eur + 100);
        buy_btc_input.value = Math.round(btc * 100000000) / 100000000;
    }

    // fcfa = (prix_BTC_EUR - 100) * amount_btc * 595
    // btc = amount_cfa / 600 / (prix_BTC_EUR - 100)
    if (input.name == "sell-btc") {
        cfa = (prix_btc_eur - 100) * amount * taux_eur_sell;
        sell_cfa_input.value = Math.floor(cfa / 100) * 100;
        // console.log(cfa);
    }
    if (input.name == "sell-cfa") {
        btc = amount / taux_eur_sell / (prix_btc_eur + 100);
        sell_btc_input.value = Math.floor(btc * 100000000) / 100000000;
        // console.log(btc);
    }
}

async function get_btc_price() {
    var response = await fetch('https://cex.io/api/last_price/BTC/EUR');
    var lastPrice = await response.json(); //extract JSON from the http response

    console.log(lastPrice);
    prix_btc_eur = lastPrice.lprice;

    // Calcul default value
    calcule(buy_btc_input);
    calcule(sell_btc_input);
}

function handleFormSubmit(form, input) {
    // validate the form against the constraints
    var errors = validate(form, constraints);
    // then we update the form to reflect the results
    showErrors(form, errors || {});
}

// Updates the inputs with the validation errors
function showErrors(form, errors) {
    // list.forEach(item => console.log(item))
    // We loop through all the inputs and show the errors for that input
    (form.querySelectorAll("input[name], select[name]")).forEach(function(input) {
        // Since the errors can be null if no errors were found we need to handle
        // that
        showErrorsForInput(input, errors && errors[input.name]);
    });
}

// Shows the errors for a specific input
function showErrorsForInput(input, errors) {
    // This is the root of the input
    var formGroup = closestParent(input.parentNode, "form-group");
    // Find where the error messages will be insert into
    message = formGroup.querySelector(".message");
    // First we remove any old messages and resets the classes
    resetInput(input);
    // resetFormGroup(formGroup);
    // If we have errors
    if (errors) {
        // we first mark the group has having errors
        input.classList.add("is-invalid");
        // then we append all the errors
        // _.each(errors, function(error) {
        //     addError(messages, error);
        // });
        message.innerText = errors[0];
    }
}

// Recusively finds the closest parent that has the specified class
function closestParent(child, className) {
    if (!child || child == document) {
        return null;
    }
    if (child.classList.contains(className)) {
        return child;
    } else {
        return closestParent(child.parentNode, className);
    }
}

function resetInput(input) {
    // Remove the success and error classes
    input.classList.remove("is-invalid");
}

(function() {
    // get btc price
    get_btc_price();

    // Update price every 10 minute
    setInterval(get_btc_price, 600000);

    // Hook up the form so we can prevent it from being posted
    var form = document.querySelector("form#btccfa");
    form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        handleFormSubmit(form);
    });

    // Hook up the inputs to validate on the fly
    var inputs = document.querySelectorAll("input, textarea, select");
    for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("input", function(ev) {
            var errors = validate(form, constraints) || {};
            showErrorsForInput(this, errors[this.name]);
            if (!errors[this.name]) {
                calcule(this);
            }
        });
    }
})();