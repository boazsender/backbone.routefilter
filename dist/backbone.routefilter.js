/*! backbone.routefilter - v0.1.0-pre - 2012-08-29
* undefined
* Copyright (c) 2012 Boaz Sender; Licensed  */

/*! backbone.routefilter - v0.1-pre - 2012-08-29
* undefined
* Copyright (c) 2012 Boaz Sender; Licensed  */
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
          
          delete this[ method ];
          var that = this;

          this[ method ] = function(){
            var args = this._extractParameters(
              route,
              Backbone.history.getFragment()
            );
            this.before.apply(this, args);
            originalCallback.apply(this, args);
            this.after.apply(this, args);
          };
      
      }, this);
      _bindRoutes.apply(this, arguments);
    }
  });
}(Backbone, _));