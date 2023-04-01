chrome.action.onClicked.addListener(onExtensionClicked);
chrome.runtime.onMessage.addListener(handleIncomingMEssage);

function onExtensionClicked(tab) {
  chrome.tabs.sendMessage(tab.id, { action: "uploadConversation" });
}

function handleIncomingMEssage(request, sender, sendResponse) {
  if (request.action === "uploadToAPI") {
    chrome.action.setIcon({ path: "loading.gif", tabId: sender.tab.id });
    uploadToAPI(request.conversation).then((response) => {
      chrome.action.setIcon({ path: "icon.png", tabId: sender.tab.id });
      chrome.tabs.sendMessage(sender.tab.id, { action: "uploadComplete", url: response.filePath });
    }).then((result) => {
      console.log("Success:", result);
    }).catch((error) => {
      chrome.action.setIcon({ path: "icon.png", tabId: sender.tab.id });
      console.log("Error uploading: " + error);
    });
  }
};

async function uploadToAPI(content) {

  const url = "https://api.upload.io/v2/accounts/FW25bBG/uploads/binary";
  const authorizationKey = "Bearer public_FW25bBGCtcUFwL763SbnWSbiBRqk";

  const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "Authorization": authorizationKey      
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: content, // body data type must match "Content-Type" header
    });

  return response.json();
}