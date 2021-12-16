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
    case 'tn_obs':   return obs_tn_manifest;
    case 'obs_sq':   return obs_sq_manifest;
    case 'obs_sn':   return obs_sn_manifest;
  
    default:
      return "no template manifest available for resource type:"+resourceId;
  }
}

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