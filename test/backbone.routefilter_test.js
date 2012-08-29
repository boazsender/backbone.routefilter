/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Backbone:false, _: false*/
(function($, Backbone, _) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */
  module("routes", {
    setup: function() {
      var self = this;

      // Set up a cache to store test data in
      self.cache = window.cache= {};

      // Set up a test router
      self.Router = Backbone.Router.extend({
        routes: {
          "": "index",
          "page/:id": "page"
        },
        before: function( route ) {
          self.cache.before = (route||true);
        },
        after: function( route ) {
          self.cache.after = (route||true);
        },
        index: function( route ){
          self.cache.route = "";
        },
        page: function( route ){
          self.cache.route = route;
        }        
      });

      self.router = new self.Router();
    }
  });

  // Ensure the basic navigation still works like normal routers
  test("basic navigation still works", function() {
    expect(2);

    var self = this;

    // Trigger the router
    Backbone.history.start();
    self.router.navigate('', true);
    equal(self.cache.route, "", "Index route triggered");
    
    self.router.navigate('page/2', true);
    equal(self.cache.route, 2, "successfully routed to page");
  });

  // Ensure the basic navigation still works like normal routers
  test("before and after filters work", function() {
    expect(4);

    var self = this;
    self.router.navigate('', true);

    ok(self.cache.before, "before triggered");
    ok(self.cache.after, "after triggered");

    self.router.navigate('page/2', true);
    equal(self.cache.before, 2, "successfully passed `2` to before filtrer after routing to page/2"); 
    equal(self.cache.after, 2, "successfully passed `2` to after filtrer after routing to page/2"); 
  });

}(jQuery, Backbone, _));
