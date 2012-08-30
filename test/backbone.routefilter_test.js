/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Backbone:false, _: false, console: false*/
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

  var harness = window.harness = {};

  module("routes", {
    setup: function() {
      
      // Set up a cache to store test data in
      harness.cache = {};

      // Set up a test router
      harness.Router = Backbone.Router.extend({
        routes: {
          "": "index",
          "page/:id": "page"
        },
        before: function( route ) {
          harness.cache.before = (route||true);
        },
        after: function( route ) {
          harness.cache.after = (route||true);
        },
        index: function( route ){
          harness.cache.route = "";
        },
        page: function( route ){
          harness.cache.route = route;
        }        
      });

      harness.router = new harness.Router();
      Backbone.history.start();
    },
    teardown: function() {
      harness.router.navigate("", false);
      Backbone.history.stop();
    }
  });

  // Ensure the basic navigation still works like normal routers
  test("basic navigation still works", 2, function() {
 
    // Trigger the router
    harness.router.navigate('', true);
    equal(harness.cache.route, "", "Index route triggered");
    
    harness.router.navigate('page/2', true);
    equal(harness.cache.route, 2, "successfully routed to page/2, and recieved route arg of 2");
 
  });

  // Ensure the basic navigation still works like normal routers
  test("before and after filters work", 4, function() {
 
    harness.router.navigate('', true);

    ok(harness.cache.before, "before triggered");
    ok(harness.cache.after, "after triggered");

    harness.router.navigate('page/2', true);
    equal(harness.cache.before, 2, "successfully passed `2` to before filtrer after routing to page/2"); 
    equal(harness.cache.after, 2, "successfully passed `2` to after filtrer after routing to page/2"); 

  });


  module("returning from before filter", {});

  // Test that return false behaves properly from inside the before filter.
  test("return false works on before filter", 3, function() {
    // Set up a cache to store test data in
    var cache = {};


    // Set up a a Router.
    var Router = Backbone.Router.extend({
      routes: {
        "": "index",
        "page/:id": "page"
      },
      before: function( route ) {
        cache.before = (route || true);
      },
      after: function( route ) {
        cache.after = (route||true);
      },
      index: function( route ){
        cache.route = "";
      },
      page: function( route ){
        cache.route = route;
      }        
    });

    // Instantiate the Router.
    var router = new Router();

    // Start the history.
    Backbone.history.start();

    // Navigate to page two.
    router.navigate('page/foo', true);

    // Override the before filter on the fly
    router.before = function( route ) {
      cache.before = (route || true);

      if( route === 'bar' ){
        return false;
      }
    };
   
    // Navigate to the place our before filter is handling.
    router.navigate('page/bar', true);

    equal(cache.before, "bar", "The before filter was called, and was passed the correct arg, bar.");
    equal(cache.after, "foo", "The orginal route callback was not called after the before filter was over ridden to return false.");
    equal(cache.after, "foo", "The after filter was not called after the before filter was over ridden to return false");
    
    console.log(cache);

  });

}(jQuery, Backbone, _));