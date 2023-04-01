chrome.runtime.onMessage.addListener(handleIncomingMessage);

function handleIncomingMessage(request, sender, sendResponse) {
  switch(request.action) {
    case 'uploadConversation': 
      const conversation = getConversation();
      const conversationText = `${JSON.stringify(conversation, null, 2)}`;
      chrome.runtime.sendMessage({
        action: "uploadToAPI",
        conversation: conversationText,
      });
    break;
  case 'uploadComplete':
    console.log(request.url);
    url = 'https://share-chat-gpt.web.app/?url=' + request.url;
    copyToClipboard(url);
    showSuccessPopup(url);
    break;
  }
}

function getConversation() {
  const messages = document.querySelectorAll('.text-base');
  let conversation = [];

  messages.forEach((message) => {
    const aux = message.querySelector('.items-start');
    const text = aux.innerHTML;
    const role = aux.childElementCount ? 'Chat-GPT' : 'Me';
    conversation.push({"role": role, "text": text});
  });

  return conversation;
}

// function generateHTML(conversation) {
//   let html = "";
//   conversation.forEach( (msg) => {
//     html += `<div class="message"><div class="role role-${msg.role}">${msg.role}</div><div class="content">${msg.text}</div></div>`;
//   });
//   return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>ChatGPT Conversation</title><link rel="stylesheet" type="text/css" href="https://share-chat-gpt.web.app/share-chatgpt.css"></head><body><main><div class="chat">${html}</div></main></body></html>`;
// }


function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function showSuccessPopup(url) {
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.zIndex = '10000';
  popup.style.top = '10px';
  popup.style.right = '10px';
  popup.style.backgroundColor = '#4CAF50';
  popup.style.color = 'white';
  popup.style.padding = '15px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.25)';
  popup.style.fontFamily = 'Arial, sans-serif';
  popup.style.fontSize = '16px';
  popup.innerHTML = `URL copied to clipboard: <a href="${url}" target="_blank" style="color: white; text-decoration: underline;">${url}</a>`;
  document.body.appendChild(popup);

  setTimeout(() => {
    document.body.removeChild(popup);
  }, 5000);
}

