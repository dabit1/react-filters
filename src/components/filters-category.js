import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class FiltersCategory extends Component {
  static propTypes = {
    className: PropTypes.string,
    interaction: PropTypes.oneOf(['inclusive', 'exclusive']),
    multiple: PropTypes.bool
  }

  static defaultProps = {
    multiple: true,
    interaction: 'inclusive'
  }

  render () {
    const { children, className } = this.props

    return (
      <div className={className}>
        { children }
      </div>
    )
  }
}
