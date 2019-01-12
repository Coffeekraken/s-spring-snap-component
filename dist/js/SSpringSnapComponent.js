"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SWebComponent2 = _interopRequireDefault(require("coffeekraken-sugar/js/core/SWebComponent"));

var _addEventListener = _interopRequireDefault(require("coffeekraken-sugar/js/dom/addEventListener"));

var _offset = _interopRequireDefault(require("coffeekraken-sugar/js/dom/offset"));

var _scrollTop = _interopRequireDefault(require("coffeekraken-sugar/js/dom/scrollTop"));

var _scrollLeft = _interopRequireDefault(require("coffeekraken-sugar/js/dom/scrollLeft"));

var _animejs = _interopRequireDefault(require("animejs"));

var _throttle = _interopRequireDefault(require("coffeekraken-sugar/js/utils/functions/throttle"));

var _distanceBetween = _interopRequireDefault(require("coffeekraken-sugar/js/geom/2d/distanceBetween"));

var _circleConstrain = _interopRequireDefault(require("coffeekraken-sugar/js/geom/2d/circleConstrain"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var SSpringSnapComponent =
/*#__PURE__*/
function (_SWebComponent) {
  _inherits(SSpringSnapComponent, _SWebComponent);

  function SSpringSnapComponent() {
    _classCallCheck(this, SSpringSnapComponent);

    return _possibleConstructorReturn(this, _getPrototypeOf(SSpringSnapComponent).apply(this, arguments));
  }

  _createClass(SSpringSnapComponent, [{
    key: "componentWillMount",

    /**
     * Component will mount
     * @definition    SWebComponent.componentWillMount
     * @protected
     */
    value: function componentWillMount() {
      _get(_getPrototypeOf(SSpringSnapComponent.prototype), "componentWillMount", this).call(this); // internal variables


      this._mousePos = {
        x: 0,
        y: 0 // offset of this component

      };
      var offsetPos = (0, _offset.default)(this);
      this._pos = {
        x: offsetPos.left + this.offsetWidth * .5,
        y: offsetPos.top + this.offsetHeight * .5 // is snaped

      };
      this._snaped = false;
    }
    /**
     * Mount component
     * @definition    SWebComponent.componentMount
     * @protected
     */

  }, {
    key: "componentMount",
    value: function componentMount() {
      _get(_getPrototypeOf(SSpringSnapComponent.prototype), "componentMount", this).call(this); // add mouse move handler


      this._mouseMoveRemoveListener = (0, _addEventListener.default)(document, 'mousemove', (0, _throttle.default)(this._mouseMoveHandler, 50), this);
    }
    /**
     * Component unmount
     * @definition    SWebComponent.componentUnmount
     * @protected
     */

  }, {
    key: "componentUnmount",
    value: function componentUnmount() {
      _get(_getPrototypeOf(SSpringSnapComponent.prototype), "componentUnmount", this).call(this); // remove event listeners


      if (this._mouseMoveRemoveListener) this._mouseMoveRemoveListener();
    }
    /**
     * Mouse move handler
     * @param    {MouseEvent}    The mouse event
     */

  }, {
    key: "_mouseMoveHandler",
    value: function _mouseMoveHandler(e) {
      var _this = this;

      // update mouse position
      this._mousePos.x = e.clientX + (0, _scrollLeft.default)();
      this._mousePos.y = e.clientY + (0, _scrollTop.default)();

      if (!this._snaped) {
        // update the position of the component itself
        var offsetPos = (0, _offset.default)(this);
        this._pos = {
          x: offsetPos.left + this.offsetWidth * .5,
          y: offsetPos.top + this.offsetHeight * .5
        };
      }

      var distance = (0, _distanceBetween.default)(this._pos, this._mousePos);
      var smallestSize = this.offsetWidth < this.offsetHeight ? this.offsetWidth : this.offsetHeight;

      if (distance <= (this.props.snapDistance || smallestSize * .5) && !this._returnToHome) {
        this._snaped = true;
        var translateX = (this._pos.x - this._mousePos.x) * -1;
        var translateY = (this._pos.y - this._mousePos.y) * -1;

        if (this.props.maxTranslate) {
          var limit = (0, _circleConstrain.default)(this._pos, this.props.maxTranslate, this._mousePos);
          translateX = limit.x - this._pos.x;
          translateY = limit.y - this._pos.y;
        }

        (0, _animejs.default)({
          targets: this,
          translateX: translateX,
          translateY: translateY,
          duration: 100,
          easing: 'easeOutSine'
        });
      } else if (this._snaped) {
        this._snaped = false;
        this._returnToHome = true;
        (0, _animejs.default)({
          targets: this,
          translateX: 0,
          translateY: 0,
          easing: 'easeOutBack',
          duration: 200,
          complete: function complete() {
            _this._returnToHome = false;
          }
        });
      }
    }
  }], [{
    key: "defaultCss",

    /**
     * Css
     * @protected
     */
    value: function defaultCss(componentName, componentNameDash) {
      return "\n      ".concat(componentNameDash, " {\n        display : inline-block;\n      }\n    ");
    }
  }, {
    key: "defaultProps",

    /**
     * Default props
     * @definition    SWebComponent.defaultProps
     * @protected
     */
    get: function get() {
      return {
        /**
         * Specify the max translate distance.
         * @prop
         * @type    {Number}
         */
        maxTranslate: null,

        /**
         * Specify the distance of snaping
         * @prop
         * @type    {Number}
         */
        snapDistance: null
      };
    }
  }]);

  return SSpringSnapComponent;
}(_SWebComponent2.default);

exports.default = SSpringSnapComponent;