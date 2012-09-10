/*! backbone.routefilter - v0.1.0 - 2012-08-29
* https://github.com/boazsender/backbone.routefilter
* Copyright (c) 2012 Boaz Sender; Licensed MIT */
/*global Backbone:false, _: false, console: false*/

(function(Backbone, _) {

  // Save a reference to the original route to be called
  // after we pave it over.
  var originalRoute = Backbone.Router.prototype.route;

  // Create a reusable no operation func for the case where a before
  // or after filter is not set. Backbone or Underscore should have
  // a global one of these in my opinion.
  var nop = function(){};

  // Extend the router prototype with a default before function,
  // a default after function, and a pave over of _bindRoutes.
  _.extend(Backbone.Router.prototype, {

    // Add default before filter.
    before: nop,

    // Add default after filter.
    after: nop,

    route: function(route, name, callback) {
      if (!callback) { callback = this[name]; }
      return originalRoute.call(this, route, name, _.bind(function() {
        if (this.before.apply(this, arguments) === false) { return; }
        callback && callback.apply(this, arguments);
        this.after.apply(this, arguments);
      }, this));
    }

  });

}(Backbone, _));
