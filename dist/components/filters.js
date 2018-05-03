'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _filtersCategory = require('./filters-category');

var _filtersCategory2 = _interopRequireDefault(_filtersCategory);

var _filter = require('./filter');

var _filter2 = _interopRequireDefault(_filter);

var _filters = require('../helpers/filters');

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

var _lodash3 = require('lodash.isequal');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Filters = function (_Component) {
  _inherits(Filters, _Component);

  function Filters(props) {
    _classCallCheck(this, Filters);

    var _this = _possibleConstructorReturn(this, (Filters.__proto__ || Object.getPrototypeOf(Filters)).call(this, props));

    _this.filterValues = [];

    _this.state = {
      currentFilters: _this.props.currentFilters || [],
      itemsResult: _this.props.items,
      filtersWithNoResults: []
    };
    return _this;
  }

  _createClass(Filters, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.updateResults(this.props.currentFilters);
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      if (!(0, _lodash4.default)(this.props.items, prevProps.items) || !(0, _lodash4.default)(this.props.currentFilters, prevProps.currentFilters)) {
        this.updateResults(this.props.currentFilters);
      }
    }
  }, {
    key: 'isActive',
    value: function isActive(value) {
      return this.state.currentFilters.indexOf(value) !== -1;
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled(value) {
      return this.state.filtersWithNoResults.indexOf(value) !== -1;
    }
  }, {
    key: 'updateResults',
    value: function updateResults(currentFilters) {
      var itemsResult = (0, _filters.getItemsResult)(this.filterValues, currentFilters, this.props.items, this.props.getFiltersCallback, this.props.interaction);
      var filtersWithNoResults = (0, _filters.checkFiltersWithNoResults)(this.filterValues, currentFilters, itemsResult, this.props.getFiltersCallback, this.props.interaction);

      this.setState({
        currentFilters: currentFilters,
        itemsResult: itemsResult,
        filtersWithNoResults: filtersWithNoResults
      });

      this.props.onChangeFilter && this.props.onChangeFilter(currentFilters, itemsResult);
    }
  }, {
    key: 'removeSameCategoryFilters',
    value: function removeSameCategoryFilters(filters, filter) {
      var categoryFilters = this.filterValues.find(function (cat) {
        return cat.values.indexOf(filter) !== -1;
      }).values;
      return filters.filter(function (value) {
        return value === filter || categoryFilters.indexOf(value) === -1;
      });
    }
  }, {
    key: 'onChangeFilter',
    value: function onChangeFilter(value, active, isMultiple) {
      var currentFilters = active ? (0, _lodash2.default)([].concat(_toConsumableArray(this.state.currentFilters), [value])) : this.state.currentFilters.filter(function (filter) {
        return filter !== value;
      });

      this.updateResults(isMultiple ? currentFilters : this.removeSameCategoryFilters(currentFilters, value));
    }
  }, {
    key: 'editFilter',
    value: function editFilter(children, isMultiple) {
      var _this2 = this;

      return _react.Children.toArray(children).map(function (child) {
        if (child.type === _filter2.default) {
          _this2.filterValues[_this2.filterValues.length - 1].values.push(child.props.value);

          return _react2.default.cloneElement(child, {
            active: _this2.isActive(child.props.value),
            disabled: _this2.isDisabled(child.props.value),
            onChange: function onChange(active) {
              return _this2.onChangeFilter(child.props.value, active, isMultiple);
            },
            prefixId: _this2.props.prefixId,
            suffixId: ++_this2.suffixId
          });
        } else if (child.props && child.props.children) {
          return _react2.default.cloneElement(child, {
            children: _this2.editFilter(child.props.children, isMultiple)
          });
        }

        return child;
      });
    }
  }, {
    key: 'renderChildren',
    value: function renderChildren() {
      var _this3 = this;

      var children = this.props.children;


      this.filterValues = [];
      this.suffixId = 0;
      var childrenArray = _react.Children.toArray(children).map(function (filtersCategory, categoryIndex) {
        if (filtersCategory.type === _filtersCategory2.default) {
          _this3.filterValues.push({ category: 'cat' + categoryIndex, values: [], interaction: filtersCategory.props.interaction });

          return _react2.default.cloneElement(filtersCategory, {
            children: _this3.editFilter(filtersCategory.props.children, filtersCategory.props.multiple)
          });
        }

        return filtersCategory;
      });

      return childrenArray;
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: this.props.className },
        this.renderChildren()
      );
    }
  }]);

  return Filters;
}(_react.Component);

Filters.propTypes = {
  className: _propTypes2.default.string,
  children: _propTypes2.default.oneOfType([_propTypes2.default.arrayOf(_propTypes2.default.shape({ type: _propTypes2.default.oneOf([_filtersCategory2.default]) })), _propTypes2.default.shape({ type: _propTypes2.default.oneOf([_filtersCategory2.default]) })]).isRequired,
  interaction: _propTypes2.default.oneOf(['inclusive', 'exclusive']),
  currentFilters: _propTypes2.default.array,
  onChangeFilter: _propTypes2.default.func,
  prefixId: _propTypes2.default.string,
  items: _propTypes2.default.array.isRequired,
  getFiltersCallback: _propTypes2.default.func.isRequired
};
Filters.defaultProps = {
  prefixId: 'react-filter',
  interaction: 'exclusive',
  currentFilters: []
};
exports.default = Filters;
module.exports = exports['default'];