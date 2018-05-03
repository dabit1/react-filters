'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFiltersWithNoResults = exports.getItemsResult = undefined;

var _lodash = require('lodash.uniq');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var mapFiltersToAddCategory = function mapFiltersToAddCategory(filterValues, currentFilters) {
  var filtersWithCategory = {};

  currentFilters.forEach(function (filter) {
    var filters = filterValues.find(function (value) {
      return value.values.indexOf(filter) !== -1;
    });
    if (filters) {
      !filtersWithCategory[filters.category] && (filtersWithCategory[filters.category] = { interactionBetweenValues: filters.interaction, values: [filter] }) || filtersWithCategory[filters.category].values.push(filter);
    }
  });
  return filtersWithCategory;
};

var matchFilter = function matchFilter(itemFilters, currentFiltersWithCategory, interactionBetweenCategories) {
  var foundCategory = false;
  for (var category in currentFiltersWithCategory) {
    var foundFilter = false;

    for (var i = 0, l = currentFiltersWithCategory[category].values.length; i < l; i++) {
      if (currentFiltersWithCategory[category].interactionBetweenValues === 'exclusive' && itemFilters.indexOf(currentFiltersWithCategory[category].values[i]) === -1) {
        return false;
      } else if (itemFilters.indexOf(currentFiltersWithCategory[category].values[i]) !== -1) {
        foundFilter = true;
      }
    }

    if (interactionBetweenCategories === 'exclusive' && !foundFilter) {
      return false;
    } else if (foundFilter) {
      foundCategory = true;
    }
  }

  if (interactionBetweenCategories === 'inclusive' && !foundCategory) {
    return false;
  }

  return true;
};

var getItemsResult = function getItemsResult(filterValues, currentFilters, items, getFiltersCallback, interactionBetweenCategories) {
  if (currentFilters.length) {
    var currentFiltersWithCategory = mapFiltersToAddCategory(filterValues, currentFilters);

    return items.filter(function (item) {
      var itemFilters = getFiltersCallback(item);

      return matchFilter(Array.isArray(itemFilters) ? itemFilters : [itemFilters], currentFiltersWithCategory, interactionBetweenCategories);
    });
  }

  return items;
};

var checkFiltersWithNoResults = function checkFiltersWithNoResults(filterValues, currentFilters, items, getFiltersCallback, interactionBetweenCategories) {
  var filtersWithNoResults = [];

  filterValues.forEach(function (filters, category) {
    filtersWithNoResults = [].concat(_toConsumableArray(filtersWithNoResults), _toConsumableArray(filters.values.filter(function (filter) {
      var results = getItemsResult(filterValues, (0, _lodash2.default)([].concat(_toConsumableArray(currentFilters), [filter])), items, getFiltersCallback, interactionBetweenCategories);
      return results.length === 0 || results.find(function (item) {
        var itemFilters = getFiltersCallback(item);
        return Array.isArray(itemFilters) ? itemFilters.indexOf(filter) !== -1 : itemFilters === filter;
      }) === undefined;
    })));
  });

  return filtersWithNoResults;
};

exports.getItemsResult = getItemsResult;
exports.checkFiltersWithNoResults = checkFiltersWithNoResults;