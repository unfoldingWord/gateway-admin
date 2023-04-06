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

export const RESOURCES_WITH_NO_BOOK_FILES = [
  'ta',
  'tw',
  'obs',
  'obs-tn',
  'obs-tq',
  'obs-twl',
  'obs-sn',
  'obs-sq',
]

export const ALLRESOURCES = {
  'lt': 'Literal Translation',
  'st': 'Simplified Translation',
  'tn': 'Translation Notes',
  'twl': 'Translation Word List',
  'tw': 'Translation Words',
  'ta': 'Translation Academy',
  'tq': 'Translation Questions',
  'sq': 'Study Questions',
  'sn': 'Study Notes',
  'obs': 'Open Bible Stories (OBS)',
  'obs-tn': 'OBS Translation Notes',
  'obs-tq': 'OBS Translation Questions',
  'obs-twl': 'OBS Translation Word List',
  'obs-sn': 'OBS Study Notes',
  'obs-sq': 'OBS Study Questions',
}

export function resourceSelectList() {
  return Object.keys(RESOURCES).map(
    (resCode) => ({ id: resCode, name: RESOURCES[resCode] }),
  )
}

export function resourceSelectAllList() {
  return Object.keys(ALLRESOURCES).map(
    (resCode) => ({ id: resCode, name: ALLRESOURCES[resCode] }),
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
    if ( resourceId === 'lt' ) {
      _rid = 'ult'
    }

    if ( resourceId === 'st' ) {
      _rid = 'ust'
    }
  } else {
    if ( resourceId === 'lt' ) {
      _rid = 'glt'
    }

    if ( resourceId === 'st' ) {
      _rid = 'gst'
    }
  }
  // otherwise return as-is
  return _rid
}
