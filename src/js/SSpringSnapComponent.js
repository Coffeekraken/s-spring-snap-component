import SWebComponent from "coffeekraken-sugar/js/core/SWebComponent"
import addEventListener from "coffeekraken-sugar/js/dom/addEventListener"
import offset from "coffeekraken-sugar/js/dom/offset"
import scrollTop from "coffeekraken-sugar/js/dom/scrollTop"
import scrollLeft from "coffeekraken-sugar/js/dom/scrollLeft"
import anime from "animejs"
import throttle from "coffeekraken-sugar/js/utils/functions/throttle"
import distanceBetween from "coffeekraken-sugar/js/geom/2d/distanceBetween"
import circleConstrain from "coffeekraken-sugar/js/geom/2d/circleConstrain"

export default class SSpringSnapComponent extends SWebComponent {
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps() {
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
      snapDistance: 10,

      /**
       * Distance detection method. Can be "circular" or "square"
       * @prop
       * @type    {String}
       */
      distanceDetectionMethod: "square"
    }
  }

  /**
   * Css
   * @protected
   */
  static defaultCss(componentName, componentNameDash) {
    return `
      ${componentNameDash} {
        display : inline-block;
      }
    `
  }

  /**
   * Component will mount
   * @definition    SWebComponent.componentWillMount
   * @protected
   */
  componentWillMount() {
    super.componentWillMount()
    // internal variables
    this._mousePos = {
      x: 0,
      y: 0
    }
    // offset of this component
    const offsetPos = offset(this)
    this._pos = {
      x: offsetPos.left + this.offsetWidth * 0.5,
      y: offsetPos.top + this.offsetHeight * 0.5
    }
    // is snaped
    this._snaped = false
  }

  /**
   * Mount component
   * @definition    SWebComponent.componentMount
   * @protected
   */
  componentMount() {
    super.componentMount()

    // add mouse move handler
    this._mouseMoveRemoveListener = addEventListener(
      document,
      "mousemove",
      throttle(this._mouseMoveHandler, 50),
      this
    )
  }

  /**
   * Component unmount
   * @definition    SWebComponent.componentUnmount
   * @protected
   */
  componentUnmount() {
    super.componentUnmount()

    // remove event listeners
    if (this._mouseMoveRemoveListener) this._mouseMoveRemoveListener()
  }

  /**
   * Mouse move handler
   * @param    {MouseEvent}    The mouse event
   */
  _mouseMoveHandler(e) {
    // update mouse position
    this._mousePos.x = e.clientX + scrollLeft()
    this._mousePos.y = e.clientY + scrollTop()

    if (!this._snaped) {
      // update the position of the component itself
      const offsetPos = offset(this)
      this._pos = {
        x: offsetPos.left + this.offsetWidth * 0.5,
        y: offsetPos.top + this.offsetHeight * 0.5
      }
    }

    let needToSnap = false
    let distX
    let distY
    let distance

    switch (this.props.distanceDetectionMethod) {
      case "circular":
        distance = distanceBetween(this._pos, this._mousePos)
        needToSnap = distance <= this.props.snapDistance
        break
      case "square":
      default:
        if (this._mousePos.x < this._pos.x) {
          distX = this._pos.x - this.offsetWidth * 0.5 - this._mousePos.x
        } else {
          distX = this._mousePos.x - (this._pos.x + this.offsetWidth * 0.5)
        }
        if (this._mousePos.y < this._pos.y) {
          distY = this._pos.y - this.offsetHeight * 0.5 - this._mousePos.y
        } else {
          distY = this._mousePos.y - (this._pos.y + this.offsetHeight * 0.5)
        }
        needToSnap =
          distX <= this.props.snapDistance && distY <= this.props.snapDistance
        break
    }

    //

    // const smallestSize = (this.offsetWidth < this.offsetHeight) ? this.offsetWidth : this.offsetHeight

    if (needToSnap && !this._returnToHome) {
      this._snaped = true

      this.classList.add("snaped")

      let translateX = (this._pos.x - this._mousePos.x) * -1
      let translateY = (this._pos.y - this._mousePos.y) * -1
      if (this.props.maxTranslate) {
        const limit = circleConstrain(
          this._pos,
          this.props.maxTranslate,
          this._mousePos
        )
        translateX = limit.x - this._pos.x
        translateY = limit.y - this._pos.y
      }

      anime({
        targets: this,
        translateX,
        translateY,
        duration: 100,
        easing: "easeOutSine"
      })
    } else if (this._snaped) {
      this._snaped = false
      this._returnToHome = true
      this.classList.remove("snaped")
      anime({
        targets: this,
        translateX: 0,
        translateY: 0,
        easing: "easeOutBack",
        duration: 200,
        complete: () => {
          this._returnToHome = false
        }
      })
    }
  }
}
