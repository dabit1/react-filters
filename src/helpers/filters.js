import uniq from 'lodash.uniq'

const mapFiltersToAddCategory = (filterValues, currentFilters) => {
  let filtersWithCategory = {}

  currentFilters.forEach(filter => {
    const filters = filterValues.find(value => value.values.indexOf(filter) !== -1)
    if (filters) {
      !filtersWithCategory[filters.category] && (filtersWithCategory[filters.category] = {interactionBetweenValues: filters.interaction, values: [filter]}) ||
      filtersWithCategory[filters.category].values.push(filter)
    }
  })
  return filtersWithCategory
}

const matchFilter = (itemFilters, currentFiltersWithCategory, interactionBetweenCategories) => {
  let foundCategory = false
  for (let category in currentFiltersWithCategory) {
    let foundFilter = false

    for (let i = 0, l = currentFiltersWithCategory[category].values.length; i < l; i++) {
      if (currentFiltersWithCategory[category].interactionBetweenValues === 'exclusive' &&
        itemFilters.indexOf(currentFiltersWithCategory[category].values[i]) === -1
      ) {
        return false
      } else if (itemFilters.indexOf(currentFiltersWithCategory[category].values[i]) !== -1) {
        foundFilter = true
      }
    }

    if (interactionBetweenCategories === 'exclusive' && !foundFilter) {
      return false
    } else if (foundFilter) {
      foundCategory = true
    }
  }

  if (interactionBetweenCategories === 'inclusive' && !foundCategory) {
    return false
  }

  return true
}

const getItemsResult = (filterValues, currentFilters, items, getFiltersCallback, interactionBetweenCategories) => {
  if (currentFilters.length) {
    const currentFiltersWithCategory = mapFiltersToAddCategory(filterValues, currentFilters)

    return items.filter(item => {
      const itemFilters = getFiltersCallback(item)

      return matchFilter(Array.isArray(itemFilters) ? itemFilters : [itemFilters], currentFiltersWithCategory, interactionBetweenCategories)
    })
  }

  return items
}

const checkFiltersWithNoResults = (filterValues, currentFilters, items, getFiltersCallback, interactionBetweenCategories) => {
  let filtersWithNoResults = []

  filterValues.forEach((filters, category) => {
    filtersWithNoResults = [
      ...filtersWithNoResults,
      ...filters.values.filter(filter => {
        const results = getItemsResult(filterValues, uniq([...currentFilters, filter]), items, getFiltersCallback, interactionBetweenCategories)
        return results.length === 0 || results.find(item => {
          const itemFilters = getFiltersCallback(item)
          return Array.isArray(itemFilters) ? itemFilters.indexOf(filter) !== -1 : itemFilters === filter
        }) === undefined
      })
    ]
  })

  return filtersWithNoResults
}

export { getItemsResult, checkFiltersWithNoResults }
