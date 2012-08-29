/*! backbone.routefilter - v0.1.0-pre - 2012-08-29
* undefined
* Copyright (c) 2012 Boaz Sender; Licensed  */

/*! backbone.routefilter - v0.1-pre - 2012-08-29
* undefined
* Copyright (c) 2012 Boaz Sender; Licensed  */

(function(window) {

  var nop = function(){};

  _.extend(Backbone.Router.prototype, {
    before: nop,
    after: nop,
    route: function(route, name, callback) {
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        // Call the before filter and if it doesn't return undefined don't run the route
        // callback. This allows the user to return false from within the before
        // filter to prevent the route from running it's callback.
        if( this.before.apply(this, args) === undefined ){
          callback && callback.apply(this, args);
          this.trigger.apply(this, ['route:' + name].concat(args));
          Backbone.history.trigger('route', this, name, args);
          // Call the after filter.
          this.after.apply(this, args);
        }
      }, this));
      return this;
    }
  });
})(this);
