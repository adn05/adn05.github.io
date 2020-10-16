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
    "give-amount": {
        presence: true,
        // Number of children has to be an integer >= 0
        numericality: {
            greaterThanOrEqualTo: 0,
            notGreaterThanOrEqualTo: "min amount 0.002 BTC"
        }
    },
    "receive-amount": {
        presence: true,
        // Number of children has to be an integer >= 0
        numericality: {
            greaterThanOrEqualTo: 0,
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

var p2pData = {};

var prix_btc_eur = 8755;
var prix_btc_usd = 0;
var prix_btc_cfa = 0;
var prix_eur_cfa = 656;
var prix_usd_cfa = 0;
var prix_btc_pm_usd = 0;
var prix_btc_pm_eur = 0;

var com_buy = 0.080;
var com_sell = 0.070;
var frais_tr_btc = 0.0006;

var give_input = document.getElementById("give-amount");
var receive_input = document.getElementById("receive-amount");
var give_drop = document.getElementById("give-curr");
var receive_drop = document.getElementById("receive-curr");

var give_select = { "value": "mtn-cfa" };
var receive_select = { "value": "btc" };

var sell_btc_input = document.getElementById("sell-btc");
var sell_cfa_input = document.getElementById("sell-cfa");

var usd_span = document.getElementById("btc-price");
var cfa_span = document.getElementById("usd-price");

function calcule(input) {
    var amount = parseFloat(input.value);
    var cfa = 0;
    var receive = 'none';
    var give = 'none';
    var btc = 0;
    // console.log(prix_btc_eur);
    // fcfa = ((prix_BTC_EUR + 100) * amount_btc + 6 ) * 700 * 1.02
    // btc = ((amount_cfa / 1.02) / 700 - 6) / (prix_BTC_EUR + 100)
    if (input.name == "give-amount") {
        if (give_select.value == "btc" && receive_select.value == "mtn-cfa") {
            receive = amount * prix_btc_cfa * (1 - com_sell);
            receive = Math.floor(receive / 100) * 100;
            // console.log({"ancien": cfa1, "nouveau": cfa});
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "btc") {
            receive = amount / (1 + com_buy) / prix_btc_cfa - frais_tr_btc;
            receive = Math.floor(receive * 100000000) / 100000000;
        }
        if (give_select.value == "pm-usd" && receive_select.value == "mtn-cfa") {
            receive = amount * prix_usd_cfa * (1 - com_sell);
            receive = Math.floor(receive / 100) * 100;
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "pm-usd") {
            receive = (amount / (1 + com_buy) / prix_btc_cfa - frais_tr_btc) * prix_btc_pm_usd;
            receive = Math.floor(receive * 100) / 100;
        }
        if (give_select.value == "pm-eur" && receive_select.value == "mtn-cfa") {
            receive = amount * prix_eur_cfa * (1 - com_sell);
            receive = Math.floor(receive / 100) * 100;
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "pm-eur") {
            receive = (amount / (1 + com_buy) / prix_btc_cfa - frais_tr_btc) * prix_btc_pm_eur;
            receive = Math.floor(receive * 100) / 100;
        }
        if (give_select.value == "pa-usd" && receive_select.value == "mtn-cfa") {
            receive = amount * prix_usd_cfa * (1 - com_sell);
            receive = Math.floor(receive / 100) * 100;
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "pa-usd") {
            // receive = amount / prix_usd_cfa / (1 + com_buy);
            receive = (amount / (1 + com_buy) / prix_btc_cfa - frais_tr_btc) * prix_btc_usd;
            receive = Math.floor(receive * 100) / 100;
        }

        receive_input.value = receive
    }

    // Reverse
    if (input.name == "receive-amount") {
        if (give_select.value == "btc" && receive_select.value == "mtn-cfa") {
            give = amount / prix_btc_cfa / (1 - com_sell);
            give = Math.round(give * 100000000) / 100000000;
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "btc") {
            give = (amount + frais_tr_btc) * prix_btc_cfa * (1 + com_buy);
            give = Math.round(give / 100) * 100;
        }
        if (give_select.value == "pm-usd" && receive_select.value == "mtn-cfa") {
            give = amount / prix_usd_cfa / (1 - com_sell);
            give = Math.round(give * 100) / 100;
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "pm-usd") {
            give = (amount / prix_btc_pm_usd + frais_tr_btc) * prix_btc_cfa * (1 + com_buy);
            give = Math.round(give / 100) * 100;
        }
        if (give_select.value == "pm-eur" && receive_select.value == "mtn-cfa") {
            give = amount / prix_eur_cfa / (1 - com_sell);
            give = Math.round(give * 100) / 100;
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "pm-eur") {
            give = (amount / prix_btc_pm_eur + frais_tr_btc) * prix_btc_cfa * (1 + com_buy);
            give = Math.round(give / 100) * 100;
        }
        if (give_select.value == "pa-usd" && receive_select.value == "mtn-cfa") {
            give = amount / prix_usd_cfa / (1 - com_sell);
            give = Math.round(give * 100) / 100;
        }
        if (give_select.value == "mtn-cfa" && receive_select.value == "pa-usd") {
            // give = amount * prix_usd_cfa * (1 + com_buy);
            give = (amount / prix_btc_usd + frais_tr_btc) * prix_btc_cfa * (1 + com_buy);
            give = Math.round(give / 100) * 100;
        }

        give_input.value = give
    }
}

async function get_btc_price() {
    var response = await fetch('https://cex.io/api/last_price/BTC/EUR');
    var lastPrice = await response.json(); //extract JSON from the http response

    prix_btc_eur = parseFloat(lastPrice.lprice);
    prix_btc_cfa = prix_btc_eur * prix_eur_cfa;

    // Calcul default value
    calcule(give_input);

    response = await fetch('https://cex.io/api/last_price/BTC/USD');
    lastPrice = await response.json();
    prix_btc_usd = Math.round(parseFloat(lastPrice.lprice));
    prix_usd_cfa = prix_btc_cfa / prix_btc_usd;
    prix_usd_cfa = Math.round(prix_usd_cfa);

    updatePrices(prix_btc_usd, prix_usd_cfa);

    console.log({
        "prix_btc_eur": prix_btc_eur,
        "prix_btc_usd": prix_btc_usd,
        "prix_btc_cfa": prix_btc_cfa,
        "prix_usd_cfa": prix_usd_cfa
    });
}

function updatePrices(usd, cfa) {
    // update the prices
    usd_span.innerText = usd;
    cfa_span.innerText = cfa;
}

function handleFormSubmit(form, input) {
    // validate the form against the constraints
    var errors = validate(form, constraints);
    // then we update the form to reflect the results
    showErrors(form, errors || {});
}

// Updates the inputs with the validation errors
function showErrors(form, errors) {
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
    // formGroup.classList.remove("is-invalid");
    input.classList.remove("is-invalid");
    console.log(errors);
    // If we have errors
    if (errors) {
        // we first mark the group has having errors
        formGroup.classList.add("is-invalid");
        input.classList.add("is-invalid");
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

function update_p2p_ticker() {
    $.ajax({
        type: "GET",
        url: 'https://p2pchange.is/ticker.php',
        // data: {email: $("#field_email").val()},
        success: function(responseajax) {
            var response = responseajax;
            if (response.status == true) {
                p2pData = response;
                // console.log(p2pData);

                prix_btc_pm_usd = parseFloat(p2pData.BTC.exchangerate.PMU);
                prix_btc_pm_eur = parseFloat(p2pData.BTC.exchangerate.PME);

                console.log({
                    "prix_btc_pm_eur": prix_btc_pm_eur,
                    "prix_btc_pm_usd": prix_btc_pm_usd
                });
            }
        }
    });
}

function on_receive_curr(curr) {
    // console.log(curr);
    receive_select = { "value": curr[0] };
    receive_drop.innerText = curr[1];

    calcule(give_input);
}

function on_give_curr(curr) {
    give_select = { "value": curr[0] };
    give_drop.innerText = curr[1];

    calcule(receive_input);
}


(function() {
    // get btc price
    update_p2p_ticker();
    get_btc_price();

    // Update price every 5 minutes
    setInterval(update_p2p_ticker, 300000);
    setInterval(get_btc_price, 300000);

    // Hook up the form so we can prevent it from being posted
    var form = document.querySelector("form#btccfa");
    form.addEventListener("submit", function(ev) {
        ev.preventDefault();
        // handleFormSubmit(form);
    });

    // Hook up the inputs to validate on the fly
    var inputs = document.querySelectorAll("input, textarea, select");
    for (var i = 0; i < inputs.length; ++i) {
        inputs.item(i).addEventListener("input", function(ev) {
            var errors = validate(form, constraints) || {};
            if (!errors[this.name]) {
                calcule(this);
            }
            errors = validate(form, constraints) || {};
            // showErrorsForInput(this, errors[this.name]);
            showErrors(form, errors || {});
        });
    }
})();