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
  let errorCode = 0
  let _errorMessage = null
  // sample: https://git.door43.org/unfoldingWord/en_twl/raw/branch/master/twl_1TI.tsv
  let url = `${server}/${owner}/${languageId}_twl/raw/branch/master/twl_${bookId.toUpperCase()}.tsv`
  try {
    const twltsv = await doFetch(url,
      authentication, HTTP_GET_MAX_WAIT_TIME)
      .then(response => {
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`checkTwForBook - error fetching twl file, status code ${errorCode}\nURL=${url}`)
          return null
        }
        return response?.data
    })
    if (twltsv === null) { // if no file
      _errorMessage = "Twl file not found"
      setTwErrorMsg(_errorMessage)
      return null
    } 
    // parse the tsv
    const tsvObject = tsvparser.tsvStringToTable(twltsv);
    const twlTable  = tsvObject.data;
    // the rc link is in the last column
    for (let i=0; i<twlTable.length; i++) {
      let rclink = twlTable[i][5]
      rclink = rclink.replace("rc://*/tw/dict/","")
      rclink += ".md"
      console.log("rclink modded=",rclink)
      const query = `tree | filter path == "${rclink}"`
      console.log("twRepoTree:", twRepoTree)
      const results = mistql.query(query, twRepoTree);
      console.log("mq results",results)
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`checkTwForBook - error fetching twl file, message '${message}', disconnected=${disconnected}`, e)
    //_errorMessage = "Network error fetching"
  }
  return {ErrorMessage: _errorMessage}
}
