import mistql from 'mistql'
import {
  HTTP_GET_MAX_WAIT_TIME,
} from '@common/constants'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import * as tsvparser from 'uw-tsv-parser';

export async function checkTwForBook(authentication, bookId, languageId, owner, server, twRepoTree, setTwErrorMsg) {
  console.log("checkTwForBook() bookId:", bookId)
  let errorCode
  let _errorMessage = null
  let _absent = []
  let _present = []
  // sample: https://git.door43.org/unfoldingWord/en_twl/raw/branch/master/twl_1TI.tsv
  let url = `${server}/${owner}/${languageId}_twl/raw/branch/master/twl_${bookId.toUpperCase()}.tsv`
  let twltsv = null
  let fetchError = true
  try {
    twltsv = await doFetch(url, authentication)
      .then(response => {
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`checkTwForBook - error fetching twl file for book ${bookId}, status code ${errorCode}\nURL=${url}`)
          fetchError = true
          return null
        }
        fetchError = false
        return response?.data
    })
    if (fetchError) { // if no file
      _errorMessage = "Network error fetching"
      twltsv = null // just to be sure...
    } 
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`checkTwForBook - error fetching twl file for book ${bookId}, message '${message}', disconnected=${disconnected}`, e)
    _errorMessage = "Network error fetching"
    twltsv = null // just to be sure...
  }
  // parse the tsv
  if ( twltsv ) {
    const tsvObject = tsvparser.tsvStringToTable(twltsv);
    const twlTable  = tsvObject.data;
    // the rc link is in the last column
    for (let i=0; i<twlTable.length; i++) {
      let rclink = twlTable[i][5]
      rclink = rclink.replace("rc://*/tw/dict/","")
      rclink += ".md"
      const query = `@ | filter path == "${rclink}"`
      const results = mistql.query(query, twRepoTree);
      if ( results.length === 0 ) {
        _absent.push(rclink)
      } else {
        _present.push(rclink)
      }
    }
  }
  return {Present: _present, Absent: _absent, ErrorMessage: _errorMessage}
}
