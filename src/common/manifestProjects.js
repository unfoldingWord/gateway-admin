

export default function getResourceManifestProject({resourceId}) {
  console.log("getResourceManifestProject() resource id=", resourceId);
  switch(resourceId) {
    /*
    case 'ta':       return ta_project;
    case 'tn':       return tn_project;
    */
    case 'ult':      return lt_project;
    case 'glt':      return lt_project;
    /*
    case 'ust':      return st_project;
    case 'gst':      return st_project;
    case 'tw':       return tw_project;
    case 'twl':      return twl_project;
    case 'tq':       return tq_project;
    case 'sn':       return sn_project;
    case 'sq':       return sq_project;
    case 'obs':      return obs_project;
    case 'tn_obs':   return obs_tn_project;
    case 'obs_sq':   return obs_sq_project;
    case 'obs_sn':   return obs_sn_project;
    */
    default:
      throw "no template manifest available for resource type:"+resourceId;
  }
}

const lt_project = {
  title: 'Genesis',
  versification: 'ufw',
  identifier: 'gen',
  sort: 1,
  path: './01-GEN.usfm',
  categories: [ 'bible-ot' ],
}

const obs_sn_project = `
projects:
  -
    categories:
    identifier: 'obs'
    path: './content'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories Study Notes'
    versification: 'ufw'
`

const obs_sq_project = `
projects:
  -
    categories:
    identifier: 'obs'
    path: './content'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories Study Questions'
    versification: 'ufw'
`

const obs_tn_project = `
projects:
  -
    categories:
    identifier: 'obs'
    path: './content'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories Translation Notes'
    versification: "ufw"
`

const obs_project = `
projects:
  -
    categories:
    identifier: 'obs'
    path: './content'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories'
    versification:
`


const sq_project = `
projects:
  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './sq_TIT.tsv'
    categories: [ 'bible-nt' ]`

const sn_project = `
projects:
  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './sn_TIT.tsv'
    categories: [ 'bible-nt' ]
`

const tq_project = `
projects:
  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './tq_GEN.tsv'
    categories: [ 'bible-ot' ]
`

const twl_project = `
projects:
  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './twl_GEN.tsv'
    categories: [ 'bible-ot' ]
`

const tw_project = `
projects:
  -
    categories:
    identifier: 'bible'
    path: './bible'
    sort: 0
    title: 'unfoldingWord® Translation Words'
    versification:
`

const st_project = `
projects:

  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './01-GEN.usfm'
    categories: [ 'bible-ot' ]
`

const tn_project = `
projects:
  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './tn_GEN.tsv'
    categories: [ 'bible-ot' ]
`

const ta_project = 
`
projects:
  -
    categories:
      - 'ta'
    identifier: 'intro'
    path: './intro'
    sort: 0
    title: 'Introduction to unfoldingWord® Translation Academy'
    versification:
  -
    categories:
      - 'ta'
    identifier: 'process'
    path: './process'
    sort: 1
    title: 'Process Manual'
    versification:
  -
    categories:
      - 'ta'
    identifier: 'translate'
    path: './translate'
    sort: 2
    title: 'Translation Manual'
    versification:
  -
    categories:
      - 'ta'
    identifier: 'checking'
    path: './checking'
    sort: 3
    title: 'Checking Manual'
    versification:
`