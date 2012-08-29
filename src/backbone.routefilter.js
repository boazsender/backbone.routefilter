/*
 * backbone.routefilter
 * https://github.com/boazsender/backbone.routefilter
 *
 * Copyright (c) 2012 Boaz Sender
 * Licensed under the MIT, GPL licenses.
 */

(function(Backbone, _) {

  _.extend(Backbone.Router.prototype, {
    before: function(){

      console.log('im in the prototype - before')

    },
    after: function(){

      console.log('im in the prototype - after')

    },
    route: function(route, name, callback) {
      this.before();
      Backbone.history || (Backbone.history = new Backbone.History);
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (!callback) callback = this[name];
      Backbone.history.route(route, _.bind(function(fragment) {
        var args = this._extractParameters(route, fragment);
        callback && callback.apply(this, args);
        this.trigger.apply(this, ['route:' + name].concat(args));
        Backbone.history.trigger('route', this, name, args);
      }, this));
      this.after();
      return this;
    },
  });

}(Backbone, _));
