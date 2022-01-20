/*
  Commmon code to run Content Validation process.
*/
import * as csv from './csvMaker'
import * as cv from 'uw-content-validation'
 
function processNoticeList( notices ) {
  let hdrs =  ['Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
  let data = [];
  data.push(hdrs);
  Object.keys(notices).forEach ( key => {
    const rowData = notices[key];
    csv.addRow( data, [
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
  });

  return data;
}

function selectCvFunction(resourceCode) {
  let cvFunction
  switch (resourceCode) {
    case 'TN':
      return cvFunction = cv.checkDeprecatedTN_TSV9Table
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
    default:
      console.log(`Resource Id not yet supported ${resourceCode}.`);
  }
  
}

export async function contentValidate(username, repo, bookID, filename, filecontent) {
  const langId = repo.split("_")[0]
  const resourceCode = repo.split("_")[1].toUpperCase()
  const cvFunction = selectCvFunction(resourceCode)
  const usfmCodes = ['GLT', 'GST', 'ULT', 'UST']

  const options = {
    disableAllLinkFetchingFlag : true,
  }
  console.log("langId, resourceCode=",langId, resourceCode)
  let nl
  if ( usfmCodes.includes(resourceCode) ) { 
    console.log("CV for USFM:",resourceCode)
    const rawResults = await cv.checkUSFMText(username, langId, resourceCode, bookID, filename, filecontent, '', options);
    nl = rawResults.noticeList;
  } else {
    const rawResults = await cvFunction(username, langId, bookID, filename, filecontent, options)
    nl = rawResults.noticeList;
  }

  let data = processNoticeList(nl);
  return data;
}

/*
 const rawResults = await checkUSFMText(username, languageCode, repoCode, bookID, filename, USFMText, givenLocation, checkingOptions);
*/