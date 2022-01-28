import { useEffect, useState, useContext } from 'react'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { checkTwForBook, checkTaForBook } from '@utils/checkArticles'
import * as csv from '@utils/csvMaker'
import { WORKING, OK, REPO_NOT_FOUND, FILE_NOT_FOUND, BOOK_NOT_IN_MANIFEST, NO_TWL_REPO, SEE_TWL_ERROR, NO_TN_REPO, SEE_TN_ERROR } 
from '@common/constants'

import DenseTable from './DenseTable'
import { checkManifestBook } from '@common/manifests'
import { applyIcon } from './iconHelper'

export default function RepoValidationCard({
  bookId,
  classes,
  onClose: removeBook,
}) {
  // TW
  const [twErrorMsg, setTwErrorMsg] = useState(WORKING)
  const [twMissing, setTwMissing]   = useState({})
  const [twCv, setTwCv] = useState(null)
  // TA
  const [taErrorMsg, setTaErrorMsg] = useState(WORKING)
  const [taMissing, setTaMissing]   = useState({})
  const [taCv, setTaCv] = useState(null)
  // LT (GLT or ULT)
  const [ltBookErrorMsg, setLtBookErrorMsg] = useState(null)
  const [ltFilename, setLtFilename] = useState(null)
  const [ltCv, setLtCv] = useState(null)
  // ST (GST or UST)
  const [stBookErrorMsg, setStBookErrorMsg] = useState(null)
  const [stFilename, setStFilename] = useState(null)
  const [stCv, setStCv] = useState(null)
  // TN
  const [tnBookErrorMsg, setTnBookErrorMsg] = useState(null)
  const [tnFilename, setTnFilename] = useState(null)
  const [tnCv, setTnCv] = useState(null)
  // TWL
  const [twlBookErrorMsg, setTwlBookErrorMsg] = useState(null)
  const [twlFilename, setTwlFilename] = useState(null)
  const [twlCv, setTwlCv] = useState(null)
  // TQ 
  const [tqBookErrorMsg, setTqBookErrorMsg] = useState(null)
  const [tqFilename, setTqFilename] = useState(null)
  const [tqCv, setTqCv] = useState(null)
  // SQ 
  const [sqBookErrorMsg, setSqBookErrorMsg] = useState(null)
  const [sqFilename, setSqFilename] = useState(null)
  const [sqCv, setSqCv] = useState(null)
  // SN 
  const [snBookErrorMsg, setSnBookErrorMsg] = useState(null)
  const [snFilename, setSnFilename] = useState(null)
  const [snCv, setSnCv] = useState(null)

  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const {
    state: {
      owner,
      server,
      languageId,
    },
  } = useContext(StoreContext)

  const { 
    state: {
      tnRepoTree, 
      tnRepoTreeManifest,
      tnManifestSha,
      tnRepoTreeStatus,
      twlRepoTree,
      twlRepoTreeManifest,
      twlManifestSha,
      twlRepoTreeStatus,
      ltRepoTree,
      ltRepoTreeManifest,
      ltManifestSha,
      ltRepoTreeStatus,
      stRepoTree,
      stRepoTreeManifest,
      stManifestSha,
      stRepoTreeStatus,
      tqRepoTree,
      tqRepoTreeManifest,
      tqManifestSha,
      tqRepoTreeStatus,
      sqRepoTree,
      sqRepoTreeManifest,
      sqManifestSha,
      sqRepoTreeStatus,
      snRepoTree,
      snRepoTreeManifest,
      snManifestSha,
      snRepoTreeStatus,
      taRepoTree,
      taRepoTreeManifest,
      taManifestSha,
      taRepoTreeStatus,
      twRepoTree,
      twRepoTreeManifest,
      twManifestSha,
      twRepoTreeStatus,
      refresh,
    },
    actions: {
      setRefresh,
    }
  } = useContext(AdminContext)

  /*
  -- 
  -- TW
  -- 
  */
  useEffect(() => {
    if ( twlBookErrorMsg === null ) {
      return // wait until we know the result
    }

    async function getTwWords() {
      setTwErrorMsg('Checking TWL')
      const rc = await checkTwForBook(authentication, bookId, languageId, owner, server, twRepoTree)
      setTwErrorMsg(rc.Status ? rc.Status : null)
      const lists = { Present: rc.Present, Absent: rc.Absent}
      if ( rc.Absent.length > 0 ) {
        setTwMissing(lists)
      } 
    }

    // check twl repo first
    if ( twlRepoTreeStatus === WORKING ) {
      return
    }
    // check tw repo first
    if ( twRepoTreeStatus === WORKING ) {
      return
    }
    // OK repo is there as is manifest, but we won't be using the manifest for TW
    // Now check to see if there is twlRepo error
    if ( twlRepoTreeStatus !== null ) {
      setTwErrorMsg(NO_TWL_REPO)
      return
    }
    // OK, now check whether the twl book file is present
    if ( twlBookErrorMsg === OK ) {
      // All looks good... let's get the TWL book file
      // fetch it!
      if (authentication && twRepoTree && twlRepoTree) {
        getTwWords()
      }
    } else {
      setTwErrorMsg(SEE_TWL_ERROR)
    }
  }, [twRepoTree, twRepoTreeStatus, twlRepoTree, twlRepoTreeStatus, twlBookErrorMsg, OK])

  /*
  -- 
  -- TA
  -- 
  */
  useEffect(() => {
    if ( tnBookErrorMsg === null ) {
      return // wait until we know the result
    }

    async function getTaWords() {
      setTaErrorMsg('Checking TA')
      const rc = await checkTaForBook(authentication, bookId, languageId, owner, server, taRepoTree)
      setTaErrorMsg(rc.Status ? rc.Status : null)
      const lists = { Present: rc.Present, Absent: rc.Absent}
      setTaMissing(lists)
    }

    // check tn repo first
    if ( tnRepoTreeStatus === WORKING ) {
      return
    }
    // OK, repo is there as is manifest, but we won't be using the manifest for TA
    // Now check to see if there is tnRepo error
    if ( tnRepoTreeStatus !== null ) {
      setTaErrorMsg(SEE_TN_ERROR)
      return
    }
    // check ta repo to make sure its ready
    if ( taRepoTreeStatus === WORKING ) {
      return
    }
    // OK, now check whether the tn book file is present
    if ( tnBookErrorMsg === OK ) {
      // All looks good... let's get the TWL book file
      // fetch it!
      if (authentication && taRepoTree && tnRepoTree) {
        getTaWords()
      }
    } else {
      setTaErrorMsg(SEE_TN_ERROR)
    }
  }, [taRepoTree, taRepoTreeStatus, tnRepoTree, tnRepoTreeStatus, tnBookErrorMsg, OK])

  /*
  -- 
  -- TN
  -- 
  */
  useEffect(() => {
    checkManifestBook(bookId, tnRepoTreeManifest, tnRepoTree, setTnBookErrorMsg, setTnFilename)
  }, [bookId, tnRepoTree, tnRepoTreeManifest])

  /*
  -- 
  -- TWL
  -- 
  */
  useEffect(() => {
    checkManifestBook(bookId, twlRepoTreeManifest, twlRepoTree, setTwlBookErrorMsg, setTwlFilename)
  }, [bookId, twlRepoTree, twlRepoTreeManifest])

  /*
  -- 
  -- LT (ult or glt)
  -- 
  */
  useEffect(() => {
    checkManifestBook(bookId, ltRepoTreeManifest, ltRepoTree, setLtBookErrorMsg, setLtFilename)
  }, [bookId, ltRepoTree, ltRepoTreeManifest])

  /*
  -- 
  -- ST (ust or gst)
  -- 
  */
  useEffect(() => {
    checkManifestBook(bookId, stRepoTreeManifest, stRepoTree, setStBookErrorMsg, setStFilename)
  }, [bookId, stRepoTree, stRepoTreeManifest])

  /*
  -- 
  -- TQ
  -- 
  */
  useEffect(() => {
    checkManifestBook(bookId, tqRepoTreeManifest, tqRepoTree, setTqBookErrorMsg, setTqFilename)
  }, [bookId, tqRepoTree, tqRepoTreeManifest])

  /*
  -- 
  -- SQ
  -- 
  */
  useEffect(() => {
    checkManifestBook(bookId, sqRepoTreeManifest, sqRepoTree, setSqBookErrorMsg, setSqFilename)
  }, [bookId, sqRepoTree, sqRepoTreeManifest])

  /*
  -- 
  -- SN
  -- 
  */
  useEffect(() => {
    checkManifestBook(bookId, snRepoTreeManifest, snRepoTree, setSnBookErrorMsg, setSnFilename)
  }, [bookId, snRepoTree, snRepoTreeManifest])

  function cvCombine( resourceId, cv, data ) {
    if (!cv) return
    for(let i=1; i < cv.length; i++) {
      csv.addRow( data, 
        [
          resourceId,cv[i][0],cv[i][1],cv[i][2],cv[i][3],cv[i][4],cv[i][5],cv[i][6],cv[i][7],cv[i][8],cv[i][9],cv[i][10]
        ]
      )
    }
  }
  const getAllValidationResults = () => {
    let hdrs =  ['ResourceId','Filename','Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
    let data = [];
    data.push(hdrs);
    cvCombine('TA',taCv,data)
    cvCombine('TW',twCv,data)
    cvCombine('LT',ltCv,data)
    cvCombine('ST',stCv,data)
    cvCombine('TN',tnCv,data)
    cvCombine('TWL',twlCv,data)
    cvCombine('TQ',tqCv,data)
    cvCombine('SQ',sqCv,data)
    cvCombine('SN',snCv,data)
    return csv.toCSV(data)
  }

  let _ltRepo = languageId
  let _stRepo = languageId
  if ( owner === "unfoldingWord" || owner === "unfoldingword" ) {
    _ltRepo += "_ult"
    _stRepo += "_ust"
  } else {
    _ltRepo += "_glt"
    _stRepo += "_gst"
  }
  const headers = ["Resource", "Repo", "Status", "Action"]
  const rows = [
    ["Literal Translation", `${_ltRepo}`, ltRepoTreeStatus || ltBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,_ltRepo,ltRepoTreeStatus,ltBookErrorMsg, ltRepoTreeManifest, ltManifestSha, null, ltFilename, setLtCv, ltCv, getAllValidationResults) 
    ],
    ["Simplified Translation", `${_stRepo}`, stRepoTreeStatus || stBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,_stRepo,stRepoTreeStatus,stBookErrorMsg, stRepoTreeManifest, stManifestSha, null, stFilename, setStCv, stCv, getAllValidationResults) 
    ],
    ["Translation Notes", `${languageId}_tn`, tnRepoTreeStatus || tnBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tn`,tnRepoTreeStatus,tnBookErrorMsg, tnRepoTreeManifest, tnManifestSha, null, tnFilename, setTnCv, tnCv, getAllValidationResults) 
    ],
    ["Translation Word List", `${languageId}_twl`, twlRepoTreeStatus || twlBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_twl`,twlRepoTreeStatus,twlBookErrorMsg, twlRepoTreeManifest, twlManifestSha, null, twlFilename, setTwlCv, twlCv, getAllValidationResults) 
    ],
    ["Translation Words", `${languageId}_tw`, twRepoTreeStatus || twErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tw`,twRepoTreeStatus,twErrorMsg, twRepoTreeManifest, twManifestSha, twMissing, null, setTwCv, twCv, getAllValidationResults) 
    ],
    ["Translation Academy", `${languageId}_ta`, taRepoTreeStatus || taErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_ta`,taRepoTreeStatus,taErrorMsg, taRepoTreeManifest, taManifestSha, taMissing, null, setTaCv, taCv, getAllValidationResults) 
    ],
    ["Translation Questions", `${languageId}_tq`, tqRepoTreeStatus || tqBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tq`,tqRepoTreeStatus,tqBookErrorMsg, tqRepoTreeManifest, tqManifestSha, null, tqFilename, setTqCv, tqCv, getAllValidationResults) 
    ],
    ["Study Questions", `${languageId}_sq`, sqRepoTreeStatus || sqBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_sq`,sqRepoTreeStatus,sqBookErrorMsg, sqRepoTreeManifest, sqManifestSha, null, sqFilename, setSqCv, sqCv, getAllValidationResults) 
    ],
    ["Study Notes", `${languageId}_sn`, snRepoTreeStatus || snBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_sn`,snRepoTreeStatus,snBookErrorMsg, snRepoTreeManifest, snManifestSha, null, snFilename, setSnCv, snCv, getAllValidationResults) 
    ],
  ]

  return (
    <Card title={BIBLE_AND_OBS[bookId]} 
      classes={classes} 
      hideMarkdownToggle={true} 
      closeable={true}
      onClose={() => removeBook(bookId)}
    >
      <TreeView aria-label="RepoCardView"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        <TreeItem nodeId="1" label="Resources">
          <DenseTable cols={headers} rows={rows} />
        </TreeItem>
      </TreeView>
    </Card>
  )
}

RepoValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}

