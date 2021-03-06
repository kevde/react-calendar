'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactLifecyclesCompat = require('react-lifecycles-compat');

var _reactLifecyclesCompat2 = _interopRequireDefault(_reactLifecyclesCompat);

var _mergeClassNames = require('merge-class-names');

var _mergeClassNames2 = _interopRequireDefault(_mergeClassNames);

var _Navigation = require('./Calendar/Navigation');

var _Navigation2 = _interopRequireDefault(_Navigation);

var _CenturyView = require('./CenturyView');

var _CenturyView2 = _interopRequireDefault(_CenturyView);

var _DecadeView = require('./DecadeView');

var _DecadeView2 = _interopRequireDefault(_DecadeView);

var _YearView = require('./YearView');

var _YearView2 = _interopRequireDefault(_YearView);

var _MonthView = require('./MonthView');

var _MonthView2 = _interopRequireDefault(_MonthView);

var _dates = require('./shared/dates');

var _propTypes3 = require('./shared/propTypes');

var _utils = require('./shared/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var allViews = ['century', 'decade', 'year', 'month'];
var allValueTypes = [].concat(_toConsumableArray(allViews.slice(1)), ['day']);

var datesAreDifferent = function datesAreDifferent(date1, date2) {
  return date1 && !date2 || !date1 && date2 || date1 && date2 && date1.getTime() !== date2.getTime();
};

/**
 * Returns views array with disallowed values cut off.
 */
var getLimitedViews = function getLimitedViews(minDetail, maxDetail) {
  return allViews.slice(allViews.indexOf(minDetail), allViews.indexOf(maxDetail) + 1);
};

var getView = function getView(view, minDetail, maxDetail) {
  if (view && getLimitedViews(minDetail, maxDetail).indexOf(view) !== -1) {
    return view;
  }

  return getLimitedViews(minDetail, maxDetail).pop();
};

/**
 * Determines whether a given view is allowed with currently applied settings.
 */
var isViewAllowed = function isViewAllowed(view, minDetail, maxDetail) {
  var views = getLimitedViews(minDetail, maxDetail);

  return views.indexOf(view) !== -1;
};

/**
 * Returns value type that can be returned with currently applied settings.
 */
var getValueType = function getValueType(maxDetail) {
  return allValueTypes[allViews.indexOf(maxDetail)];
};

var getValueFrom = function getValueFrom(value, minDate, maxDate, maxDetail) {
  if (!value) {
    return null;
  }

  var rawValueFrom = value instanceof Array && value.length === 2 ? value[0] : value;

  if (!rawValueFrom) {
    return null;
  }

  var valueFromDate = new Date(rawValueFrom);

  if (isNaN(valueFromDate.getTime())) {
    throw new Error('Invalid date:$ {value}');
  }

  var valueFrom = (0, _dates.getBegin)(getValueType(maxDetail), valueFromDate);

  return (0, _utils.between)(valueFrom, minDate, maxDate);
};

var getValueTo = function getValueTo(value, minDate, maxDate, maxDetail) {
  if (!value) {
    return null;
  }

  var rawValueTo = value instanceof Array && value.length === 2 ? value[1] : value;

  if (!rawValueTo) {
    return null;
  }

  var valueToDate = new Date(rawValueTo);

  if (isNaN(valueToDate.getTime())) {
    throw new Error('Invalid date: ' + value);
  }

  var valueTo = (0, _dates.getEnd)(getValueType(maxDetail), valueToDate);

  return (0, _utils.between)(valueTo, minDate, maxDate);
};

var getValueArray = function getValueArray(value, minDate, maxDate, maxDetail) {
  if (value instanceof Array) {
    return value;
  }

  return [getValueFrom(value, minDate, maxDate, maxDetail), getValueTo(value, minDate, maxDate, maxDetail)];
};

var getActiveStartDate = function getActiveStartDate(props) {
  var rangeType = getView(props.view, props.minDetail, props.maxDetail);
  var valueFrom = getValueFrom(props.value, props.minDate, props.maxDate, props.maxDetail) || props.activeStartDate || new Date();
  return (0, _dates.getBegin)(rangeType, valueFrom);
};

var Calendar = function (_Component) {
  _inherits(Calendar, _Component);

  function Calendar() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Calendar);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Calendar.__proto__ || Object.getPrototypeOf(Calendar)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this.setActiveStartDate = function (activeStartDate) {
      _this.setState({ activeStartDate: activeStartDate }, function () {
        return (0, _utils.callIfDefined)(_this.props.onActiveDateChange, {
          activeStartDate: activeStartDate,
          view: _this.state.view
        });
      });
    }, _this.drillDown = function (activeStartDate) {
      if (!_this.drillDownAvailable) {
        return;
      }

      var views = getLimitedViews(_this.props.minDetail, _this.props.maxDetail);

      _this.setState(function (prevState) {
        var nextView = views[views.indexOf(prevState.view) + 1];
        return {
          activeStartDate: activeStartDate,
          view: nextView
        };
      }, function () {
        return (0, _utils.callIfDefined)(_this.props.onDrillDown, {
          activeStartDate: activeStartDate,
          view: _this.state.view
        });
      });
    }, _this.drillUp = function () {
      if (!_this.drillUpAvailable) {
        return;
      }

      var views = getLimitedViews(_this.props.minDetail, _this.props.maxDetail);

      _this.setState(function (prevState) {
        var nextView = views[views.indexOf(prevState.view) - 1];
        var activeStartDate = (0, _dates.getBegin)(nextView, prevState.activeStartDate);

        return {
          activeStartDate: activeStartDate,
          view: nextView
        };
      }, function () {
        return (0, _utils.callIfDefined)(_this.props.onDrillUp, {
          activeStartDate: _this.state.activeStartDate,
          view: _this.state.view
        });
      });
    }, _this.onChange = function (value) {
      var _this$props = _this.props,
          onChange = _this$props.onChange,
          selectRange = _this$props.selectRange;


      var nextValue = void 0;
      var callback = void 0;
      if (selectRange) {
        var previousValue = _this.state.value;
        // Range selection turned on

        if (!previousValue || [].concat(previousValue).length !== 1 // 0 or 2 - either way we're starting a new array
        ) {
            // First value
            nextValue = (0, _dates.getBegin)(_this.valueType, value);
          } else {
          // Second value
          nextValue = (0, _dates.getValueRange)(_this.valueType, previousValue, value);
          callback = (0, _utils.callIfDefined)(onChange, nextValue);
        }
      } else {
        // Range selection turned off
        nextValue = _this.getProcessedValue(value);
        callback = (0, _utils.callIfDefined)(onChange, nextValue);
      }

      _this.setState({ value: nextValue }, callback);
    }, _this.onMouseOver = function (value) {
      _this.setState({ hover: value });
    }, _this.onMouseOut = function () {
      _this.setState({ hover: null });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Calendar, [{
    key: 'getProcessedValue',


    /**
     * Gets current value in a desired format.
     */
    value: function getProcessedValue(value) {
      var _props = this.props,
          minDate = _props.minDate,
          maxDate = _props.maxDate,
          maxDetail = _props.maxDetail,
          returnValue = _props.returnValue;


      switch (returnValue) {
        case 'start':
          return getValueFrom(value, minDate, maxDate, maxDetail);
        case 'end':
          return getValueTo(value, minDate, maxDate, maxDetail);
        case 'range':
          return getValueArray(value, minDate, maxDate, maxDetail);
        default:
          throw new Error('Invalid returnValue.');
      }
    }
  }, {
    key: 'renderContent',
    value: function renderContent() {
      var _props2 = this.props,
          calendarType = _props2.calendarType,
          locale = _props2.locale,
          maxDate = _props2.maxDate,
          minDate = _props2.minDate,
          renderChildren = _props2.renderChildren,
          tileClassName = _props2.tileClassName,
          tileContent = _props2.tileContent,
          tileDisabled = _props2.tileDisabled;
      var _state = this.state,
          activeStartDate = _state.activeStartDate,
          hover = _state.hover,
          value = _state.value;
      var onMouseOver = this.onMouseOver,
          valueType = this.valueType;

      var view = this.state.view || this.props.view;
      var commonProps = {
        activeStartDate: activeStartDate,
        hover: hover,
        locale: locale,
        maxDate: maxDate,
        minDate: minDate,
        onMouseOver: this.props.selectRange ? onMouseOver : null,
        tileClassName: tileClassName,
        tileContent: tileContent || renderChildren, // For backwards compatibility
        tileDisabled: tileDisabled,
        value: value,
        valueType: valueType
      };

      var clickAction = this.drillDownAvailable ? this.drillDown : this.onChange;

      switch (view) {
        case 'century':
          return _react2.default.createElement(_CenturyView2.default, _extends({
            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickDecade)
          }, commonProps));
        case 'decade':
          return _react2.default.createElement(_DecadeView2.default, _extends({
            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickYear)
          }, commonProps));
        case 'year':
          return _react2.default.createElement(_YearView2.default, _extends({
            formatMonth: this.props.formatMonth,
            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickMonth)
          }, commonProps));
        case 'month':
          return _react2.default.createElement(_MonthView2.default, _extends({
            calendarType: calendarType,
            formatShortWeekday: this.props.formatShortWeekday,
            onClick: (0, _utils.mergeFunctions)(clickAction, this.props.onClickDay),
            onClickWeekNumber: this.props.onClickWeekNumber,
            showNeighboringMonth: this.props.showNeighboringMonth,
            showWeekNumbers: this.props.showWeekNumbers
          }, commonProps));
        default:
          throw new Error('Invalid view: ' + view + '.');
      }
    }
  }, {
    key: 'renderNavigation',
    value: function renderNavigation() {
      var showNavigation = this.props.showNavigation;


      if (!showNavigation) {
        return null;
      }

      return _react2.default.createElement(_Navigation2.default, {
        activeRange: this.state.activeRange,
        activeStartDate: this.state.activeStartDate,
        drillUp: this.drillUp,
        formatMonthYear: this.props.formatMonthYear,
        locale: this.props.locale,
        maxDate: this.props.maxDate,
        minDate: this.props.minDate,
        next2Label: this.props.next2Label,
        nextLabel: this.props.nextLabel,
        navigationLabel: this.props.navigationLabel,
        prev2Label: this.props.prev2Label,
        prevLabel: this.props.prevLabel,
        setActiveStartDate: this.setActiveStartDate,
        view: this.state.view,
        views: getLimitedViews(this.props.minDetail, this.props.maxDetail)
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          className = _props3.className,
          selectRange = _props3.selectRange;
      var value = this.state.value;
      var onMouseOut = this.onMouseOut;

      var valueArray = [].concat(value);

      return _react2.default.createElement(
        'div',
        {
          className: (0, _mergeClassNames2.default)('react-calendar', selectRange && valueArray.length === 1 && 'react-calendar--selectRange', className),
          onMouseOut: selectRange ? onMouseOut : null,
          onBlur: selectRange ? onMouseOut : null
        },
        this.renderNavigation(),
        this.renderContent()
      );
    }
  }, {
    key: 'drillDownAvailable',
    get: function get() {
      var views = getLimitedViews(this.props.minDetail, this.props.maxDetail);

      return views.indexOf(this.state.view) < views.length - 1;
    }
  }, {
    key: 'drillUpAvailable',
    get: function get() {
      var views = getLimitedViews(this.props.minDetail, this.props.maxDetail);

      return views.indexOf(this.state.view) > 0;
    }
  }, {
    key: 'valueType',
    get: function get() {
      return getValueType(this.props.maxDetail);
    }
  }], [{
    key: 'getDerivedStateFromProps',
    value: function getDerivedStateFromProps(nextProps, prevState) {
      var minDate = nextProps.minDate,
          maxDate = nextProps.maxDate,
          minDetail = nextProps.minDetail,
          maxDetail = nextProps.maxDetail;


      var nextState = {
        activeStartDate: getActiveStartDate(nextProps)
      };

      /**
       * If the next view is different from the current one, and the previously set view is not
       * valid based on minDetail and maxDetail, get a new one.
       */
      var nextView = getView(nextProps.view, minDetail, maxDetail);
      if (nextView !== prevState.view && !isViewAllowed(prevState.view, minDetail, maxDetail)) {
        nextState.view = nextView;
      }

      /**
       * If the next value is different from the current one  (with an exception of situation in
       * which values provided are limited by minDate and maxDate so that the dates are the same),
       * get a new one.
       */
      var values = [nextProps.value, prevState.value];
      if (nextState.view || // Allowed view changed
      datesAreDifferent.apply(undefined, _toConsumableArray(values.map(function (value) {
        return getValueFrom(value, minDate, maxDate, maxDetail);
      }))) || datesAreDifferent.apply(undefined, _toConsumableArray(values.map(function (value) {
        return getValueTo(value, minDate, maxDate, maxDetail);
      })))) {
        nextState.value = nextProps.value;
      }

      if (!nextProps.selectRange && prevState.hover) {
        nextState.hover = null;
      }

      return nextState;
    }

    /**
     * Called when the user uses navigation buttons.
     */

  }]);

  return Calendar;
}(_react.Component);

exports.default = Calendar;


Calendar.defaultProps = {
  maxDetail: 'month',
  minDetail: 'century',
  returnValue: 'start',
  showNavigation: true,
  showNeighboringMonth: true,
  view: 'month'
};

Calendar.propTypes = {
  activeStartDate: _propTypes2.default.instanceOf(Date),
  calendarType: _propTypes3.isCalendarType,
  className: _propTypes3.isClassName,
  formatMonth: _propTypes2.default.func,
  formatMonthYear: _propTypes2.default.func,
  formatShortWeekday: _propTypes2.default.func,
  locale: _propTypes2.default.string,
  maxDate: _propTypes3.isMaxDate,
  maxDetail: _propTypes2.default.oneOf(allViews),
  minDate: _propTypes3.isMinDate,
  minDetail: _propTypes2.default.oneOf(allViews),
  navigationLabel: _propTypes2.default.func,
  next2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  nextLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  onActiveDateChange: _propTypes2.default.func,
  onChange: _propTypes2.default.func,
  onClickDay: _propTypes2.default.func,
  onClickDecade: _propTypes2.default.func,
  onClickMonth: _propTypes2.default.func,
  onClickWeekNumber: _propTypes2.default.func,
  onClickYear: _propTypes2.default.func,
  onDrillDown: _propTypes2.default.func,
  onDrillUp: _propTypes2.default.func,
  prev2Label: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  prevLabel: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.node]),
  renderChildren: _propTypes2.default.func, // For backwards compatibility
  returnValue: _propTypes2.default.oneOf(['start', 'end', 'range']),
  selectRange: _propTypes2.default.bool,
  showNavigation: _propTypes2.default.bool,
  showNeighboringMonth: _propTypes2.default.bool,
  showWeekNumbers: _propTypes2.default.bool,
  tileClassName: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes3.isClassName]),
  tileContent: _propTypes2.default.oneOfType([_propTypes2.default.func, _propTypes2.default.node]),
  tileDisabled: _propTypes2.default.func,
  value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes3.isValue]),
  view: _propTypes2.default.oneOf(allViews)
};

if (_reactLifecyclesCompat2.default) {
  (0, _reactLifecyclesCompat2.default)(Calendar);
}