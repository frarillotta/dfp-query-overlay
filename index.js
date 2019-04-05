javascript:

var slots = window.top.googletag.pubads().getSlots();

var on = true;

init(slots);


function init(slots) {

    checkReload();

    for (let i = 0; i < slots.length; i++) {

        renderDiv(slots[i]);

    }

}


function getSelectors(slot) {

    return "#" + slot.getSlotElementId() + ">div";

}


function renderDiv (slot) {

    try {

        let selector = getSelectors(slot);

        var div = document.createElement("div");

        div.id = "dfpOrderIds";

        div.style.width = getWidth(selector) + 'px';

        div.style.height = getHeight(selector) + 'px';

        div.style.opacity = 0.8;

        div.style.background = "#FFD42B";

        div.style.position = "absolute";

        div.style.zIndex = "999999999999";

        var data = JSON.stringify(queryDfpGateway(slot)).split(",");

        for (i = 0; i < data.length; i++) {

            var info = document.createElement("p");

            info.style.fontFamily = "Arial, Helvetica, sans-serif";

            info.style.fontSize = "12px";

            info.style.fontWeight = "bold";

            info.innerText = data[i];

            info.style.textAlign = "center";

            div.append(info);

        }

        div.addEventListener("mouseover", function() {

            div.style.opacity = 1;

        });

        div.addEventListener("mouseout", function() {

            div.style.opacity = 0.8;

        });

        window.top.document.querySelector(selector).prepend(div);

    } catch (err) {

        return

    }

}


function getWidth(selector) {

    try {

    return window.top.document.querySelector(selector.toString()).getBoundingClientRect().width;

    } catch (err) {

        return 0

    }

}


function getHeight(selector) {

    try {

        return window.top.document.querySelector(selector.toString()).getBoundingClientRect().height;

    } catch (err) {

        return 0

    }

}


function getDfpId(slot) {

    let adUnitPath = slot.getAdUnitPath();

    let dfpId = adUnitPath.split("/")[1];

    return dfpId

}


function queryDfpGateway(slot) {

    if (!getLineItemId(slot)) {

        return ("Adx or AdSense Line Item")

    }

    var dfpGatewayEndpoint = "https://dfp-gateway.onscroll.com/";

    let dfpId = getDfpId(slot);

    let gatewayResponse = JSON.parse(httpGet(dfpGatewayEndpoint + "1/" + dfpId + "/" + getLineItemId(slot)));

    if (gatewayResponse.state === "PENDING") {

        setTimeout(() => {

            queryDfpGateway(slot)

        }, 2000);

    }

    if (gatewayResponse.state === "READY" || "NO_ACCOUNT_ACCESS") {

        return gatewayResponse

    }

}


function getLineItemId(slot) {

    var responseInformation = slot.getResponseInformation();

    if (!responseInformation) {

        return

    }

    return responseInformation.lineItemId;

}


function httpGet(theUrl) {

    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open( "GET", theUrl, false );

    xmlHttp.send( null );

    return xmlHttp.responseText;

}


function clearOverlay() {

    on = false;

    var overlays = document.querySelectorAll("#dfpOrderIds");

    for (i = 0; i < overlays.length; i++) {

        document.querySelector("#dfpOrderIds").remove();

    }

}


function checkReload() {

    window.top.googletag.pubads().addEventListener('slotRenderEnded', function(event) {

        if (on) {

            try {

                let slotLineItemID = event.slot.getResponseInformation().lineItemId;

                console.log('%c>>' + event.slot.getSlotElementId() + "%c just reloaded with Line Item Id: " + '%c' + slotLineItemID + "%c and Order Id: " + '%c' + queryDfpGateway(event.slot).orderId,'background: #222; color: #FFD700; font-size: 14px; font-weight: bold', 'background: #222; color: #FF7F50; font-size: 12px; font-weight: italic', 'background: #222; color: #FFD700; font-size: 14px; font-weight: bold', 'background: #222; color: #FF7F50; font-size: 12px; font-weight: italic', 'background: #222; color: #FFD700; font-size: 14px; font-weight: bold');

                setTimeout(renderDiv(event.slot), 4000);

            }

            catch (e) {

            }

        }

    })

}
