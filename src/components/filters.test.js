import React from 'react'
import { shallow, mount } from 'enzyme'
import Filters from './filters'
import FiltersCategory from './filters-category'
import Filter from './filter'

describe('Filters component suite', () => {
  const items = [
    { name: 'David', tags: ['1', '2'] },
    { name: 'Mark', tags: ['1', '3'] },
    { name: 'Johnson', tags: ['2'] }
  ]

  const getFiltersCallback = item => item.tags

  const getWrapper = (toMount = false, currentFilters = ['1', '3']) => {
    const element = (
      <Filters items={items} getFiltersCallback={getFiltersCallback} currentFilters={currentFilters} interaction='exclusive'>
        <FiltersCategory interaction='inclusive'>
          <div>
            <div>
              <span>test</span>
              <Filter value='1' />
              <Filter value='2' />
            </div>
          </div>
        </FiltersCategory>
        <FiltersCategory interaction='inclusive'>
          <Filter value='3' />
          <Filter value='4' />
        </FiltersCategory>
      </Filters>
    )

    return toMount ? mount(element) : shallow(element)
  }

  it('should mount in a full DOM', () => {
    expect(getWrapper(true).find(Filters)).toHaveLength(1)
  })

  it('should have an array var with the filter values', () => {
    expect(getWrapper().instance().filterValues).toEqual([
      {category: 'cat0', values: ['1', '2'], interaction: 'inclusive'},
      {category: 'cat1', values: ['3', '4'], interaction: 'inclusive'}
    ])
  })

  it('should have an array state with the current filters', () => {
    expect(getWrapper().state().currentFilters).toEqual(['1', '3'])
  })

  it('should have an array state with the items result', () => {
    expect(getWrapper().state().itemsResult).toEqual([
      { name: 'Mark', tags: ['1', '3'] }
    ])
  })

  it('should render FiltersCategory items when passed in', () => {
    expect(getWrapper().find(FiltersCategory)).toHaveLength(2)
  })

  it('should render Filter items when passed in', () => {
    expect(getWrapper().find(Filter)).toHaveLength(4)
  })

  // small integration testing
  it('should have a method which is called when a filter is changed', () => {
    const itemIndex = 1
    const wrapper = getWrapper(true)

    wrapper.instance().onChangeFilter = jest.fn()
    const filter = wrapper.find(Filter).at(itemIndex)
    filter.find('input[type="checkbox"]').simulate('change')
    expect(wrapper.instance().onChangeFilter).toHaveBeenCalledTimes(1)
    expect(wrapper.instance().onChangeFilter).toHaveBeenCalledWith(filter.props().value, true, true)
  })

  it('should have a prop method which is called when a filter is changed with the currentFilters and the itemResults', () => {
    const wrapper = getWrapper(true)

    wrapper.setProps({onChangeFilter: jest.fn()})
    const filter = wrapper.find(Filter).at(0)
    filter.find('input[type="checkbox"]').simulate('change')

    expect(wrapper.props().onChangeFilter).toHaveBeenCalledTimes(1)
    expect(wrapper.props().onChangeFilter).toHaveBeenCalledWith(wrapper.state().currentFilters, wrapper.state().itemsResult)
  })

  it('should add a filter without removing the last one', () => {
    const wrapper = getWrapper(true)
    const filter = wrapper.find(Filter).at(1)
    filter.find('input[type="checkbox"]').simulate('change')
    expect(wrapper.state().currentFilters).toEqual(['1', '3', '2'])
  })

  it('should remove filter', () => {
    const wrapper = getWrapper(true)
    const filter = wrapper.find(Filter).at(0)
    filter.find('input[type="checkbox"]').simulate('change')
    expect(wrapper.state().currentFilters).toEqual(['3'])
  })

  it('should filter the items after add a filter', () => {
    const wrapper = getWrapper(true, [])
    const filter = wrapper.find(Filter).at(1)
    filter.find('input[type="checkbox"]').simulate('change')

    expect(wrapper.state().itemsResult).toEqual([
      { name: 'David', tags: ['1', '2'] },
      { name: 'Johnson', tags: ['2'] }
    ])
  })

  it('should go back to the previous list after remove a filter', () => {
    const wrapper = getWrapper(true, [])
    const filter = wrapper.find(Filter).at(1)

    filter.find('input[type="checkbox"]').simulate('change')
    expect(wrapper.state().itemsResult).toEqual([
      { name: 'David', tags: ['1', '2'] },
      { name: 'Johnson', tags: ['2'] }
    ])

    filter.find('input[type="checkbox"]').simulate('change')
    expect(wrapper.state().itemsResult).toEqual([
      { name: 'David', tags: ['1', '2'] },
      { name: 'Mark', tags: ['1', '3'] },
      { name: 'Johnson', tags: ['2'] }
    ])
  })

  it('should include when filters have same category', () => {
    const wrapper = getWrapper(true, [])
    wrapper.find(Filter).at(0).find('input[type="checkbox"]').simulate('change') // '1' filter value, category 1
    wrapper.find(Filter).at(1).find('input[type="checkbox"]').simulate('change') // '2' filter value, category 1

    expect(wrapper.state().itemsResult.length).toBeGreaterThan(0)
    expect(wrapper.state().itemsResult.filter(item => {
      return getFiltersCallback(item).indexOf('1') !== -1 || getFiltersCallback(item).indexOf('2') !== -1
    })).toHaveLength(wrapper.state().itemsResult.length)
  })

  it('should exclude when filters have different category', () => {
    const wrapper = getWrapper(true, [])
    wrapper.find(Filter).at(0).find('input[type="checkbox"]').simulate('change') // '1' filter value, category 1
    wrapper.find(Filter).at(2).find('input[type="checkbox"]').simulate('change') // '3' filter value, category 2

    expect(wrapper.state().itemsResult.length).toBeGreaterThan(0)
    expect(wrapper.state().itemsResult.filter(item => {
      return getFiltersCallback(item).indexOf('1') !== -1 && getFiltersCallback(item).indexOf('3') !== -1
    })).toHaveLength(wrapper.state().itemsResult.length)
  })

  it('should exclude when filters have different category and include when filters have same category', () => {
    const wrapper = getWrapper(false, ['1', '2', '3'])

    expect(wrapper.state().itemsResult).toEqual([
      { name: 'Mark', tags: ['1', '3'] }
    ])
  })

  it('should have a list with the filters that has no results in case of be selected', () => {
    const wrapper = getWrapper(true, [])
    wrapper.find(Filter).at(0).find('input[type="checkbox"]').simulate('change') // '1' filter value, category 1
    wrapper.find(Filter).at(2).find('input[type="checkbox"]').simulate('change') // '3' filter value, category 2

    expect(wrapper.state().filtersWithNoResults).toEqual(['2', '4'])
  })

  it('should filter categories as inclusive and values as exclusive', () => {
    const wrapper = shallow(
      <Filters items={items} getFiltersCallback={getFiltersCallback} currentFilters={['1', '2']} interaction='inclusive'>
        <FiltersCategory interaction='exclusive'>
          <Filter value='1' />
          <Filter value='2' />
        </FiltersCategory>
        <FiltersCategory interaction='exclusive'>
          <Filter value='3' />
          <Filter value='4' />
        </FiltersCategory>
      </Filters>
    )
    expect(wrapper.state().itemsResult).toEqual([
      { name: 'David', tags: ['1', '2'] }
    ])
  })

  it('should filter categories as inclusive and values as inclusive', () => {
    const wrapper = shallow(
      <Filters items={items} getFiltersCallback={getFiltersCallback} currentFilters={['1', '3']} interaction='inclusive'>
        <FiltersCategory interaction='inclusive'>
          <Filter value='1' />
          <Filter value='2' />
        </FiltersCategory>
        <FiltersCategory interaction='inclusive'>
          <Filter value='3' />
          <Filter value='4' />
        </FiltersCategory>
      </Filters>
    )
    expect(wrapper.state().itemsResult).toEqual([
      { name: 'David', tags: ['1', '2'] },
      { name: 'Mark', tags: ['1', '3'] }
    ])
  })

  it('should filter categories as exclusive and values as inclusive', () => {
    const wrapper = shallow(
      <Filters items={items} getFiltersCallback={getFiltersCallback} currentFilters={['1', '3']} interaction='exclusive'>
        <FiltersCategory interaction='inclusive'>
          <Filter value='1' />
          <Filter value='2' />
        </FiltersCategory>
        <FiltersCategory interaction='inclusive'>
          <Filter value='3' />
          <Filter value='4' />
        </FiltersCategory>
      </Filters>
    )
    expect(wrapper.state().itemsResult).toEqual([
      { name: 'Mark', tags: ['1', '3'] }
    ])
  })

  it('should filter categories as exclusive and values as exclusive', () => {
    const wrapper = shallow(
      <Filters items={items} getFiltersCallback={getFiltersCallback} currentFilters={['1', '3']} interaction='exclusive'>
        <FiltersCategory interaction='exclusive'>
          <Filter value='1' />
          <Filter value='2' />
        </FiltersCategory>
        <FiltersCategory interaction='exclusive'>
          <Filter value='3' />
          <Filter value='4' />
        </FiltersCategory>
      </Filters>
    )
    expect(wrapper.state().itemsResult).toEqual([
      { name: 'Mark', tags: ['1', '3'] }
    ])
  })

  it('should filter categories as inclusive and first category values as exclusive and inclusive in the second one', () => {
    const wrapper = shallow(
      <Filters items={items} getFiltersCallback={getFiltersCallback} currentFilters={['1', '2']} interaction='inclusive'>
        <FiltersCategory interaction='exclusive'>
          <Filter value='1' />
          <Filter value='2' />
        </FiltersCategory>
        <FiltersCategory interaction='inclusive'>
          <Filter value='3' />
          <Filter value='4' />
        </FiltersCategory>
      </Filters>
    )
    expect(wrapper.state().itemsResult).toEqual([
      { name: 'David', tags: ['1', '2'] }
    ])
  })

  it('should have a prop named multiple on FiltersCategory which controls if fitlers can be selected as multiple', () => {
    const mock = jest.fn()
    const wrapper = mount(
      <Filters 
        items={items} 
        getFiltersCallback={getFiltersCallback} 
        currentFilters={[]} 
        interaction='inclusive'
        onChangeFilter={mock}
      >
        <FiltersCategory interaction='exclusive' multiple={false}>
          <Filter value='1' />
          <Filter value='2' />
        </FiltersCategory>
      </Filters>
    )

    wrapper.find(Filter).at(0).find('input[type="checkbox"]').simulate('change')
    expect(mock).toHaveBeenCalledWith(['1'], expect.any(Array))

    wrapper.find(Filter).at(1).find('input[type="checkbox"]').simulate('change')
    expect(mock).toHaveBeenCalledWith(['2'], expect.any(Array))

    wrapper.find(Filter).at(0).find('input[type="checkbox"]').simulate('change')
    expect(mock).toHaveBeenCalledWith(['1'], expect.any(Array))
  })
})
