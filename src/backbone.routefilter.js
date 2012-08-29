/*! backbone.routefilter - v0.1-pre - 2012-08-29
* undefined
* Copyright (c) 2012 Boaz Sender; Licensed  */

/*global Backbone:false, _: false*/

(function(Backbone, _) {
  // Save a reference to the original _bindRoutes to be called
  // after we pave it over.
  var _bindRoutes = Backbone.Router.prototype._bindRoutes;
  // Create a reusable no operation func for the case where a before
  // or after filter is not set. Backbone or Underscore should have
  // a global one of these in my opinion.
  var nop = function(){};

  // Extend the router prototype with a default before function,
  // a default after function, and a pave over of _bindRoutes.
  _.extend(Backbone.Router.prototype, {
    before: nop,
    after: nop,
    _bindRoutes: function() {
      // Iterate over each route in this Router instance
      _.each( this.routes, function( method, route ){

          // Do what Backbone.Router.route does and make sure the route is a
          // RegExp. We need to mimic Backbone.Router.route internal behavior
          // here in order to prepare the route args to be passed into our
          // filters, and the original callback properly.
          if (!_.isRegExp(route)) {
            route = this._routeToRegExp(route);
          }
          
          // Cache the original callback so we can pave over it with
          // a wrapper function that will call the original callback
          // internally along with the before and after filters.
          var originalCallback = this[ method ];

          // Pave over the original callback for this route.
          this[ method ] = function(){
            // Grab the current url fragment from Backbone.history. We have to
            // wait until we're inside of the route callback to try to access
            // The Backbone.history singleton to ensure that it has been 
            // instantiated.
            var fragment = Backbone.history.getFragment();

            // Finish preparing the args now that we have the fragment.
            var args = this._extractParameters( route, fragment );
            
            // Call the before filter and if it returns false, run the
            // route's original callback, and after filter. This allows
            // the user to return false from within the before filter
            // to prevent the after original route callback and after
            // filter from running.
            if( this.before.apply(this, args) !== false ){
              // Call the original callback.
              originalCallback.apply(this, args);
              // Call the after filter.
              this.after.apply(this, args);
            }
          };
      }, this);

      // Call the original _bindRoutes function to continue Backbone's
      // behavior of getting all the route callbacks and names
      // onto Backbone.History.handlers.
      _bindRoutes.apply(this, arguments);
    }
  });
}(Backbone, _));