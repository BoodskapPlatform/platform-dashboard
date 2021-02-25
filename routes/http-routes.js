var Routes = function (app,router) {

    this.app = app;
    this.router = router;
    this.init();

};
module.exports = Routes;


Routes.prototype.init = function () {

    var self = this;

    //Session check each routes
    var sessionCheck = function (req, res, next) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            req.session.sessionObj = JSON.parse(sessionObj);
            next();
        } else {
            res.redirect(self.app.conf.basepath+'/login');
        }
    };

    //Role based session check
    var onlyAdmin = function (req, res, next) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            var role = JSON.parse(sessionObj).user.roles;
            req.session.sessionObj = JSON.parse(sessionObj);

            if (role.indexOf('admin') !== -1 || role.indexOf('domainadmin') !== -1) {
                next();
            } else {
                console.log(new Date() + " | unauthorized access");
                res.sendStatus(401)
            }
        } else {
            res.redirect(self.app.conf.basepath+'/login');
        }
    };


    self.router.get('/', sessionCheck, function (req, res) {

        res.redirect(self.app.conf.basepath+'/dashboard');

    });

    self.router.get('/login', function (req, res) {
        var sessionObj = req.cookies['session_obj'];
        if (sessionObj) {
            res.redirect(self.app.conf.basepath+'/dashboard');
        } else {
            if(self.app.conf.domainKey){
                res.render('login-custom.html', {layout: false, basepath:self.app.conf.fullpath,domainKey: self.app.conf.domainKey});
            }else{
                res.render('login.html', {layout: false, basepath:self.app.conf.fullpath});
            }
        }
    });

    self.router.get('/dashboard', sessionCheck, function (req, res) {
        res.render('dashboard.html', {layout: '',sessionObj:req.session.sessionObj, basepath:self.app.conf.fullpath});
    });

   /* self.router.get('/user-access', onlyAdmin,function (req, res) {
        res.render('users.html', {layout: '',sessionObj:req.session.sessionObj, basepath:self.app.conf.fullpath});
    });*/

    /******************
     To add new routes
     ===================

     without session check
     =====================
     self.app.get('/<url_path_name>', function (req, res) {
        res.render('<html_name>.html', {layout: ''});
     });

     with session check
     ==================
     self.app.get('/<url_path_name>', sessionCheck, function (req, res) {
        res.render('<html_name>.html', {layout: ''});
     });


     ****************/


    self.app.use(self.app.conf.basepath,self.router);


};

