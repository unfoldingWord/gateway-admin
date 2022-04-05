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
    "obs-tn": 'OBS Translation Notes',
    "obs-twl": 'OBS Translation Word List',
    "obs-tq": 'OBS Translation Questions',
    "obs-sn": 'OBS Study Notes',
    "obs-sq": 'OBS Study Questions',
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
  if ( organization.toLowerCase() === 'unfoldingword') {
    if ( resourceId === 'lt' ) return 'ult'
    if ( resourceId === 'st' ) return 'ust'
  } else {
    if ( resourceId === 'lt' ) return 'glt'
    if ( resourceId === 'st' ) return 'gst'
  }
  // otherwise return as-is
  return resourceId
}
