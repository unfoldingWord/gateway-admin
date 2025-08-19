import mistql from 'mistql'
import {
  HTTP_GET_MAX_WAIT_TIME, OBS,
} from '@common/constants'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import * as tsvparser from 'uw-tsv-parser'
import { OK, USE_NEW_TN_FORMAT, ALL_PRESENT } from '@common/constants'
import { TN_FILENAMES, OBS_FILENAMES } from '@common/BooksOfTheBible'

export async function checkTwForBook(authentication, bookId, languageId, owner, server, twRepoTree) {
  let errorCode
  let _errorMessage = null
  let _absent = []
  let _present = []
  let processed = []
  // sample: https://git.door43.org/unfoldingWord/en_twl/raw/branch/master/twl_1TI.tsv
  let url = `${server}/${owner}/${languageId}_twl/raw/branch/master/twl_${bookId.toUpperCase()}.tsv`
  if (bookId === 'obs') {
    url = `${server}/${owner}/${languageId}_obs-twl/raw/branch/master/twl_OBS.tsv`
  }
  let twltsv = null
  let fetchError = true
  try {
    twltsv = await doFetch(url, authentication)
      .then(response => {
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`checkTwForBook - error fetching twl file for book ${bookId},
            status code ${errorCode},
            URL=${url},
            response:`, response)
          fetchError = true
          return null
        }
        fetchError = false
        return response?.data
      })
    if (fetchError) { // if no file
      _errorMessage = `Fetch error`
      twltsv = null // just to be sure...
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`checkTwForBook - error fetching twl file for book ${bookId},
      message '${message}',
      disconnected=${disconnected},
      URL=${url},
      error message:`,
      e)
    _errorMessage = "Network error"
    twltsv = null // just to be sure...
  }
  // parse the tsv
  if (twltsv) {
    const tsvObject = tsvparser.tsvStringToTable(twltsv);
    const twlTable = tsvObject.data;
    // the rc link is in the last column
    for (let i = 0; i < twlTable.length; i++) {
      let rclink = twlTable[i][5]
      if (processed.includes(rclink)) { continue }
      processed.push(rclink)
      rclink = rclink.replace("rc://*/tw/dict/", "")
      rclink += ".md"
      let results
      if (rclink.startsWith("rc")) {
        // not a TA rc link!
        console.warn("malformed rc link to TW:", rclink)
        _absent.push(rclink)
      } else {
        const query = `@ | filter path == "${rclink}"`
        results = mistql.query(query, twRepoTree);
        if (results.length === 0) {
          _absent.push(rclink)
        } else {
          _present.push(rclink)
        }
      }
    }
    if (_absent.length > 0) {
      _errorMessage = `${_absent.length} Missing`
    } else {
      _errorMessage = ALL_PRESENT
    }
  }
  return { Book: bookId, Present: _present, Absent: _absent, Status: _errorMessage }
}

export async function checkTaForBook(authentication, bookId, languageId, owner, server, taRepoTree) {
  let errorCode
  let _errorMessage = null
  let _absent = []
  let _present = []
  let processed = []
  let tnBranch
  let tnFilename
  let tnColumn
  if (bookId.toUpperCase() === 'OBS') {
    tnBranch = "master"
    tnFilename = `tn_${bookId.toUpperCase()}.tsv`
    tnColumn = 3
  } else if (USE_NEW_TN_FORMAT) {
    // tnBranch = "newFormat"
    tnBranch = "master"
    tnFilename = `tn_${bookId.toUpperCase()}.tsv`
    tnColumn = 3
  } else {
    tnBranch = "master"
    tnFilename = `${languageId}${TN_FILENAMES[bookId]}.tsv`
    tnColumn = 4
  }

  // sample: https://git.door43.org/unfoldingWord/en_tn/raw/branch/master/twl_1TI.tsv
  let url = `${server}/${owner}/${languageId}_tn/raw/branch/${tnBranch}/${tnFilename}`
  if (bookId === 'obs') {
    url = `${server}/${owner}/${languageId}_obs-tn/raw/branch/master/tn_OBS.tsv`
  }
  let tntsv = null
  let fetchError = true
  try {
    tntsv = await doFetch(url, authentication)
      .then(response => {
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`checkTaForBook - error fetching tn file for book ${bookId},
            status code ${errorCode},
            URL=${url},
            response:`, response)
          fetchError = true
          return null
        }
        fetchError = false
        return response?.data
      })
    if (fetchError) { // if no file
      _errorMessage = `Fetch error`
      tntsv = null // just to be sure...
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`checkTaForBook - error fetching tn file for book ${bookId},
      message '${message}',
      disconnected=${disconnected},
      URL=${url},
      error message:`,
      e)
    _errorMessage = "Network error"
    tntsv = null // just to be sure...
  }
  // parse the tsv
  if (tntsv) {
    const tsvObject = tsvparser.tsvStringToTable(tntsv);
    const tnTable = tsvObject.data;
    // the rc in in column 3 for the 7 column format (zero based)
    // and in column 4 for the 9 column format. 
    // Note that in 9 the value is not an rc link, but just the bare articel name
    for (let i = 0; i < tnTable.length; i++) {
      let rclink = tnTable[i][tnColumn]?.trim() || ""
      if (rclink === "") { continue }
      if (processed.includes(rclink)) { continue }
      processed.push(rclink)
      let _rclink = rclink.replace("rc://*/ta/man/", "")
      let results
      if (_rclink.startsWith("rc")) {
        // not a TA rc link!
        console.warn("malformed rc link to TA:", _rclink)
        _absent.push(_rclink)
      } else {
        if (_rclink.startsWith("translate/")) {
          // do nothing... already there
        } else {
          _rclink = "translate/" + _rclink
        }
        const query = `@ | filter path == "${_rclink}"`
        results = mistql.query(query, taRepoTree);
        if (results.length === 0) {
          _absent.push(_rclink)
        } else {
          _present.push(_rclink)
        }
      }
    }
    if (_absent.length > 0) {
      _errorMessage = `${_absent.length} Missing`
    } else {
      _errorMessage = ALL_PRESENT
    }
  }
  return { Book: bookId, Present: _present, Absent: _absent, Status: _errorMessage }
}

export async function checkObsForFiles(authentication, languageId, owner, server) {
  let errorCode
  let _errorMessage = null
  let _absent = []
  let _present = []
  let _content = {}

  // sample: https://git.door43.org/unfoldingWord/en_obs/raw/branch/master/content/01.md
  const baseUrl = `${server}/${owner}/${languageId}_obs/raw/branch/master/content/`
  const keys = Object.keys(OBS_FILENAMES)
  for (let i = 0; i < keys.length; i++) {
    // using key to form full url to obs filename
    const fpath = OBS_FILENAMES[keys[i]]
    const url = baseUrl + fpath
    // fetch it
    let fetchError = true
    let obsfile = null
    try {
      obsfile = await doFetch(url, authentication)
        .then(response => {
          if (response?.status !== 200) {
            errorCode = response?.status
            console.warn(`checkObsForFiles - error fetching ${fpath},
              status code ${errorCode},
              URL=${url},
              response:`, response)
            fetchError = true
            return null
          }
          fetchError = false
          return response?.data
        })
      if (fetchError) { // if no file
        _errorMessage = `Fetch error`
        obsfile = null // just to be sure...
      }
    } catch (e) {
      const message = e?.message
      const disconnected = isServerDisconnected(e)
      console.warn(`checkObsForFiles - error fetching ${fpath},
        message '${message}',
        disconnected=${disconnected},
        URL=${url},
        error message:`,
        e)
      _errorMessage = "Network error"
      obsfile = null // just to be sure...
    }
    if (fetchError) {
      _absent.push(fpath)
    } else {
      _present.push(fpath)
      _content[fpath] = obsfile
    }

  }


  if (_absent.length > 0) {
    _errorMessage = `${_absent.length} Missing`
  } else {
    _errorMessage = ALL_PRESENT
  }
  return {
    Book: "OBS",
    Present: _present,
    Absent: _absent,
    Status: _errorMessage,
    Content: _content,
  }
}

export async function checkObsDocs(obsRepoTree) {
  let _errorMessage = null
  let _absent = []
  let _present = []

  const obsfiles = Object.keys(OBS_FILENAMES);
  for (let i = 0; i < obsfiles.length; i++) {
    const obspath = "content/" + OBS_FILENAMES[obsfiles[i]]
    const query = `@ | filter path == "${obspath}"`
    let results = mistql.query(query, obsRepoTree);
    if (results.length === 0) {
      _absent.push(obspath)
    } else {
      _present.push(obspath)
    }
  }
  if (_absent.length > 0) {
    _errorMessage = `${_absent.length} Missing`
  } else {
    _errorMessage = ALL_PRESENT
  }
  return { Book: 'obs', Present: _present, Absent: _absent, Status: _errorMessage }
}
