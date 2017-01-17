(function() {
  'use strict';

  /**
    * @class LoaderConsole
    */
  function LoaderConsole() {
    this.init();
  }

  LoaderConsole.prototype.init = function() {
    this.dataDOM = document.createElement('div');
    // hide this dataDOM
    this.dataDOM.style.display = 'none';
    document.body.appendChild(this.dataDOM);
  };

  LoaderConsole.prototype.log = function(msg) {
    var log = document.createElement('div');
    log.innerHTML = msg;
    this.dataDOM.appendChild(log);
  };

  LoaderConsole.prototype.getLog = function() {
    var logEls = this.dataDOM.childNodes;
    var output = [];
    for (var i = 0, len = logEls.length; i < len; i++) {
      output.push(logEls[i].innerHTML);
    }
    return output;
  };

  LoaderConsole.prototype.clean = function() {
    while(this.dataDOM.firstChild) {
      this.dataDOM.removeChild(this.dataDOM.firstChild);
    }
  };

  window.loaderConsole = new LoaderConsole();

})();
