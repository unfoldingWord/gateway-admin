import { useEffect, useState, useContext } from 'react'

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
import { WORKING, OK, NO_TWL_REPO, SEE_TWL_ERROR, SEE_TN_ERROR, RETRIEVING, VALIDATION_FINISHED, TQ, SQ, SN, TN, TWL, LT, ST }
from '@common/constants'

import DenseTable from './DenseTable'
import { checkManifestBook } from '@common/manifests'
import { applyIcon } from './iconHelper'
import { cvCombine } from '@utils/contentValidation'

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

    // no need to re-evaluate TW articles when twl is validating
    if ( twlBookErrorMsg === RETRIEVING || twlBookErrorMsg === VALIDATION_FINISHED ) {
      return
    }

    async function getTwWords() {
      setTwErrorMsg(WORKING)
      const rc = await checkTwForBook(authentication, bookId, languageId, owner, server, twRepoTree)
      setTwErrorMsg(rc.Status ? rc.Status : null)
      const lists = { Present: rc.Present, Absent: rc.Absent}
      setTwMissing(lists)
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

    // no need to re-evaluate TA articles when TN is being validated
    if ( tnBookErrorMsg === VALIDATION_FINISHED || tnBookErrorMsg === RETRIEVING ) {
      return
    }

    async function getTaWords() {
      setTaErrorMsg(WORKING)
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
    checkManifestBook(bookId, tnRepoTreeManifest, tnRepoTree, setTnBookErrorMsg, setTnFilename, TN)
  }, [bookId, tnRepoTree, tnRepoTreeManifest])

  /*
  --
  -- TWL
  --
  */
  useEffect(() => {
    checkManifestBook(bookId, twlRepoTreeManifest, twlRepoTree, setTwlBookErrorMsg, setTwlFilename, TWL)
  }, [bookId, twlRepoTree, twlRepoTreeManifest])

  /*
  --
  -- LT (ult or glt)
  --
  */
  useEffect(() => {
    checkManifestBook(bookId, ltRepoTreeManifest, ltRepoTree, setLtBookErrorMsg, setLtFilename, LT)
  }, [bookId, ltRepoTree, ltRepoTreeManifest])

  /*
  --
  -- ST (ust or gst)
  --
  */
  useEffect(() => {
    checkManifestBook(bookId, stRepoTreeManifest, stRepoTree, setStBookErrorMsg, setStFilename, ST)
  }, [bookId, stRepoTree, stRepoTreeManifest])

  /*
  --
  -- TQ
  --
  */
  useEffect(() => {
    checkManifestBook(bookId, tqRepoTreeManifest, tqRepoTree, setTqBookErrorMsg, setTqFilename, TQ)
  }, [bookId, tqRepoTree, tqRepoTreeManifest])

  /*
  --
  -- SQ
  --
  */
  useEffect(() => {
    checkManifestBook(bookId, sqRepoTreeManifest, sqRepoTree, setSqBookErrorMsg, setSqFilename, SQ)
  }, [bookId, sqRepoTree, sqRepoTreeManifest])

  /*
  --
  -- SN
  --
  */
  useEffect(() => {
    checkManifestBook(bookId, snRepoTreeManifest, snRepoTree, setSnBookErrorMsg, setSnFilename, SN)
  }, [bookId, snRepoTree, snRepoTreeManifest])

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
  const literalTranslation = "Literal Translation"
  const simplifiedTranslation = "Simplified Translation"
  const rows = [
    [literalTranslation, `${_ltRepo}`, ltRepoTreeStatus || ltBookErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,_ltRepo,ltRepoTreeStatus,ltBookErrorMsg, ltRepoTreeManifest, ltManifestSha,
        null, ltFilename, setLtCv, ltCv, setLtBookErrorMsg, literalTranslation,
      )
    ],
    [simplifiedTranslation, `${_stRepo}`, stRepoTreeStatus || stBookErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,_stRepo,stRepoTreeStatus,stBookErrorMsg, stRepoTreeManifest, stManifestSha,
        null, stFilename, setStCv, stCv, setStBookErrorMsg, simplifiedTranslation,
      )
    ],
    ["Translation Notes", `${languageId}_tn`, tnRepoTreeStatus || tnBookErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tn`,tnRepoTreeStatus,tnBookErrorMsg, tnRepoTreeManifest, tnManifestSha,
        null, tnFilename, setTnCv, tnCv, setTnBookErrorMsg,
      )
    ],
    ["Translation Word List", `${languageId}_twl`, twlRepoTreeStatus || twlBookErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_twl`,twlRepoTreeStatus,twlBookErrorMsg, twlRepoTreeManifest, twlManifestSha,
        null, twlFilename, setTwlCv, twlCv, setTwlBookErrorMsg,
      )
    ],
    ["Translation Words", `${languageId}_tw`, twRepoTreeStatus || twErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tw`,twRepoTreeStatus,twErrorMsg, twRepoTreeManifest, twManifestSha, twMissing,
        null, setTwCv, twCv, setTwErrorMsg,
      )
    ],
    ["Translation Academy", `${languageId}_ta`, taRepoTreeStatus || taErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_ta`,taRepoTreeStatus,taErrorMsg, taRepoTreeManifest, taManifestSha, taMissing,
        null, setTaCv, taCv, setTaErrorMsg,
      )
    ],
    ["Translation Questions", `${languageId}_tq`, tqRepoTreeStatus || tqBookErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tq`,tqRepoTreeStatus,tqBookErrorMsg, tqRepoTreeManifest, tqManifestSha,
        null, tqFilename, setTqCv, tqCv, setTqBookErrorMsg,
      )
    ],
    ["Study Questions", `${languageId}_sq`, sqRepoTreeStatus || sqBookErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_sq`,sqRepoTreeStatus,sqBookErrorMsg, sqRepoTreeManifest, sqManifestSha,
        null, sqFilename, setSqCv, sqCv, setSqBookErrorMsg,
      )
    ],
    ["Study Notes", `${languageId}_sn`, snRepoTreeStatus || snBookErrorMsg,
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_sn`,snRepoTreeStatus,snBookErrorMsg, snRepoTreeManifest, snManifestSha,
        null, snFilename, setSnCv, snCv, setSnBookErrorMsg,
      )
    ],
  ]

  return (
    <Card title={BIBLE_AND_OBS[bookId]}
      classes={classes}
      hideMarkdownToggle={true}
      closeable={true}
      onClose={() => removeBook(bookId)}
      key={bookId}
    >
      <DenseTable cols={headers} rows={rows} />
    </Card>
  )
}

RepoValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}

