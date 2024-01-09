// Description: This module contains functions for normalizing and deduplicating the domain name list.

/**
 * Normalize domain name list
 * Make domains and category_code lowercase, and set date_added to day zero if it is empty
 *
 * @param {array} domainList
 * @returns {array} normalizedDomainList
 */
function normalizeDomainList (domainList) {
  const dayZero = '2023-12-10' // Initial commit date of the project is 2023-12-11
  const normalizedDomainList = domainList.filter(item => item.domain !== '').map(domain => {
    return {
      ...domain,
      domain: domain.domain.toLowerCase(),
      category_code: domain.category_code.toLowerCase(),
      date_added: domain.date_added || dayZero // If date_added is empty, use day zero
    }
  })

  return normalizedDomainList
}

/**
 * Deduplicate domain name list
 *
 * Duplicated domains are removed from the list, using these rules, by this order:
 * 1. If the domain is not duplicated, it is kept
 * 2. If the domain is duplicated,
 *    the one with the category_code (not empty) is kept
 * 3. If the domain is duplicated
 *    and the category_code is not empty,
 *    the one with notes (not empty) is kept
 * 4. If the domain is duplicated
 *    and the category_code and notes are not empty,
 *    the one with the most recent date_added is kept
 * 5. If the domain is duplicated,
 *    and the category_code and notes are not empty,
 *    and the date_added are the same,
 *    the one with the category_code that comes first
 *    alphabetically (a-z) is kept
 *
 * @param {array} domainList
 * @returns {array} deduplicatedDomains
 */
function deduplicateDomainList (domainList) {
  domainList = normalizeDomainList(domainList)

  const deduplicatedDomains = []
  for (const domain of domainList) {
    // Skip if the domain is already in the deduplicated list
    if (deduplicatedDomains.find(item => item.domain === domain.domain)) {
      continue
    }

    const duplicates = domainList.filter(item => item.domain === domain.domain)
    // Rule 1: No duplicates
    if (duplicates.length === 1) {
      deduplicatedDomains.push(duplicates[0])
      continue
    }

    // Rule 2: If the domain is duplicated,
    // the one with the category_code (not empty) is kept
    let remaining = duplicates.filter(item => item.category_code !== '')
    if (remaining.length === 1) {
      deduplicatedDomains.push(remaining[0])
      continue
    } else if (remaining.length === 0) {
      // If all category_code are empty, restore the original duplicates list
      remaining = duplicates
    }

    // Rule 3: If the domain is duplicated
    // and the category_code is not empty,
    // the one with notes (not empty) is kept
    remaining = remaining.filter(item => item.category_code !== '' && item.notes !== '')
    if (remaining.length === 1) {
      deduplicatedDomains.push(remaining[0])
      continue
    } else if (remaining.length === 0) {
      // If no entries have category_code and notes, try ones with at least notes
      // If still can't find one, restore the original duplicates list
      const temp = duplicates.filter(item => item.notes !== '')
      if (temp.length !== 0) {
        remaining = temp
      } else {
        remaining = duplicates
      }
    }

    // Rule 4: If the domain is duplicated
    // and the category_code and notes are not empty,
    // the one with the most recent date_added is kept
    remaining = remaining.sort((a, b) => {
      return new Date(b.date_added) - new Date(a.date_added)
    })
    let temp = remaining[0]
    remaining = remaining.filter(item => item.date_added === temp.date_added)
    if (remaining.length === 1) {
      deduplicatedDomains.push(remaining[0])
      continue
    }

    // Rule 5: If the domain is duplicated,
    // and the category_code and notes are not empty,
    // and the date_added are the same,
    // the one with the category_code that comes first
    // alphabetically (a-z) is kept

    // Remove the ones with empty category_code from sorting
    // (or the remaining[0] will be the one with empty category_code)
    temp = remaining.filter(item => item.category_code !== '')
    if (temp.length !== 0) {
      remaining = temp
    }

    remaining = remaining.sort((a, b) => {
      return a.category_code.localeCompare(b.category_code, 'en')
    })
    deduplicatedDomains.push(remaining[0])
    continue
  }

  return deduplicatedDomains
}

export default async (domainList) => {
  return deduplicateDomainList(domainList)
}
