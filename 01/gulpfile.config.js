'use strict';
var GulpConfig = (function () {
    function GulpConfig() {
        this.liveReloadPort = 35729;
        this.expressPort = 9000;
        this.dev = 'app/';
        this.dist = 'dist/';

        this.templateSource = this.dev + 'scripts/**/*.tpl.html';
        this.cssSource = this.dev + 'styles/main.css';
        this.javaScriptSource = [this.dev + 'scripts/**/*.js', '!scripts/**/*.default'];
        this.javaScriptTestsSource = ['tests/**/*.js'];    
    }
    return GulpConfig;
})();
module.exports = GulpConfig;