let token = null
const self = chrome.runtime.id

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	let target = details.requestHeaders.find(header => header.name.toLowerCase() === 'x-jike-access-token')
	if(target && target.value != token) token = target.value
}, {urls: ['*://app.jike.ruguoapp.com/*']}, ['requestHeaders'])

chrome.webRequest.onHeadersReceived.addListener(details => {
	let headers = details.responseHeaders
	if(details.initiator == `chrome-extension://${self}`){
		let index = headers.findIndex(header => header.name.toLowerCase() === 'x-frame-options')
		if(index != -1) headers.splice(index, 1)
	}
	return {responseHeaders: headers}
}, {urls: ['*://web.okjike.com/*'], types: ['sub_frame']}, ['blocking', 'responseHeaders'])

chrome.runtime.onMessage.addListener((message, sender) => {
	if(sender.id != self) return
	if(message.call === 'token') chrome.tabs.sendMessage(sender.tab.id, {token})
})
