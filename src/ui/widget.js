//////////////////////////////////////////////////////////////////////////////
/**
 * Create a new instance of class widget
 *
 * @class
 * @extends {geo.sceneObject}
 * @returns {geo.gui.widget}
 */
//////////////////////////////////////////////////////////////////////////////
geo.gui.widget = function (arg) {
  'use strict';
  if (!(this instanceof geo.gui.widget)) {
    return new geo.gui.widget(arg);
  }
  geo.sceneObject.call(this, arg);

  var m_this = this,
      s_exit = this._exit,
      m_layer = arg.layer;

  this._init = function () {
    m_this.modified();
  };

  this._exit = function () {
    m_this.children().forEach(function (child) {
      m_this._deleteFeature(child);
    });

    this.layer().geoOff(geo.event.pan, this.positionMaybe);
    m_this.$el.remove();

    s_exit();
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Create feature give a name
   *
   * @returns {geo.Feature} Will return a new feature
   */
  ////////////////////////////////////////////////////////////////////////////
  this._createFeature = function (featureName, arg) {

    var newFeature = geo.createFeature(
      featureName, m_this, m_this.renderer(), arg);

    m_this.addChild(newFeature);
    m_this.modified();
    return newFeature;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Delete feature
   */
  ////////////////////////////////////////////////////////////////////////////
  this._deleteFeature = function (feature) {
    m_this.removeChild(feature);
    feature._exit();
    return m_this;
  };

  ////////////////////////////////////////////////////////////////////////////
  /**
   * Return the layer associated with this widget.
   */
  ////////////////////////////////////////////////////////////////////////////
  this.layer = function () {
    return m_layer;
  };

  // returns {top: m, left: n}
  this.position = function () {
    var position;

    if (m_this.args &&
        m_this.args.hasOwnProperty('position') &&
        m_this.args.hasOwnProperty('positionType') &&
        m_this.args.hasOwnProperty(m_this.args.position)) {

      if (m_this.args.positionType === 'gcs') {
        position = m_this.layer().map().gcsToDisplay(m_this.args[m_this.args.position]);
      } else if (m_this.args.positionType === 'viewport') {
        position = m_this.args[m_this.args.position];
      }

      return {
        left: position.x,
        top: position.y
      };
    }

    return {
      left: 0,
      top: 0
    };
  };

  this.positionMaybe = function () {
    m_this.$el.css($.extend({position: 'relative'}, m_this.position()));
  };

  // @todo doesn't detect if its partially in the viewport.. would need to look at width/height of widget
  this.isInViewport = function () {
    var position = m_this.position();
    var map = m_this.layer().map().node();

    return ((position.left >= 0 && position.top >= 0) &&
            (position.left <= map.width() && position.top <= map.height()));
  };

  this.layer().geoOn(geo.event.pan, this.positionMaybe);
};
inherit(geo.gui.widget, geo.sceneObject);
