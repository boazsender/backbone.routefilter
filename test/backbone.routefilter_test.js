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
          "page/:id(/:edit)": "page"
        },
        before: function( param, route ) {
          harness.cache.before = {
              param:param,
              route:route
          };
        },
        after: function( param, route ) {
          harness.cache.after = {
              param:param,
              route:route
          };
        },
        index: function( route ){
          harness.cache.route = "";
        },
        page: function( param1, param2){
          harness.cache.route = [param1,param2];
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
  test("basic navigation still works", 3, function() {

    // Trigger the router
    harness.router.navigate('', true);
    equal(harness.cache.route, "", "Index route triggered");

    harness.router.navigate('page/2', true);
    equal(harness.cache.route.toString(), "2,", "successfully routed to page/2, and recieved route arg of 2");

    harness.router.navigate('page/2/edit', true);
    equal(harness.cache.route.toString(), "2,edit", "successfully routed to page/2/edit, and recieved route arg of 2 and edit");

  });

  // Ensure the basic navigation still works like normal routers
  test("before and after filters work", 6, function() {

    harness.router.navigate('', true);

    ok(harness.cache.before, "before triggered");
    ok(harness.cache.after, "after triggered");

    harness.router.navigate('page/2', true);
    equal(harness.cache.before.param[0], 2, "successfully passed `2` to before filtrer after routing to page/2");
    equal(harness.cache.after.param[0], 2, "successfully passed `2` to after filtrer after routing to page/2");

    harness.router.navigate('page/2/edit', true);
    equal(
        harness.cache.before.param.toString(),
        "2,edit",
        "successfully passed `2` and `edit` to before filtrer after routing to page/2/edit");
    equal(
        harness.cache.after.param.toString(),
        "2,edit",
        "successfully passed `2` and `edit` to after filtrer after routing to page/2/edit");
  });

  module("returning from before filter", {
    setup: function() {

      // Set up a cache to store test data in
      harness.cache = {};


      // Set up a a Router.
      harness.Router = Backbone.Router.extend({
        routes: {
          "": "index",
          "page/:id": "page"
        },
        before: function( route ) {
          harness.cache.before = (route || true);
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

      // Instantiate the Router.
      harness.router = new harness.Router();

      // Start the history.
      Backbone.history.start();
      harness.router.navigate("", true);

    },
    teardown: function() {
      harness.router.navigate("", false);
      Backbone.history.stop();
    }
  });

  // Test that return false behaves properly from inside the before filter.
  test("return false works on before filter", 3, function() {

    // Navigate to page two.
    harness.router.navigate('page/foo', true);

    // Override the before filter on the fly
    harness.router.before = function(param, route ) {
      harness.cache.before = param[0];

      if( param[0] === 'bar' ){
        return false;
      }
    };

    // Navigate to the place our before filter is handling.
    harness.router.navigate('page/bar', true);

    equal(harness.cache.before, "bar", "The before filter was called, and was passed the correct arg, bar.");
    equal(harness.cache.after, "foo", "The orginal route callback was not called after the before filter was over ridden to return false.");
    equal(harness.cache.after, "foo", "The after filter was not called after the before filter was over ridden to return false");

  });


  module("Binding multiple routes to the same handler", {
    setup: function() {

      // Set up a cache to store test data in
      harness.cache = {};


      // Set up a a Router.
      harness.Router = Backbone.Router.extend({
        routes: {
          "": "index",
          "page/:id": "page",
          "foo/:id": "page"
        },
        before: function( route ) {
          harness.cache.before = (route || true);
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

      // Instantiate the Router.
      harness.router = new harness.Router();

      // Start the history.
      Backbone.history.start();
      harness.router.navigate("", true);

    },
    teardown: function() {
      harness.router.navigate("", false);
      Backbone.history.stop();
    }
  });

  // Test that two routes can use the same handler as a callback, and route
  // successfully to both routes
  test("Navigate to one of the double bound handlers", 2, function() {

    // Navigate to the first route.
    harness.router.navigate('page/2', true);

    equal(harness.cache.route, 2, "successfully routed to the first double bound route, and it equaled the right thing");

    // Navigate to the second route.
    harness.router.navigate('foo/3', true);

    equal(harness.cache.route, 3, "successfully routed to the second double bound route, and it equaled the right thing");

  });

  // Test that a route can be added ad hoc using router.route, and everything
  // still behaves properly
  test("Add a third double route handler ad hoc", 1, function() {

    // Add a new route ad hoc
    harness.router.route("bar/:id", "page");

    // Navigate to the new route
    harness.router.navigate('bar/2', true);

    equal(harness.cache.route, 2, "successfully routed to the double bound route, and it equaled the right thing");

  });


}(jQuery, Backbone, _));
