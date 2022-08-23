/**
 * List of Resources Names
 */
export const RESOURCES = {
    lt: 'Literal Translation',
    st: 'Simplified Translation',
    tn: 'Translation Notes',
    twl: 'Translation Word List',
    tw: 'Translation Words',
    ta: 'Translation Academy',
    tq: 'Translation Questions',
    sq: 'Study Questions',
    sn: 'Study Notes',
    obs: 'Open Bible Stories (OBS)',
}


export function resourceSelectList() {
  return Object.keys(RESOURCES).map(
    (resCode) => {
      return { id: resCode, name: RESOURCES[resCode] }
    }
  )
}

/**
 * if uW then lt becomes ult; otherwise glt
 * if uW then st becomes ust; otherwise gst
 * else no change
 * @param {string} organization
 * @param {string} resourceId
 * @return {string} full resource id
 */
export function resourceIdMapper(organization, resourceId) {
  let _rid = resourceId
  if ( organization.toLowerCase() === 'unfoldingword') {
    if ( resourceId === 'lt' ) _rid = 'ult'
    if ( resourceId === 'st' ) _rid = 'ust'
  } else {
    if ( resourceId === 'lt' ) _rid = 'glt'
    if ( resourceId === 'st' ) _rid = 'gst'
  }
  // otherwise return as-is
  return _rid
}
