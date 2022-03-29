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
