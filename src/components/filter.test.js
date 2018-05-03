import React from 'react'
import { shallow, mount } from 'enzyme'
import Filter from './filter'

describe('Filter component suite', () => {
  const mockOnChange = jest.fn()
  const wrapper = shallow(<Filter onChange={mockOnChange} value={'foo'} />)
  const mountedWrapper = mount(<Filter onChange={mockOnChange} value={'foo'} />)

  it('should mount in a full DOM', () => {
    expect(mountedWrapper.find(Filter)).toHaveLength(1)
  })

  it('should have a prop with the value', () => {
    expect(wrapper.instance().props.value).toEqual('foo')
  })

  it('should render a checkbox inside of him', () => {
    expect(wrapper.find('input[type="checkbox"]')).toHaveLength(1)
  })

  it('should render children if it are passed', () => {
    const wrapper = shallow((
      <Filter value='foo'>
        <div id='i-am-a-child' />
        <span id='i-am-a-another-child' />
      </Filter>
    ))
    expect(wrapper.find('#i-am-a-child')).toBeTruthy()
    expect(wrapper.find('#i-am-a-another-child')).toBeTruthy()
  })

  it('should call a method prop when the checkbox is changed', () => {
    mountedWrapper.find('input[type="checkbox"]').simulate('change')
    expect(mockOnChange).toHaveBeenCalledTimes(1)
    expect(mockOnChange).toHaveBeenCalledWith(true)
  })
})
