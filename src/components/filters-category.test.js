import React from 'react'
import { shallow, mount } from 'enzyme'
import FiltersCategory from './filters-category'
import Filter from './filter'

describe('FiltersCategory component suite', () => {
  const wrapper = shallow((
    <FiltersCategory>
      <Filter value='1' />
      <Filter value='2' />
    </FiltersCategory>
  ))

  it('should mount in a full DOM', () => {
    expect(mount((
      <FiltersCategory>
        <Filter value='1' />
        <Filter value='2' />
      </FiltersCategory>
    )).find(FiltersCategory)).toHaveLength(1)
  })

  it('should render filters', () => {
    expect(wrapper.find(Filter)).toHaveLength(2)
  })
})
