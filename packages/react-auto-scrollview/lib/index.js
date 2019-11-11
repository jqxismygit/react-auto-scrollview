"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var useMeasureChildren = function useMeasureChildren(count) {
  var measureResults = [];

  var _loop = function _loop(i) {
    var _React$useState = _react.default.useState({}),
        _React$useState2 = _slicedToArray(_React$useState, 2),
        rect = _React$useState2[0],
        setRect = _React$useState2[1];

    var _React$useState3 = _react.default.useState(null),
        _React$useState4 = _slicedToArray(_React$useState3, 2),
        node = _React$useState4[0],
        setNode = _React$useState4[1];

    var measureRef = _react.default.useCallback(function (node) {
      if (node !== null) {
        setRect(node.getBoundingClientRect());
        setNode(node);
      }
    }, []);

    measureResults[i] = {
      node: node,
      rect: rect,
      measureRef: measureRef
    };
  };

  for (var i = 0; i < count; ++i) {
    _loop(i);
  }

  return measureResults;
}; //获取所有的子节点高度


var getChildrenHeight = function getChildrenHeight(measureResult) {
  return measureResult.reduce(function (prev, _ref) {
    var rect = _ref.rect;
    return rect.height + prev;
  }, 0);
}; //获取第一个子节点到指定子节点的高度


var getFrontItemHeight = function getFrontItemHeight(measureResult, index) {
  return measureResult.reduce(function (prev, _ref2, idx) {
    var rect = _ref2.rect;
    return idx <= index ? rect.height + prev : prev;
  }, 0);
};

var defaultSpeed = 4;
var defaultFPS = 30;

var AutoScrollView = function AutoScrollView(props) {
  var children = props.children,
      className = props.className,
      height = props.height,
      speed = props.speed,
      fps = props.fps;
  var measureResults = useMeasureChildren(children.length);

  _react.default.useEffect(function () {
    var globalOffsetY = 0;
    var offsetY = Array.from({
      length: children.length
    }).map(function () {
      return 0;
    });
    var childrenHeight = getChildrenHeight(measureResults);
    var handle;

    if (height < childrenHeight) {
      handle = setInterval(function () {
        globalOffsetY -= 0.1 * (speed || defaultSpeed); //此处是一个优化操作，取余也行

        if (globalOffsetY < -childrenHeight) {
          globalOffsetY += childrenHeight;
          offsetY = offsetY.map(function () {
            return 0;
          });
        }

        measureResults && measureResults.forEach(function (_ref3, idx) {
          var node = _ref3.node;

          if (node) {
            if (globalOffsetY + offsetY[idx] <= -getFrontItemHeight(measureResults, idx)) {
              offsetY[idx] = childrenHeight;
            }

            node.style.transform = "translateY(".concat(globalOffsetY + offsetY[idx], "px)");
          }
        });
      }, 1000 / (fps || defaultFPS));
    }

    return function () {
      handle && clearInterval(handle);
    };
  }, [measureResults]);

  return _react.default.createElement("div", {
    className: className,
    style: {
      height: "".concat(height, "px"),
      overflowY: "hidden"
    }
  }, _react.default.Children.map(children, function (child, idx) {
    return _react.default.createElement("div", {
      ref: measureResults[idx].measureRef
    }, child);
  }));
};

var _default = AutoScrollView;
exports.default = _default;