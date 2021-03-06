const createElement = (tagName, className, innerHTML) => {
	let element = document.createElement(tagName)
	if(className) element.className = className
	if(innerHTML) element.innerHTML = innerHTML
	return element
}

const cache = {
	set: (key, value, live = 5 * 60 * 1000) => localStorage.setItem(key, JSON.stringify({value, expiration: Date.now() + live})),
	get: key => {
		try{
			let item = JSON.parse(localStorage.getItem(key))
			return (item.expiration > Date.now() ? item.value : null)
		}
		catch(e){
			return null
		}
	}
}

const jikeRemote = (...payload) => new Promise(resolve => chrome.runtime.sendMessage({call: 'jikeQuery', payload}, response => resolve(response)))

const dailyCard = () => {
	const query = () => 
		jikeRemote('GET', '1.0/dailyCards/list')
		.then(body => body.data.cards[0])
		.then(item => cache.set('calendar', item) || item)

	return Promise.resolve(cache.get('calendar') || query())
	.then(item => {
		console.log(item)

		let footer = document.getElementsByClassName('footer')[0]
		footer.getElementsByClassName('date')[0].innerHTML = item.date.replace(/-0*/g, '/')
		footer.getElementsByClassName('fortune')[0].innerHTML = item.fortune
		footer.getElementsByClassName('greeting')[0].innerHTML = `${item.greetings.firstLine.replace(/！|。/g, '')}！${item.greetings.secondLine}`
	})
}

const userProfile = () => {
	const query = () => 
		jikeRemote('GET', '1.0/users/profile')
		.then(body => body.user)
		.then(item => cache.set('profile', item, 60 * 60 * 1000) || item)

	return Promise.resolve(cache.get('profile') || query())
	.then(item => {
		console.log(item)
		let now = new Date()
		let join = new Date(item.createdAt)

		let footer = document.getElementsByClassName('footer')[0]
		footer.getElementsByClassName('date')[0].textContent = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()}`
		footer.getElementsByClassName('fortune')[0].textContent = now.getDay() === 5 ? '今天周五！' : '不是周五'
		footer.getElementsByClassName('greeting')[0].textContent = `Hi，${item.username}！今天是你来即刻社区的第 ${Math.round((now - join) / 86400000)} 天`
	})
}

const squarePost = () => {
	const dateFormat = utc => {
		let date = new Date(utc)
		return `${date.getMonth() + 1}/${date.getDate()}`
	}

	const randomSelect = array => array[Math.floor(Math.random() * array.length)]
	const topics = [
		'5618c159add4471100150637', // 浴室沉思
		'557ed045e4b0a573eb66b751', // 无用但有趣的冷知识
		'5a82a88df0eddb00179c1df7', // 今日烂梗
		'572c4e31d9595811007a0b6b', // 弱智金句病友会
		'56d177a27cb3331100465f72', // 今日金句
		'5aa21c7ae54af10017dc93f8', // 一个想法不一定对
		'5bf22b38ffa4f00017e1a8ff', // 有一点哲学在里面
	]

	return jikeRemote('POST', '1.0/topicFeed/list', {topicId: randomSelect(topics), limit: 20})
	.then(body => body.data.filter(message => message.content && message.content.length <= 100 && (message.content.match(/\n/g) || []).length <= 5))
	.then(data => randomSelect(data))
	.then(item => {
		console.log(item)

		let post = document.getElementsByClassName('post')[0]
		document.getElementsByClassName('theme')[0].textContent = item.topic.content
		document.getElementsByClassName('text')[0].innerHTML = item.content.replace(/\n/g, '<br>')
		post.getElementsByClassName('author')[0].textContent = item.user.screenName
		post.getElementsByClassName('date')[0].textContent = dateFormat(item.createdAt)
	})
}

Promise.all([squarePost(), userProfile()])
