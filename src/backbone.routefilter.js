/*! backbone.routefilter - v0.1-pre - 2012-08-29
* undefined
* Copyright (c) 2012 Boaz Sender; Licensed  */

/*global Backbone:false, _: false*/

(function(Backbone, _) {
  var _bindRoutes = Backbone.Router.prototype._bindRoutes;
  var nop = function(){};

  _.extend(Backbone.Router.prototype, {
    before: nop,
    after: nop,
    _bindRoutes: function() {
      _.each( this.routes, function( method, route ){

          if (!_.isRegExp(route)) {
            route = this._routeToRegExp(route);
          }
          
          var originalCallback = this[ method ];

          this[ method ] = function(){
            var fragment = Backbone.history.getFragment();
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
      _bindRoutes.apply(this, arguments);
    }
  });
}(Backbone, _));