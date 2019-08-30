let token = null
const self = chrome.runtime.id

class Emitter extends EventTarget{emit(){this.dispatchEvent(new Event('catch'))}}
const emitter = new Emitter()

chrome.webRequest.onBeforeSendHeaders.addListener(details => {
	let target = details.requestHeaders.find(header => header.name.toLowerCase() === 'x-jike-access-token')
	if(target && target.value != token){
		token = target.value
		emitter.emit()
	}
}, {urls: ['*://app.jike.ruguoapp.com/*']}, ['requestHeaders'])

chrome.webRequest.onHeadersReceived.addListener(details => {
	let headers = details.responseHeaders
	if((details.initiator || details.documentUrl).startsWith(chrome.extension.getURL('').slice(0, -1))){
		let index = headers.findIndex(header => header.name.toLowerCase() === 'x-frame-options')
		if(index != -1) headers.splice(index, 1)
	}
	return {responseHeaders: headers}
}, {urls: ['*://web.okjike.com/*'], types: ['sub_frame']}, ['blocking', 'responseHeaders'])

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if(sender.id != self) return
	if(message.call === 'jikeQuery') jikeQuery.apply(null, message.payload).catch(console.error).then(data => sendResponse(data))
	return true
})

let pending = null
const refresh = () => 
	pending || (pending = new Promise(resolve => {
		const listener = () => {
			emitter.removeEventListener('catch', listener)
			resolve()
		}
		emitter.addEventListener('catch', listener)
		const iframe = document.createElement('iframe')
		iframe.src = 'https://web.okjike.com/feed'
		iframe.style.display = 'none'
		document.body.appendChild(iframe)
		iframe.onload = () => setTimeout(() => /*resolve*/(iframe.parentNode.removeChild(iframe)), 5000)
	}).then(() => pending = null))

const jikeQuery = (method, path, data) => {
	const headers = {
		// 'platform': 'web',
		// 'app-version': '5.3.0',
		'accept': 'application/json',
		'content-type': 'application/json',
		'x-jike-access-token': token
	}
	return fetch(`https://api.jellow.club/${path}`, {method, headers, body: JSON.stringify(data)})
	.then(response =>
		response.status === 401 ? refresh().then(() => jikeQuery(method, path, data)) : response.json()
	)
}