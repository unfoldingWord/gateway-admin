/*
  Commmon code to run Content Validation process.
*/
import {
  doFetch,
  isServerDisconnected,
} from '@utils/network'
import * as csv from './csvMaker'
import * as cv from 'uw-content-validation'
import * as localforage from '@utils/fetchCache'

export function cvCombine( cv, data ) {
  if (!cv) return
  for(let i=1; i < cv.length; i++) {
    csv.addRow( data, 
      [
        cv[i][0],cv[i][1],cv[i][2],cv[i][3],cv[i][4],cv[i][5],cv[i][6],cv[i][7],cv[i][8],cv[i][9],cv[i][10],cv[i][11]
      ]
    )
  }
}

export async function locateContent(url, authentication) {
  let content = await localforage.sessionStore.getItem(url)
  if ( content !== null ) {
    return content
  }

  let errorCode
  let _errorMessage = null
  let fetchError = true

  // not in cache ... go get it
  try {
    content = await doFetch(url, authentication)
      .then(response => {
        if (response?.status !== 200) {
          errorCode = response?.status
          console.warn(`doFetch - error fetching file,
            status code ${errorCode},
            URL=${url},
            response:`,response)
          fetchError = true
          return null
      }
      fetchError = false
      return response?.data
    })
    if (fetchError) {
      _errorMessage = `Fetch error`
      content = null // just to be sure
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)
    console.warn(`doFetch - error fetching file,
      message '${message}',
      disconnected=${disconnected},
      URL=${url},
      error message:`, 
      e)
    _errorMessage = "Network error"
    content = null
  }
  if ( content ) {
    localforage.sessionStore.setItem(url,content)
  }
  return content
}

// a simple filter to discard certain rows
// returns true to include and false to exclude
function cvFilter(rowData, filename) {
  if ( String(rowData.priority) === '20' ) {
    // discard these since they only state that
    // all linked documents are not being processed
    return false
  }
  if ( (filename.startsWith("tq") || filename.startsWith("sq") )
      && String(rowData.priority) === '119' 
      && String(rowData.fieldName) === 'Quote') {
    // discard - TQ does not use the Quote field
    return false
  }
  // to handle this false error for Spanish
  // Unexpected ¿ character at start of line
  if ( String(rowData.message).startsWith('Unexpected ¿') ) {
    return false
  }
  // to handle this false error for Spanish
  // Unexpected ¡ character at start of line
  if ( String(rowData.message).startsWith('Unexpected ¡') ) {
    return false
  }
  return true
}
 
function processNoticeList( notices, filename, resourceCode ) {
  let hdrs =  ['Filename','Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
  let data = [];
  data.push(hdrs);
  Object.keys(notices).forEach ( key => {
    const rowData = notices[key];
    const includeFlag = cvFilter(rowData, filename)
    if ( includeFlag ) {
      csv.addRow( data, [
        resourceCode,
        filename,
        String(rowData.priority),
        String(rowData.C || ""),
        String(rowData.V || ""),
        String(rowData.lineNumber || ""),
        String(rowData.rowID || ""),
        String(rowData.fieldName || ""),
        String(rowData.characterIndex || ""),
        String(rowData.excerpt || ""),
        String(rowData.message),
        String(rowData.location),
        ])
    }
  });

  return data;
}

function selectCvFunction(resourceCode) {
  let cvFunction
  switch (resourceCode) {
    case 'OBS':
      return cvFunction = cv.checkMarkdownText
    case 'TN9':
      return cvFunction = cv.checkDeprecatedTN_TSV9Table
    case 'TN':
    case 'OBS-TN':
      return cvFunction = cv.checkTN_TSV7Table
    case 'SN':
    case 'OBS-SN':
      return cvFunction = cv.checkSN_TSV7Table
    case 'TQ':
    case 'OBS-TQ':
      return cvFunction = cv.checkTQ_TSV7Table
    case 'SQ':
    case 'OBS-SQ':
      return cvFunction = cv.checkSQ_TSV7Table
    case 'TWL':
    case 'OBS-TWL':
      return cvFunction = cv.checkTWL_TSV6Table
    case 'TA':
      return cvFunction = cv.checkTA_markdownArticle
    case 'TW':
      return cvFunction = cv.checkTW_markdownArticle
    case 'ULT':
    case 'GLT':
    case 'UST':
    case 'GST':
      return cvFunction = cv.checkUSFMText
    default:
      console.log(`Resource Id not yet supported ${resourceCode}.`);
  }
  
}

function getAllResourceCodes() {
  return [
    'OBS',
    'TN9',
    'TN',
    'OBS-TN',
    'SN',
    'OBS-SN',
    'TQ',
    'OBS-TQ',
    'SQ',
    'OBS-SQ',
    'TWL',
    'OBS-TWL',
    'TA',
    'TW',
    'ULT',
    'GLT',
    'UST',
    'GST',
  ]
}

export async function getBpValidationResults(bookId) {
  const book = bookId.toUpperCase()
  let hdrs =  ['ResourceId','Filename','Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
  let data = [];
  data.push(hdrs);

  const resourceTypes = getAllResourceCodes()
  for (let i=0; i<resourceTypes.length; i++) {
    const cvresults = await localforage.sessionStore.getItem(`CV_${resourceTypes[i]}_${book}`)
    cvCombine(cvresults,data)
  }
  return csv.toCSV(data)
}

export async function contentValidate(username, repo, bookID, filename, filecontent) {
  const langId = repo.split("_")[0]
  let resourceCode = repo.split("_")[1].toUpperCase()
  if ( resourceCode === 'TN' && !filename.startsWith('tn_') ) {
    resourceCode = 'TN9'
  }
  const cvFunction = selectCvFunction(resourceCode)
  const usfmCodes = ['GLT', 'GST', 'ULT', 'UST']

  const options = {
    disableAllLinkFetchingFlag : true,
  }

  let nl
  if ( usfmCodes.includes(resourceCode) ) { 
    const rawResults = await cvFunction(username, langId, resourceCode, bookID, filename, filecontent, '', options)
    nl = rawResults.noticeList;
  } else if ( resourceCode === 'OBS' ) {
    const rawResults = await cvFunction(username, langId, resourceCode, filename, filecontent, '', options)
    nl = rawResults.noticeList;
  } else if ( resourceCode === 'TA' || resourceCode === 'TW' ) {
    const rawResults = await cvFunction(username, langId, resourceCode, filename, filecontent, '', options)
    nl = rawResults.noticeList;
  } else {
    const rawResults = await cvFunction(username, langId, bookID, filename, filecontent, options)
    nl = rawResults.noticeList;
  }

  let data = processNoticeList(nl, filename, resourceCode);
  // Store in database too
  localforage.sessionStore.setItem(`CV_${resourceCode}_${bookID}`,data)

  return data;
}

