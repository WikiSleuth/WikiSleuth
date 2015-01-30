var UnitTester = function() {

  this.init = function() {
    return;
  }

  this.hello = function() {
    document.body.appendChild(document.createTextNode('hello'));
    return 'hello';
  }

  this.init();

}

var tester = new UnitTester();
tester.hello();