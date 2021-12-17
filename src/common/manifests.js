/*
    This file contains a single manifest for a TA resource repo.
    It must be modified once created in order for it to reflect
    the lanugage, contributors, and etc.
*/


/**
 * Resource types and their names:
   For scripture:
    - Translation Notes (tn)
    - Translation Academy (ta)
    - Translation Words (tw)
    - Translation Words List (twl)
    - Translation Questions (tq)
    - Study Notes (sn)
    - Study Questions( sq)
    - Literal Translation (glt)
    - Simplified Translation (gst)

  For Open Bible Stories:
    - OBS (obs)
    - OBS Translation Notes (tn_obs)
    - OBS Study Questions (obs_sq)
    - OBS Study Notes (obs_sn)

 */

export default function getResourceManifest({resourceId}) {
  switch(resourceId) {
    case 'ta':       return ta_manifest;
    case 'tn':       return tn_manifest;
    case 'ult':      return lt_manifest;
    case 'glt':      return lt_manifest;
    case 'ust':      return st_manifest;
    case 'gst':      return st_manifest;
    case 'tw':       return tw_manifest;
    case 'twl':      return twl_manifest;
    case 'tq':       return tq_manifest;
    case 'sn':       return sn_manifest;
    case 'sq':       return sq_manifest;
    case 'obs':      return obs_manifest;
    case 'obs-tn':   return obs_tn_manifest;
    case 'obs-tq':   return obs_tq_manifest;
    case 'obs-sq':   return obs_sq_manifest;
    case 'obs-sn':   return obs_sn_manifest;
    case 'obs-twl':   return obs_twl_manifest;
  
    default:
      return "no template manifest available for resource type:"+resourceId;
  }
}

const obs_twl_manifest = `
dublin_core:
  conformsto: 'rc0.2'
  contributor:
  - 'This list was copied and not necessarily correct for this resource'
  - 'Door43 World Missions Community'
  - 'Jesse Griffin (BA Biblical Studies, Liberty University; MA Biblical Languages, Gordon-Conwell Theological Seminary)'
  - 'Perry Oakes (BA Biblical Studies, Taylor University; MA Theology, Fuller Seminary; MA Linguistics, University of Texas at Arlington; PhD Old Testament, Southwestern Baptist Theological Seminary)'
  - 'Larry Sallee (Th.M Dallas Theological Seminary, D.Min. Columbia Biblical Seminary)'
  - 'Joel D. Ruark (M.A.Th. Gordon-Conwell Theological Seminary; Th.M. Stellenbosch University; Ph.D. Candidate in Old Testament Studies, Stellenbosch University)'
  creator: 'Door43 World Missions Community'
  description: 'Open-licensed exegetical notes that provide historical, cultural, and linguistic information for translators. It provides translators and checkers with pertinent, just-in-time information to help them make the best possible translation decisions.'
  format: 'text/tsv'
  identifier: 'obs-twl'
  issued: '2021-03-22'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-03-22'
  publisher: 'unfoldingWord'
  relation:
  - 'en/obs?v=8'
  rights: 'CC BY-SA 4.0'
  source:
  - identifier: 'obs-twl'
    language: 'en'
    version: '0'
  subject: 'TSV OBS Translation Words Links'
  title: 'unfoldingWord® OBS Translation Words Links'
  type: 'help'
  version: '1'

checking:
  checking_entity:
  - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'OBS Translation Words Links'
    versification: 'ufw'
    identifier: 'obs'
    sort: 1
    path: './twl_OBS.tsv'
    categories: [ ]
`

const obs_tq_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
    - 'Larry Sallee, Th.M Dallas Theological Seminary, D.Min. Columbia Biblical Seminary'
    - 'Susan Quigley, MA in Linguistics'
    - 'Jerrell Hein'
    - 'Lizz Carlton'
    - 'Door43 World Missions Community'
  creator: 'unfoldingWord'
  description: 'Comprehension and theological questions for unfoldingWord® Open Bible Stories. It enables translators and translation checkers to confirm that the intended meaning of their translations is clearly communicated to the speakers of that language.'
  format: 'text/tsv'
  identifier: 'obs-tq'
  issued: '2021-09-29'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-09-29'
  publisher: 'unfoldingWord'
  relation:
    - 'en/obs?v=8'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'obs-tq'
      language: 'en'
      version: '7'
  subject: 'TSV OBS Translation Questions'
  title: 'unfoldingWord® Open Bible Stories Translation Questions'
  type: 'help'
  version: '8'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    categories:
    identifier: 'obs'
    path: './tq_OBS.tsv'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories Translation Questions'
    versification: "ufw"
`

const obs_sn_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'unfoldingWord'
  description: 'Open-licensed exegetical study notes that help people understand the Open Bible Stories.'
  format: 'text/markdown'
  identifier: 'en_obs-sn'
  issued: '2020-05-01'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2020-05-01'
  publisher: 'unfoldingWord'
  relation:
    - 'en/obs?v=8'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'en_obs-sn'
      language: 'en'
      version: '3'
  subject: 'OBS Study Notes'
  title: 'unfoldingWord® Open Bible Stories Study Notes'
  type: 'help'
  version: '4'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '1'

projects:
  -
    categories:
    identifier: 'obs'
    path: './sn_OBS.tsv'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories Study Notes'
    versification: 'ufw'
`


const obs_sq_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'unfoldingWord'
  description: 'Open-licensed exegetical questions that guide discussions about the Open Bible Stories.'
  format: 'text/markdown'
  identifier: 'en_obs-sq'
  issued: '2020-04-24'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2020-04-24'
  publisher: 'unfoldingWord'
  relation:
    - 'en/obs?v=8'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'en_obs-sq'
      language: 'en'
      version: '2'
  subject: 'OBS Study Questions'
  title: 'unfoldingWord® Open Bible Stories Study Questions'
  type: 'help'
  version: '3'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '1'

projects:
  -
    categories:
    identifier: 'obs'
    path: './sq_OBS.tsv'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories Study Questions'
    versification: 'ufw'
`

const obs_tn_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'unfoldingWord'
  description: 'Open-licensed exegetical notes that provide historical, cultural, and linguistic information for translators. It provides translators and checkers with pertinent, just-in-time information to help them make the best possible translation decisions.'
  format: 'text/markdown'
  identifier: 'obs-tn'
  issued: '2020-05-01'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2020-05-01'
  publisher: 'unfoldingWord'
  relation:
    - 'en/obs?v=8'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'obs-tn'
      language: 'en'
      version: '8'
  subject: 'OBS Translation Notes'
  title: 'unfoldingWord® Open Bible Stories Translation Notes'
  type: 'help'
  version: '9'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    categories:
    identifier: 'obs'
    path: './tn_OBS.tsv'
    sort: 1
    title: 'unfoldingWord® Open Bible Stories Translation Notes'
    versification: "ufw"
`

const obs_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'unfoldingWord'
  description: 'Unrestricted visual Bible stories–50 key stories of the Bible, from Creation to Revelation, in text, audio, and video, in any language, for free. It increases understanding of the historical and redemptive narrative of the entire Bible.'
  format: 'text/markdown'
  identifier: 'obs'
  issued: '2020-04-24'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2020-04-24'
  publisher: 'unfoldingWord'
  relation:
    - 'en/tw'
    - 'en/obs-tq'
    - 'en/obs-tn'
    - 'en/obs-sn'
    - 'en/obs-sq'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'obs'
      language: 'en'
      version: '7'
  subject: 'Open Bible Stories'
  title: 'unfoldingWord® Open Bible Stories'
  type: 'book'
  version: '8'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    categories:
    identifier: 'obs'
    path: './content'
    sort: 0
    title: 'unfoldingWord® Open Bible Stories'
    versification:
`


const sq_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: 'Comprehension and theological questions for each chapter of the Bible.'
  format: 'text/markdown'
  identifier: 'tq'
  issued: '2021-03-10'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-03-10'
  publisher: 'unfoldingWord'
  relation:
    - 'en/ult'
    - 'en/ust'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'sq'
      language: 'en'
      version: '0'
  subject: 'TSV Study Questions'
  title: 'unfoldingWord® Study Questions'
  type: 'help'
  version: '1'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'Ephesians'
    versification: 'ufw'
    identifier: 'eph'
    sort: 49
    path: './sq_EPH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './sq_TIT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '3 John'
    versification: 'ufw'
    identifier: '3jn'
    sort: 64
    path: './sq_3JN.tsv'
    categories: [ 'bible-nt' ]
`

const sn_manifest = `
dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: 'Open-licensed exegetical study notes that provide historical, cultural, and linguistic information for studying the Bible.'
  format: 'text/tsv'
  identifier: 'sn'
  issued: '2021-03-10'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-03-10'
  publisher: 'unfoldingWord'
  relation:
  - 'en/ult'
  - 'el-x-koine/ugnt?v=0.18'
  - 'hbo/uhb?v=2.1.17'
  rights: 'CC BY-SA 4.0'
  source:
  - identifier: 'sn'
    language: 'en'
    version: '0'
  subject: 'TSV Study Notes'
  title: 'unfoldingWord® Study Notes'
  type: 'help'
  version: '1'

checking:
  checking_entity:
  - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './sn_TIT.tsv'
    categories: [ 'bible-nt' ]
`

const tq_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: 'Comprehension and theological questions for each chapter of the Bible. It enables translators and translation checkers to confirm that the intended meaning of their translations is clearly communicated to the speakers of that language.'
  format: 'text/tsv'
  identifier: 'tq'
  issued: '2021-03-10'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-03-10'
  publisher: 'unfoldingWord'
  relation:
    - 'en/ult'
    - 'en/ust'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'tq'
      language: 'en'
      version: '17'
  subject: 'TSV Translation Questions'
  title: 'unfoldingWord® Translation Questions'
  type: 'help'
  version: '18'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './tq_GEN.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Exodus'
    versification: 'ufw'
    identifier: 'exo'
    sort: 2
    path: './tq_EXO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Leviticus'
    versification: 'ufw'
    identifier: 'lev'
    sort: 3
    path: './tq_LEV.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Numbers'
    versification: 'ufw'
    identifier: 'num'
    sort: 4
    path: './tq_NUM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Deuteronomy'
    versification: 'ufw'
    identifier: 'deu'
    sort: 5
    path: './tq_DEU.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Joshua'
    versification: 'ufw'
    identifier: 'jos'
    sort: 6
    path: './tq_JOS.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Judges'
    versification: 'ufw'
    identifier: 'jdg'
    sort: 7
    path: './tq_JDG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ruth'
    versification: 'ufw'
    identifier: 'rut'
    sort: 8
    path: './tq_RUT.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Samuel'
    versification: 'ufw'
    identifier: '1sa'
    sort: 9
    path: './tq_1SA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Samuel'
    versification: 'ufw'
    identifier: '2sa'
    sort: 10
    path: './tq_2SA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Kings'
    versification: 'ufw'
    identifier: '1ki'
    sort: 11
    path: './tq_1KI.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Kings'
    versification: 'ufw'
    identifier: '2ki'
    sort: 12
    path: './tq_2KI.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Chronicles'
    versification: 'ufw'
    identifier: '1ch'
    sort: 13
    path: './tq_1CH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Chronicles'
    versification: 'ufw'
    identifier: '2ch'
    sort: 14
    path: './tq_2CH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezra'
    versification: 'ufw'
    identifier: 'ezr'
    sort: 15
    path: './tq_EZR.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Nehemiah'
    versification: 'ufw'
    identifier: 'neh'
    sort: 16
    path: './tq_NEH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Esther'
    versification: 'ufw'
    identifier: 'est'
    sort: 17
    path: './tq_EST.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Job'
    versification: 'ufw'
    identifier: 'job'
    sort: 18
    path: './tq_JOB.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Psalms'
    versification: 'ufw'
    identifier: 'psa'
    sort: 19
    path: './tq_PSA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Proverbs'
    versification: 'ufw'
    identifier: 'pro'
    sort: 20
    path: './tq_PRO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ecclesiastes'
    versification: 'ufw'
    identifier: 'ecc'
    sort: 21
    path: './tq_ECC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Song of Solomon'
    versification: 'ufw'
    identifier: 'sng'
    sort: 22
    path: './tq_SNG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Isaiah'
    versification: 'ufw'
    identifier: 'isa'
    sort: 23
    path: './tq_ISA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Jeremiah'
    versification: 'ufw'
    identifier: 'jer'
    sort: 24
    path: './tq_JER.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Lamentations'
    versification: 'ufw'
    identifier: 'lam'
    sort: 25
    path: './tq_LAM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezekiel'
    versification: 'ufw'
    identifier: 'ezk'
    sort: 26
    path: './tq_EZK.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Daniel'
    versification: 'ufw'
    identifier: 'dan'
    sort: 27
    path: './tq_DAN.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Hosea'
    versification: 'ufw'
    identifier: 'hos'
    sort: 28
    path: './tq_HOS.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Joel'
    versification: 'ufw'
    identifier: 'jol'
    sort: 29
    path: './tq_JOL.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Amos'
    versification: 'ufw'
    identifier: 'amo'
    sort: 30
    path: './tq_AMO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Obadiah'
    versification: 'ufw'
    identifier: 'oba'
    sort: 31
    path: './tq_OBA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Jonah'
    versification: 'ufw'
    identifier: 'jon'
    sort: 32
    path: './tq_JON.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Micah'
    versification: 'ufw'
    identifier: 'mic'
    sort: 33
    path: './tq_MIC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Nahum'
    versification: 'ufw'
    identifier: 'nam'
    sort: 34
    path: './tq_NAM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Habakkuk'
    versification: 'ufw'
    identifier: 'hab'
    sort: 35
    path: './tq_HAB.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Zephaniah'
    versification: 'ufw'
    identifier: 'zep'
    sort: 36
    path: './tq_ZEP.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Haggai'
    versification: 'ufw'
    identifier: 'hag'
    sort: 37
    path: './tq_HAG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Zechariah'
    versification: 'ufw'
    identifier: 'zec'
    sort: 38
    path: './tq_ZEC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Malachi'
    versification: 'ufw'
    identifier: 'mal'
    sort: 39
    path: './tq_MAL.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Matthew'
    versification: 'ufw'
    identifier: 'mat'
    sort: 40
    path: './tq_MAT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Mark'
    versification: 'ufw'
    identifier: 'mrk'
    sort: 41
    path: './tq_MRK.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Luke'
    versification: 'ufw'
    identifier: 'luk'
    sort: 42
    path: './tq_LUK.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'John'
    versification: 'ufw'
    identifier: 'jhn'
    sort: 43
    path: './tq_JHN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Acts'
    versification: 'ufw'
    identifier: 'act'
    sort: 44
    path: './tq_ACT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Romans'
    versification: 'ufw'
    identifier: 'rom'
    sort: 45
    path: './tq_ROM.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Corinthians'
    versification: 'ufw'
    identifier: '1co'
    sort: 46
    path: './tq_1CO.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Corinthians'
    versification: 'ufw'
    identifier: '2co'
    sort: 47
    path: './tq_2CO.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Galatians'
    versification: 'ufw'
    identifier: 'gal'
    sort: 48
    path: './tq_GAL.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Ephesians'
    versification: 'ufw'
    identifier: 'eph'
    sort: 49
    path: './tq_EPH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Philippians'
    versification: 'ufw'
    identifier: 'php'
    sort: 50
    path: './tq_PHP.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Colossians'
    versification: 'ufw'
    identifier: 'col'
    sort: 51
    path: './tq_COL.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Thessalonians'
    versification: 'ufw'
    identifier: '1th'
    sort: 52
    path: './tq_1TH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Thessalonians'
    versification: 'ufw'
    identifier: '2th'
    sort: 53
    path: './tq_2TH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Timothy'
    versification: 'ufw'
    identifier: '1ti'
    sort: 54
    path: './tq_1TI.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Timothy'
    versification: 'ufw'
    identifier: '2ti'
    sort: 55
    path: './tq_2TI.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './tq_TIT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Philemon'
    versification: 'ufw'
    identifier: 'phm'
    sort: 57
    path: './tq_PHM.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Hebrews'
    versification: 'ufw'
    identifier: 'heb'
    sort: 58
    path: './tq_HEB.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'James'
    versification: 'ufw'
    identifier: 'jas'
    sort: 59
    path: './tq_JAS.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Peter'
    versification: 'ufw'
    identifier: '1pe'
    sort: 60
    path: './tq_1PE.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Peter'
    versification: 'ufw'
    identifier: '2pe'
    sort: 61
    path: './tq_2PE.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 John'
    versification: 'ufw'
    identifier: '1jn'
    sort: 62
    path: './tq_1JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 John'
    versification: 'ufw'
    identifier: '2jn'
    sort: 63
    path: './tq_2JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '3 John'
    versification: 'ufw'
    identifier: '3jn'
    sort: 64
    path: './tq_3JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Jude'
    versification: 'ufw'
    identifier: 'jud'
    sort: 65
    path: './tq_JUD.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Revelation'
    versification: 'ufw'
    identifier: 'rev'
    sort: 66
    path: './tq_REV.tsv'
    categories: [ 'bible-nt' ]
`

const twl_manifest = `
dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: 'Open-licensed exegetical notes that provide historical, cultural, and linguistic information for translators. It provides translators and checkers with pertinent, just-in-time information to help them make the best possible translation decisions.'
  format: 'text/tsv'
  identifier: 'twl'
  issued: '2021-03-10'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-03-10'
  publisher: 'unfoldingWord'
  relation:
  - 'el-x-koine/ugnt?v=0.18'
  - 'hbo/uhb?v=2.1.17'
  rights: 'CC BY-SA 4.0'
  source:
  - identifier: 'twl'
    language: 'en'
    version: '0'
  subject: 'TSV Translation Words Links'
  title: 'unfoldingWord® Translation Word Links'
  type: 'help'
  version: '1'

checking:
  checking_entity:
  - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './twl_GEN.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Exodus'
    versification: 'ufw'
    identifier: 'exo'
    sort: 2
    path: './twl_EXO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Leviticus'
    versification: 'ufw'
    identifier: 'lev'
    sort: 3
    path: './twl_LEV.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Numbers'
    versification: 'ufw'
    identifier: 'num'
    sort: 4
    path: './twl_NUM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Deuteronomy'
    versification: 'ufw'
    identifier: 'deu'
    sort: 5
    path: './twl_DEU.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Joshua'
    versification: 'ufw'
    identifier: 'jos'
    sort: 6
    path: './twl_JOS.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Judges'
    versification: 'ufw'
    identifier: 'jdg'
    sort: 7
    path: './twl_JDG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ruth'
    versification: 'ufw'
    identifier: 'rut'
    sort: 8
    path: './twl_RUT.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Samuel'
    versification: 'ufw'
    identifier: '1sa'
    sort: 9
    path: './twl_1SA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Samuel'
    versification: 'ufw'
    identifier: '2sa'
    sort: 10
    path: './twl_2SA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Kings'
    versification: 'ufw'
    identifier: '1ki'
    sort: 11
    path: './twl_1KI.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Kings'
    versification: 'ufw'
    identifier: '2ki'
    sort: 12
    path: './twl_2KI.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Chronicles'
    versification: 'ufw'
    identifier: '1ch'
    sort: 13
    path: './twl_1CH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Chronicles'
    versification: 'ufw'
    identifier: '2ch'
    sort: 14
    path: './twl_2CH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezra'
    versification: 'ufw'
    identifier: 'ezr'
    sort: 15
    path: './twl_EZR.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Nehemiah'
    versification: 'ufw'
    identifier: 'neh'
    sort: 16
    path: './twl_NEH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Esther'
    versification: 'ufw'
    identifier: 'est'
    sort: 17
    path: './twl_EST.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Job'
    versification: 'ufw'
    identifier: 'job'
    sort: 18
    path: './twl_JOB.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Psalms'
    versification: 'ufw'
    identifier: 'psa'
    sort: 19
    path: './twl_PSA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Proverbs'
    versification: 'ufw'
    identifier: 'pro'
    sort: 20
    path: './twl_PRO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ecclesiastes'
    versification: 'ufw'
    identifier: 'ecc'
    sort: 21
    path: './twl_ECC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Song of Solomon'
    versification: 'ufw'
    identifier: 'sng'
    sort: 22
    path: './twl_SNG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Isaiah'
    versification: 'ufw'
    identifier: 'isa'
    sort: 23
    path: './twl_ISA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Jeremiah'
    versification: 'ufw'
    identifier: 'jer'
    sort: 24
    path: './twl_JER.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Lamentations'
    versification: 'ufw'
    identifier: 'lam'
    sort: 25
    path: './twl_LAM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezekiel'
    versification: 'ufw'
    identifier: 'ezk'
    sort: 26
    path: './twl_EZK.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Daniel'
    versification: 'ufw'
    identifier: 'dan'
    sort: 27
    path: './twl_DAN.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Hosea'
    versification: 'ufw'
    identifier: 'hos'
    sort: 28
    path: './twl_HOS.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Joel'
    versification: 'ufw'
    identifier: 'jol'
    sort: 29
    path: './twl_JOL.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Amos'
    versification: 'ufw'
    identifier: 'amo'
    sort: 30
    path: './twl_AMO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Obadiah'
    versification: 'ufw'
    identifier: 'oba'
    sort: 31
    path: './twl_OBA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Jonah'
    versification: 'ufw'
    identifier: 'jon'
    sort: 32
    path: './twl_JON.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Micah'
    versification: 'ufw'
    identifier: 'mic'
    sort: 33
    path: './twl_MIC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Nahum'
    versification: 'ufw'
    identifier: 'nam'
    sort: 34
    path: './twl_NAM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Habakkuk'
    versification: 'ufw'
    identifier: 'hab'
    sort: 35
    path: './twl_HAB.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Zephaniah'
    versification: 'ufw'
    identifier: 'zep'
    sort: 36
    path: './twl_ZEP.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Haggai'
    versification: 'ufw'
    identifier: 'hag'
    sort: 37
    path: './twl_HAG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Zechariah'
    versification: 'ufw'
    identifier: 'zec'
    sort: 38
    path: './twl_ZEC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Malachi'
    versification: 'ufw'
    identifier: 'mal'
    sort: 39
    path: './twl_MAL.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Matthew'
    versification: 'ufw'
    identifier: 'mat'
    sort: 40
    path: './twl_MAT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Mark'
    versification: 'ufw'
    identifier: 'mrk'
    sort: 41
    path: './twl_MRK.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Luke'
    versification: 'ufw'
    identifier: 'luk'
    sort: 42
    path: './twl_LUK.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'John'
    versification: 'ufw'
    identifier: 'jhn'
    sort: 43
    path: './twl_JHN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Acts'
    versification: 'ufw'
    identifier: 'act'
    sort: 44
    path: './twl_ACT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Romans'
    versification: 'ufw'
    identifier: 'rom'
    sort: 45
    path: './twl_ROM.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Corinthians'
    versification: 'ufw'
    identifier: '1co'
    sort: 46
    path: './twl_1CO.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Corinthians'
    versification: 'ufw'
    identifier: '2co'
    sort: 47
    path: './twl_2CO.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Galatians'
    versification: 'ufw'
    identifier: 'gal'
    sort: 48
    path: './twl_GAL.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Ephesians'
    versification: 'ufw'
    identifier: 'eph'
    sort: 49
    path: './twl_EPH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Philippians'
    versification: 'ufw'
    identifier: 'php'
    sort: 50
    path: './twl_PHP.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Colossians'
    versification: 'ufw'
    identifier: 'col'
    sort: 51
    path: './twl_COL.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Thessalonians'
    versification: 'ufw'
    identifier: '1th'
    sort: 52
    path: './twl_1TH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Thessalonians'
    versification: 'ufw'
    identifier: '2th'
    sort: 53
    path: './twl_2TH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Timothy'
    versification: 'ufw'
    identifier: '1ti'
    sort: 54
    path: './twl_1TI.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Timothy'
    versification: 'ufw'
    identifier: '2ti'
    sort: 55
    path: './twl_2TI.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './twl_TIT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Philemon'
    versification: 'ufw'
    identifier: 'phm'
    sort: 57
    path: './twl_PHM.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Hebrews'
    versification: 'ufw'
    identifier: 'heb'
    sort: 58
    path: './twl_HEB.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'James'
    versification: 'ufw'
    identifier: 'jas'
    sort: 59
    path: './twl_JAS.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Peter'
    versification: 'ufw'
    identifier: '1pe'
    sort: 60
    path: './twl_1PE.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Peter'
    versification: 'ufw'
    identifier: '2pe'
    sort: 61
    path: './twl_2PE.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 John'
    versification: 'ufw'
    identifier: '1jn'
    sort: 62
    path: './twl_1JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 John'
    versification: 'ufw'
    identifier: '2jn'
    sort: 63
    path: './twl_2JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '3 John'
    versification: 'ufw'
    identifier: '3jn'
    sort: 64
    path: './twl_3JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Jude'
    versification: 'ufw'
    identifier: 'jud'
    sort: 65
    path: './twl_JUD.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Revelation'
    versification: 'ufw'
    identifier: 'rev'
    sort: 66
    path: './twl_REV.tsv'
    categories: [ 'bible-nt' ]
`

const tw_manifest = `
dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: 'A basic Bible lexicon that provides translators with clear, concise definitions and translation suggestions for every important word in the Bible. It provides translators and checkers with essential lexical information to help them make the best possible translation decisions.'
  format: 'text/markdown'
  identifier: 'tw'
  issued: '2021-02-22'
  language:
    identifier: 'en'
    title: 'English'
    direction: 'ltr'
  modified: '2021-02-22'
  publisher: 'unfoldingWord'
  relation:
    - 'en/ult'
    - 'en/ust'
    - 'en/obs'
    - 'el-x-koine/ugnt?v=0.18'
    - 'hbo/uhb?v=2.1.17'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'tw'
      language: 'en'
      version: '20'
  subject: 'Translation Words'
  title: 'unfoldingWord® Translation Words'
  type: 'dict'
  version: '21'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    categories:
    identifier: 'bible'
    path: './bible'
    sort: 0
    title: 'unfoldingWord® Translation Words'
    versification:
`

const st_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: "An open-licensed translation, intended to provide a ‘functional’ understanding of the Bible. It increases the translator’s understanding of the text by translating theological terms as descriptive phrases."
  format: 'text/usfm3'
  identifier: 'ust'
  issued: '2021-02-22'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-02-22'
  publisher: 'unfoldingWord'
  relation:
    - 'en/tw'
    - 'en/tq'
    - 'en/tn'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 't4t'
      language: 'en'
      version: '2014'
    -
      identifier: 'uhb'
      language: 'hbo'
      version: '2.1.17'
    -
      identifier: 'ugnt'
      language: 'el-x-koine'
      version: '0.18'
  subject: 'Aligned Bible'
  title: 'unfoldingWord® Simplified Text'
  type: 'bundle'
  version: '23'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './01-GEN.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Exodus'
    versification: 'ufw'
    identifier: 'exo'
    sort: 2
    path: './02-EXO.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Leviticus'
    versification: 'ufw'
    identifier: 'lev'
    sort: 3
    path: './03-LEV.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Numbers'
    versification: 'ufw'
    identifier: 'num'
    sort: 4
    path: './04-NUM.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Deuteronomy'
    versification: 'ufw'
    identifier: 'deu'
    sort: 5
    path: './05-DEU.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Joshua'
    versification: 'ufw'
    identifier: 'jos'
    sort: 6
    path: './06-JOS.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Judges'
    versification: 'ufw'
    identifier: 'jdg'
    sort: 7
    path: './07-JDG.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ruth'
    versification: 'ufw'
    identifier: 'rut'
    sort: 8
    path: './08-RUT.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '1 Samuel'
    versification: 'ufw'
    identifier: '1sa'
    sort: 9
    path: './09-1SA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '2 Samuel'
    versification: 'ufw'
    identifier: '2sa'
    sort: 10
    path: './10-2SA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '1 Kings'
    versification: 'ufw'
    identifier: '1ki'
    sort: 11
    path: './11-1KI.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '2 Kings'
    versification: 'ufw'
    identifier: '2ki'
    sort: 12
    path: './12-2KI.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '1 Chronicles'
    versification: 'ufw'
    identifier: '1ch'
    sort: 13
    path: './13-1CH.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '2 Chronicles'
    versification: 'ufw'
    identifier: '2ch'
    sort: 14
    path: './14-2CH.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezra'
    versification: 'ufw'
    identifier: 'ezr'
    sort: 15
    path: './15-EZR.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Nehemiah'
    versification: 'ufw'
    identifier: 'neh'
    sort: 16
    path: './16-NEH.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Esther'
    versification: 'ufw'
    identifier: 'est'
    sort: 17
    path: './17-EST.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Job'
    versification: 'ufw'
    identifier: 'job'
    sort: 18
    path: './18-JOB.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Psalms'
    versification: 'ufw'
    identifier: 'psa'
    sort: 19
    path: './19-PSA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Proverbs'
    versification: 'ufw'
    identifier: 'pro'
    sort: 20
    path: './20-PRO.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ecclesiastes'
    versification: 'ufw'
    identifier: 'ecc'
    sort: 21
    path: './21-ECC.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Song of Solomon'
    versification: 'ufw'
    identifier: 'sng'
    sort: 22
    path: './22-SNG.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Isaiah'
    versification: 'ufw'
    identifier: 'isa'
    sort: 23
    path: './23-ISA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Jeremiah'
    versification: 'ufw'
    identifier: 'jer'
    sort: 24
    path: './24-JER.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Lamentations'
    versification: 'ufw'
    identifier: 'lam'
    sort: 25
    path: './25-LAM.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezekiel'
    versification: 'ufw'
    identifier: 'ezk'
    sort: 26
    path: './26-EZK.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Daniel'
    versification: 'ufw'
    identifier: 'dan'
    sort: 27
    path: './27-DAN.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Hosea'
    versification: 'ufw'
    identifier: 'hos'
    sort: 28
    path: './28-HOS.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Joel'
    versification: 'ufw'
    identifier: 'jol'
    sort: 29
    path: './29-JOL.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Amos'
    versification: 'ufw'
    identifier: 'amo'
    sort: 30
    path: './30-AMO.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Obadiah'
    versification: 'ufw'
    identifier: 'oba'
    sort: 31
    path: './31-OBA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Jonah'
    versification: 'ufw'
    identifier: 'jon'
    sort: 32
    path: './32-JON.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Micah'
    versification: 'ufw'
    identifier: 'mic'
    sort: 33
    path: './33-MIC.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Nahum'
    versification: 'ufw'
    identifier: 'nam'
    sort: 34
    path: './34-NAM.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Habakkuk'
    versification: 'ufw'
    identifier: 'hab'
    sort: 35
    path: './35-HAB.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Zephaniah'
    versification: 'ufw'
    identifier: 'zep'
    sort: 36
    path: './36-ZEP.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Haggai'
    versification: 'ufw'
    identifier: 'hag'
    sort: 37
    path: './37-HAG.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Zechariah'
    versification: 'ufw'
    identifier: 'zec'
    sort: 38
    path: './38-ZEC.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Malachi'
    versification: 'ufw'
    identifier: 'mal'
    sort: 39
    path: './39-MAL.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Matthew'
    versification: 'ufw'
    identifier: 'mat'
    sort: 40
    path: './41-MAT.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Mark'
    versification: 'ufw'
    identifier: 'mrk'
    sort: 41
    path: './42-MRK.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Luke'
    versification: 'ufw'
    identifier: 'luk'
    sort: 42
    path: './43-LUK.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'John'
    versification: 'ufw'
    identifier: 'jhn'
    sort: 43
    path: './44-JHN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Acts'
    versification: 'ufw'
    identifier: 'act'
    sort: 44
    path: './45-ACT.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Romans'
    versification: 'ufw'
    identifier: 'rom'
    sort: 45
    path: './46-ROM.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Corinthians'
    versification: 'ufw'
    identifier: '1co'
    sort: 46
    path: './47-1CO.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Corinthians'
    versification: 'ufw'
    identifier: '2co'
    sort: 47
    path: './48-2CO.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Galatians'
    versification: 'ufw'
    identifier: 'gal'
    sort: 48
    path: './49-GAL.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Ephesians'
    versification: 'ufw'
    identifier: 'eph'
    sort: 49
    path: './50-EPH.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Philippians'
    versification: 'ufw'
    identifier: 'php'
    sort: 50
    path: './51-PHP.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Colossians'
    versification: 'ufw'
    identifier: 'col'
    sort: 51
    path: './52-COL.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Thessalonians'
    versification: 'ufw'
    identifier: '1th'
    sort: 52
    path: './53-1TH.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Thessalonians'
    versification: 'ufw'
    identifier: '2th'
    sort: 53
    path: './54-2TH.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Timothy'
    versification: 'ufw'
    identifier: '1ti'
    sort: 54
    path: './55-1TI.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Timothy'
    versification: 'ufw'
    identifier: '2ti'
    sort: 55
    path: './56-2TI.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './57-TIT.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Philemon'
    versification: 'ufw'
    identifier: 'phm'
    sort: 57
    path: './58-PHM.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Hebrews'
    versification: 'ufw'
    identifier: 'heb'
    sort: 58
    path: './59-HEB.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'James'
    versification: 'ufw'
    identifier: 'jas'
    sort: 59
    path: './60-JAS.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Peter'
    versification: 'ufw'
    identifier: '1pe'
    sort: 60
    path: './61-1PE.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Peter'
    versification: 'ufw'
    identifier: '2pe'
    sort: 61
    path: './62-2PE.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 John'
    versification: 'ufw'
    identifier: '1jn'
    sort: 62
    path: './63-1JN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 John'
    versification: 'ufw'
    identifier: '2jn'
    sort: 63
    path: './64-2JN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '3 John'
    versification: 'ufw'
    identifier: '3jn'
    sort: 64
    path: './65-3JN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Jude'
    versification: 'ufw'
    identifier: 'jud'
    sort: 65
    path: './66-JUD.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Revelation'
    versification: 'ufw'
    identifier: 'rev'
    sort: 66
    path: './67-REV.usfm'
    categories: [ 'bible-nt' ]
`

const lt_manifest = `
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'unfoldingWord'
  description: "An open-licensed update of the ASV, intended to provide a ‘form-centric’ understanding of the Bible. It increases the translator's understanding of the lexical and grammatical composition of the underlying text by adhering closely to the word order and structure of the originals."
  format: 'text/usfm3'
  identifier: 'ult'
  issued: '2021-02-22'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-02-22'
  publisher: 'unfoldingWord'
  relation:
    - 'en/tw'
    - 'en/tq'
    - 'en/tn'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'asv'
      language: 'en'
      version: '1901'
    -
      identifier: 'uhb'
      language: 'hbo'
      version: '2.1.17'
    -
      identifier: 'ugnt'
      language: 'el-x-koine'
      version: '0.18'
  subject: 'Aligned Bible'
  title: 'unfoldingWord® Literal Text'
  type: 'bundle'
  version: '23'

checking:
  checking_entity:
    - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'Front Matter'
    versification: 'ufw'
    identifier: 'frt'
    sort: 0
    path: './A0-FRT.usfm'
    categories: [ 'bible-frt' ]

  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './01-GEN.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Exodus'
    versification: 'ufw'
    identifier: 'exo'
    sort: 2
    path: './02-EXO.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Leviticus'
    versification: 'ufw'
    identifier: 'lev'
    sort: 3
    path: './03-LEV.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Numbers'
    versification: 'ufw'
    identifier: 'num'
    sort: 4
    path: './04-NUM.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Deuteronomy'
    versification: 'ufw'
    identifier: 'deu'
    sort: 5
    path: './05-DEU.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Joshua'
    versification: 'ufw'
    identifier: 'jos'
    sort: 6
    path: './06-JOS.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Judges'
    versification: 'ufw'
    identifier: 'jdg'
    sort: 7
    path: './07-JDG.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ruth'
    versification: 'ufw'
    identifier: 'rut'
    sort: 8
    path: './08-RUT.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '1 Samuel'
    versification: 'ufw'
    identifier: '1sa'
    sort: 9
    path: './09-1SA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '2 Samuel'
    versification: 'ufw'
    identifier: '2sa'
    sort: 10
    path: './10-2SA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '1 Kings'
    versification: 'ufw'
    identifier: '1ki'
    sort: 11
    path: './11-1KI.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '2 Kings'
    versification: 'ufw'
    identifier: '2ki'
    sort: 12
    path: './12-2KI.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '1 Chronicles'
    versification: 'ufw'
    identifier: '1ch'
    sort: 13
    path: './13-1CH.usfm'
    categories: [ 'bible-ot' ]

  -
    title: '2 Chronicles'
    versification: 'ufw'
    identifier: '2ch'
    sort: 14
    path: './14-2CH.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezra'
    versification: 'ufw'
    identifier: 'ezr'
    sort: 15
    path: './15-EZR.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Nehemiah'
    versification: 'ufw'
    identifier: 'neh'
    sort: 16
    path: './16-NEH.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Esther'
    versification: 'ufw'
    identifier: 'est'
    sort: 17
    path: './17-EST.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Job'
    versification: 'ufw'
    identifier: 'job'
    sort: 18
    path: './18-JOB.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Psalms'
    versification: 'ufw'
    identifier: 'psa'
    sort: 19
    path: './19-PSA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Proverbs'
    versification: 'ufw'
    identifier: 'pro'
    sort: 20
    path: './20-PRO.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ecclesiastes'
    versification: 'ufw'
    identifier: 'ecc'
    sort: 21
    path: './21-ECC.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Song of Solomon'
    versification: 'ufw'
    identifier: 'sng'
    sort: 22
    path: './22-SNG.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Isaiah'
    versification: 'ufw'
    identifier: 'isa'
    sort: 23
    path: './23-ISA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Jeremiah'
    versification: 'ufw'
    identifier: 'jer'
    sort: 24
    path: './24-JER.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Lamentations'
    versification: 'ufw'
    identifier: 'lam'
    sort: 25
    path: './25-LAM.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezekiel'
    versification: 'ufw'
    identifier: 'ezk'
    sort: 26
    path: './26-EZK.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Daniel'
    versification: 'ufw'
    identifier: 'dan'
    sort: 27
    path: './27-DAN.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Hosea'
    versification: 'ufw'
    identifier: 'hos'
    sort: 28
    path: './28-HOS.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Joel'
    versification: 'ufw'
    identifier: 'jol'
    sort: 29
    path: './29-JOL.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Amos'
    versification: 'ufw'
    identifier: 'amo'
    sort: 30
    path: './30-AMO.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Obadiah'
    versification: 'ufw'
    identifier: 'oba'
    sort: 31
    path: './31-OBA.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Jonah'
    versification: 'ufw'
    identifier: 'jon'
    sort: 32
    path: './32-JON.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Micah'
    versification: 'ufw'
    identifier: 'mic'
    sort: 33
    path: './33-MIC.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Nahum'
    versification: 'ufw'
    identifier: 'nam'
    sort: 34
    path: './34-NAM.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Habakkuk'
    versification: 'ufw'
    identifier: 'hab'
    sort: 35
    path: './35-HAB.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Zephaniah'
    versification: 'ufw'
    identifier: 'zep'
    sort: 36
    path: './36-ZEP.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Haggai'
    versification: 'ufw'
    identifier: 'hag'
    sort: 37
    path: './37-HAG.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Zechariah'
    versification: 'ufw'
    identifier: 'zec'
    sort: 38
    path: './38-ZEC.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Malachi'
    versification: 'ufw'
    identifier: 'mal'
    sort: 39
    path: './39-MAL.usfm'
    categories: [ 'bible-ot' ]

  -
    title: 'Matthew'
    versification: 'ufw'
    identifier: 'mat'
    sort: 40
    path: './41-MAT.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Mark'
    versification: 'ufw'
    identifier: 'mrk'
    sort: 41
    path: './42-MRK.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Luke'
    versification: 'ufw'
    identifier: 'luk'
    sort: 42
    path: './43-LUK.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'John'
    versification: 'ufw'
    identifier: 'jhn'
    sort: 43
    path: './44-JHN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Acts'
    versification: 'ufw'
    identifier: 'act'
    sort: 44
    path: './45-ACT.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Romans'
    versification: 'ufw'
    identifier: 'rom'
    sort: 45
    path: './46-ROM.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Corinthians'
    versification: 'ufw'
    identifier: '1co'
    sort: 46
    path: './47-1CO.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Corinthians'
    versification: 'ufw'
    identifier: '2co'
    sort: 47
    path: './48-2CO.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Galatians'
    versification: 'ufw'
    identifier: 'gal'
    sort: 48
    path: './49-GAL.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Ephesians'
    versification: 'ufw'
    identifier: 'eph'
    sort: 49
    path: './50-EPH.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Philippians'
    versification: 'ufw'
    identifier: 'php'
    sort: 50
    path: './51-PHP.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Colossians'
    versification: 'ufw'
    identifier: 'col'
    sort: 51
    path: './52-COL.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Thessalonians'
    versification: 'ufw'
    identifier: '1th'
    sort: 52
    path: './53-1TH.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Thessalonians'
    versification: 'ufw'
    identifier: '2th'
    sort: 53
    path: './54-2TH.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Timothy'
    versification: 'ufw'
    identifier: '1ti'
    sort: 54
    path: './55-1TI.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Timothy'
    versification: 'ufw'
    identifier: '2ti'
    sort: 55
    path: './56-2TI.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './57-TIT.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Philemon'
    versification: 'ufw'
    identifier: 'phm'
    sort: 57
    path: './58-PHM.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Hebrews'
    versification: 'ufw'
    identifier: 'heb'
    sort: 58
    path: './59-HEB.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'James'
    versification: 'ufw'
    identifier: 'jas'
    sort: 59
    path: './60-JAS.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 Peter'
    versification: 'ufw'
    identifier: '1pe'
    sort: 60
    path: './61-1PE.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 Peter'
    versification: 'ufw'
    identifier: '2pe'
    sort: 61
    path: './62-2PE.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '1 John'
    versification: 'ufw'
    identifier: '1jn'
    sort: 62
    path: './63-1JN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '2 John'
    versification: 'ufw'
    identifier: '2jn'
    sort: 63
    path: './64-2JN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: '3 John'
    versification: 'ufw'
    identifier: '3jn'
    sort: 64
    path: './65-3JN.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Jude'
    versification: 'ufw'
    identifier: 'jud'
    sort: 65
    path: './66-JUD.usfm'
    categories: [ 'bible-nt' ]

  -
    title: 'Revelation'
    versification: 'ufw'
    identifier: 'rev'
    sort: 66
    path: './67-REV.usfm'
    categories: [ 'bible-nt' ]
`

const tn_manifest = `
dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: 'Open-licensed exegetical notes that provide historical, cultural, and linguistic information for translators. It provides translators and checkers with pertinent, just-in-time information to help them make the best possible translation decisions.'
  format: 'text/tsv'
  identifier: 'tn'
  issued: '2021-02-22'
  language:
    direction: 'ltr'
    identifier: 'en'
    title: 'English'
  modified: '2021-02-22'
  publisher: 'unfoldingWord'
  relation:
  - 'en/ult'
  - 'hbo/uhb?v=2.1.17'
  - 'el-x-koine/ugnt?v=0.18'
  rights: 'CC BY-SA 4.0'
  source:
  - identifier: 'tn'
    language: 'en'
    version: '43'
  subject: 'TSV Translation Notes'
  title: 'unfoldingWord® Translation Notes'
  type: 'help'
  version: '44'

checking:
  checking_entity:
  - 'unfoldingWord'
  checking_level: '3'

projects:
  -
    title: 'Genesis'
    versification: 'ufw'
    identifier: 'gen'
    sort: 1
    path: './tn_GEN.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Exodus'
    versification: 'ufw'
    identifier: 'exo'
    sort: 2
    path: './tn_EXO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Leviticus'
    versification: 'ufw'
    identifier: 'lev'
    sort: 3
    path: './tn_LEV.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Numbers'
    versification: 'ufw'
    identifier: 'num'
    sort: 4
    path: './tn_NUM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Deuteronomy'
    versification: 'ufw'
    identifier: 'deu'
    sort: 5
    path: './tn_DEU.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Joshua'
    versification: 'ufw'
    identifier: 'jos'
    sort: 6
    path: './tn_JOS.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Judges'
    versification: 'ufw'
    identifier: 'jdg'
    sort: 7
    path: './tn_JDG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ruth'
    versification: 'ufw'
    identifier: 'rut'
    sort: 8
    path: './tn_RUT.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Samuel'
    versification: 'ufw'
    identifier: '1sa'
    sort: 9
    path: './tn_1SA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Samuel'
    versification: 'ufw'
    identifier: '2sa'
    sort: 10
    path: './tn_2SA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Kings'
    versification: 'ufw'
    identifier: '1ki'
    sort: 11
    path: './tn_1KI.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Kings'
    versification: 'ufw'
    identifier: '2ki'
    sort: 12
    path: './tn_2KI.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '1 Chronicles'
    versification: 'ufw'
    identifier: '1ch'
    sort: 13
    path: './tn_1CH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: '2 Chronicles'
    versification: 'ufw'
    identifier: '2ch'
    sort: 14
    path: './tn_2CH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezra'
    versification: 'ufw'
    identifier: 'ezr'
    sort: 15
    path: './tn_EZR.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Nehemiah'
    versification: 'ufw'
    identifier: 'neh'
    sort: 16
    path: './tn_NEH.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Esther'
    versification: 'ufw'
    identifier: 'est'
    sort: 17
    path: './tn_EST.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Job'
    versification: 'ufw'
    identifier: 'job'
    sort: 18
    path: './tn_JOB.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Psalms'
    versification: 'ufw'
    identifier: 'psa'
    sort: 19
    path: './tn_PSA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Proverbs'
    versification: 'ufw'
    identifier: 'pro'
    sort: 20
    path: './tn_PRO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ecclesiastes'
    versification: 'ufw'
    identifier: 'ecc'
    sort: 21
    path: './tn_ECC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Song of Solomon'
    versification: 'ufw'
    identifier: 'sng'
    sort: 22
    path: './tn_SNG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Isaiah'
    versification: 'ufw'
    identifier: 'isa'
    sort: 23
    path: './tn_ISA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Jeremiah'
    versification: 'ufw'
    identifier: 'jer'
    sort: 24
    path: './tn_JER.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Lamentations'
    versification: 'ufw'
    identifier: 'lam'
    sort: 25
    path: './tn_LAM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Ezekiel'
    versification: 'ufw'
    identifier: 'ezk'
    sort: 26
    path: './tn_EZK.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Daniel'
    versification: 'ufw'
    identifier: 'dan'
    sort: 27
    path: './tn_DAN.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Hosea'
    versification: 'ufw'
    identifier: 'hos'
    sort: 28
    path: './tn_HOS.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Joel'
    versification: 'ufw'
    identifier: 'jol'
    sort: 29
    path: './tn_JOL.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Amos'
    versification: 'ufw'
    identifier: 'amo'
    sort: 30
    path: './tn_AMO.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Obadiah'
    versification: 'ufw'
    identifier: 'oba'
    sort: 31
    path: './tn_OBA.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Jonah'
    versification: 'ufw'
    identifier: 'jon'
    sort: 32
    path: './tn_JON.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Micah'
    versification: 'ufw'
    identifier: 'mic'
    sort: 33
    path: './tn_MIC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Nahum'
    versification: 'ufw'
    identifier: 'nam'
    sort: 34
    path: './tn_NAM.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Habakkuk'
    versification: 'ufw'
    identifier: 'hab'
    sort: 35
    path: './tn_HAB.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Zephaniah'
    versification: 'ufw'
    identifier: 'zep'
    sort: 36
    path: './tn_ZEP.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Haggai'
    versification: 'ufw'
    identifier: 'hag'
    sort: 37
    path: './tn_HAG.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Zechariah'
    versification: 'ufw'
    identifier: 'zec'
    sort: 38
    path: './tn_ZEC.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Malachi'
    versification: 'ufw'
    identifier: 'mal'
    sort: 39
    path: './tn_MAL.tsv'
    categories: [ 'bible-ot' ]

  -
    title: 'Matthew'
    versification: 'ufw'
    identifier: 'mat'
    sort: 40
    path: './tn_MAT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Mark'
    versification: 'ufw'
    identifier: 'mrk'
    sort: 41
    path: './tn_MRK.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Luke'
    versification: 'ufw'
    identifier: 'luk'
    sort: 42
    path: './tn_LUK.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'John'
    versification: 'ufw'
    identifier: 'jhn'
    sort: 43
    path: './tn_JHN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Acts'
    versification: 'ufw'
    identifier: 'act'
    sort: 44
    path: './tn_ACT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Romans'
    versification: 'ufw'
    identifier: 'rom'
    sort: 45
    path: './tn_ROM.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Corinthians'
    versification: 'ufw'
    identifier: '1co'
    sort: 46
    path: './tn_1CO.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Corinthians'
    versification: 'ufw'
    identifier: '2co'
    sort: 47
    path: './tn_2CO.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Galatians'
    versification: 'ufw'
    identifier: 'gal'
    sort: 48
    path: './tn_GAL.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Ephesians'
    versification: 'ufw'
    identifier: 'eph'
    sort: 49
    path: './tn_EPH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Philippians'
    versification: 'ufw'
    identifier: 'php'
    sort: 50
    path: './tn_PHP.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Colossians'
    versification: 'ufw'
    identifier: 'col'
    sort: 51
    path: './tn_COL.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Thessalonians'
    versification: 'ufw'
    identifier: '1th'
    sort: 52
    path: './tn_1TH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Thessalonians'
    versification: 'ufw'
    identifier: '2th'
    sort: 53
    path: './tn_2TH.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Timothy'
    versification: 'ufw'
    identifier: '1ti'
    sort: 54
    path: './tn_1TI.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Timothy'
    versification: 'ufw'
    identifier: '2ti'
    sort: 55
    path: './tn_2TI.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Titus'
    versification: 'ufw'
    identifier: 'tit'
    sort: 56
    path: './tn_TIT.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Philemon'
    versification: 'ufw'
    identifier: 'phm'
    sort: 57
    path: './tn_PHM.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Hebrews'
    versification: 'ufw'
    identifier: 'heb'
    sort: 58
    path: './tn_HEB.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'James'
    versification: 'ufw'
    identifier: 'jas'
    sort: 59
    path: './tn_JAS.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 Peter'
    versification: 'ufw'
    identifier: '1pe'
    sort: 60
    path: './tn_1PE.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 Peter'
    versification: 'ufw'
    identifier: '2pe'
    sort: 61
    path: './tn_2PE.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '1 John'
    versification: 'ufw'
    identifier: '1jn'
    sort: 62
    path: './tn_1JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '2 John'
    versification: 'ufw'
    identifier: '2jn'
    sort: 63
    path: './tn_2JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: '3 John'
    versification: 'ufw'
    identifier: '3jn'
    sort: 64
    path: './tn_3JN.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Jude'
    versification: 'ufw'
    identifier: 'jud'
    sort: 65
    path: './tn_JUD.tsv'
    categories: [ 'bible-nt' ]

  -
    title: 'Revelation'
    versification: 'ufw'
    identifier: 'rev'
    sort: 66
    path: './tn_REV.tsv'
    categories: [ 'bible-nt' ]
`

const ta_manifest = 
`
---

dublin_core:
  conformsto: 'rc0.2'
  contributor:
  creator: 'Door43 World Missions Community'
  description: 'A modular handbook that provides a condensed explanation of Bible translation and checking principles that the global Church has implicitly affirmed define trustworthy translations. It enables translators to learn how to create trustworthy translations of the Bible in their own language.'
  format: 'text/markdown'
  identifier: 'ta'
  issued: '2020-06-09'
  language:
    identifier: 'en'
    title: 'English'
    direction: 'ltr'
  modified: '2020-06-09'
  publisher: 'unfoldingWord®'
  relation:
    - 'en/ust'
    - 'en/ult'
    - 'en/tn'
    - 'en/tw'
  rights: 'CC BY-SA 4.0'
  source:
    -
      identifier: 'ta'
      language: 'en'
      version: '12'
  subject: 'Translation Academy'
  title: 'unfoldingWord® Translation Academy'
  type: 'man'
  version: '13'

checking:
  checking_entity:
    - 'unfoldingWord®'
  checking_level: '3'

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