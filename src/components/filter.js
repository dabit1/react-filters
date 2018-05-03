import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Filter extends Component {
  static propTypes = {
    className: PropTypes.string,
    inputClassName:  PropTypes.string,
    labelClassName:  PropTypes.string,
    value: PropTypes.string.isRequired,
    prefixId: PropTypes.string, /* controlled by Filters */
    suffixId: PropTypes.number, /* controlled by Filters */
    active: PropTypes.bool, /* controlled by Filters */
    disabled: PropTypes.bool, /* controlled by Filters */
    onChange: PropTypes.func /* controlled by Filters */
  }

  static defaultProps = {
    active: false,
    disabled: false
  }

  render () {
    const { suffixId, value, active, disabled, onChange, children, prefixId, className, inputClassName, labelClassName } = this.props

    return (
      <div className={className}>
        <input 
          className={inputClassName} 
          disabled={disabled} 
          id={`${prefixId}-${suffixId}`} 
          value={value} 
          checked={active} 
          onChange={() => onChange(!active)} 
          type='checkbox'
        />
        <label className={labelClassName} htmlFor={`${prefixId}-${suffixId}`}>
          { children }
        </label>
      </div>
    )
  }
}
