import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import FiltersCategory from './filters-category'
import Filter from './filter'
import { getItemsResult, checkFiltersWithNoResults } from '../helpers/filters'
import uniq from 'lodash.uniq'
import isEqual from 'lodash.isequal'

export default class Filters extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.oneOf([FiltersCategory]) })),
      PropTypes.shape({ type: PropTypes.oneOf([FiltersCategory]) })
    ]).isRequired,
    interaction: PropTypes.oneOf(['inclusive', 'exclusive']),
    currentFilters: PropTypes.array,
    onChangeFilter: PropTypes.func,
    prefixId: PropTypes.string,
    items: PropTypes.array.isRequired,
    getFiltersCallback: PropTypes.func.isRequired
  }
  
  static defaultProps = {
    prefixId: 'react-filter',
    interaction: 'exclusive',
    currentFilters: [],
  }

  constructor (props) {
    super(props)

    this.filterValues = []

    this.state = {
      currentFilters: this.props.currentFilters || [],
      itemsResult: this.props.items,
      filtersWithNoResults: []
    }
  }

  componentDidMount () {
    this.updateResults(this.props.currentFilters)
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(this.props.items, prevProps.items) || !isEqual(this.props.currentFilters, prevProps.currentFilters)) {
      this.updateResults(this.props.currentFilters)
    }
  }

  isActive (value) {
    return this.state.currentFilters.indexOf(value) !== -1
  }

  isDisabled (value) {
    return this.state.filtersWithNoResults.indexOf(value) !== -1
  }

  updateResults (currentFilters) {
    const itemsResult = getItemsResult(this.filterValues, currentFilters, this.props.items, this.props.getFiltersCallback, this.props.interaction)
    const filtersWithNoResults = checkFiltersWithNoResults(this.filterValues, currentFilters, itemsResult, this.props.getFiltersCallback, this.props.interaction)

    this.setState({
      currentFilters,
      itemsResult,
      filtersWithNoResults
    })

    this.props.onChangeFilter && this.props.onChangeFilter(currentFilters, itemsResult)
  }

  removeSameCategoryFilters (filters, filter) {
    const categoryFilters = this.filterValues.find(cat => cat.values.indexOf(filter) !== -1).values
    return filters.filter(value => value === filter || categoryFilters.indexOf(value) === -1)
  }

  onChangeFilter (value, active, isMultiple) {
    const currentFilters = active ? uniq([...this.state.currentFilters, value]) :
                           this.state.currentFilters.filter(filter => filter !== value)

    this.updateResults(isMultiple ? currentFilters : this.removeSameCategoryFilters(currentFilters, value))
  }

  editFilter (children, isMultiple) {
    return Children.toArray(children).map(child => {
      if (child.type === Filter) {
        this.filterValues[this.filterValues.length - 1].values.push(child.props.value)

        return React.cloneElement(child, {
          active: this.isActive(child.props.value),
          disabled: this.isDisabled(child.props.value),
          onChange: active => this.onChangeFilter(child.props.value, active, isMultiple),
          prefixId: this.props.prefixId,
          suffixId: ++this.suffixId
        })
      } else if (child.props && child.props.children) {
        return React.cloneElement(child, {
          children: this.editFilter(child.props.children, isMultiple)
        })
      }

      return child
    })
  }

  renderChildren () {
    const { children } = this.props

    this.filterValues = []
    this.suffixId = 0
    const childrenArray = Children.toArray(children).map((filtersCategory, categoryIndex) => {
      if (filtersCategory.type === FiltersCategory) {
        this.filterValues.push({category: `cat${categoryIndex}`, values: [], interaction: filtersCategory.props.interaction} )

        return React.cloneElement(filtersCategory, {
          children: this.editFilter(filtersCategory.props.children, filtersCategory.props.multiple)
        })
      }

      return filtersCategory
    })

    return childrenArray
  }

  render () {
    return (
      <div className={this.props.className}>
        { this.renderChildren() }
      </div>
    )
  }
}
