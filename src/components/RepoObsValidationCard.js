import { useEffect, useState, useContext } from 'react'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import React from 'react';
import { checkTwForBook, checkTaForBook, checkObsForFiles } from '@utils/checkArticles'
import { WORKING, OK, SEE_TWL_ERROR, NO_TWL_REPO, SEE_TN_ERROR, NO_TN_REPO, RETRIEVING, VALIDATION_FINISHED } 
from '@common/constants'
import * as csv from '@utils/csvMaker'

import DenseTable from './DenseTable'
import { checkManifestBook } from '@common/manifests'
import { applyIcon } from './iconHelper'
import { cvCombine } from '@utils/contentValidation'

export default function RepoObsValidationCard({
  bookId,
  classes,
  onClose: removeBook,
}) {
  // OBS
  const [obsBookErrorMsg, setObsBookErrorMsg] = useState(null)
  const [obsMissing, setObsMissing] = useState({})
  const [obsCv, setObsCv] = useState(null)
  // obs tw
  const [obsTwErrorMsg, setObsTwErrorMsg] = useState(null)
  const [obsTwMissing, setObsTwMissing] = useState({})
  const [obsTwCv, setObsTwCv] = useState(null)
  // obs ta
  const [obsTaErrorMsg, setObsTaErrorMsg] = useState(null)
  const [obsTaMissing, setObsTaMissing] = useState({})
  const [obsTaCv, setObsTaCv] = useState(null)
  // obs tn
  const [obsTnBookErrorMsg, setObsTnBookErrorMsg] = useState(null)
  const [obsTnCv, setObsTnCv] = useState(null)
  // obs twl
  const [obsTwlBookErrorMsg, setObsTwlBookErrorMsg] = useState(null)
  const [obsTwlCv, setObsTwlCv] = useState(null)
  // obs tq
  const [obsTqBookErrorMsg, setObsTqBookErrorMsg] = useState(null)
  const [obsTqCv, setObsTqCv] = useState(null)
  // obs sq
  const [obsSqBookErrorMsg, setObsSqBookErrorMsg] = useState(null)
  const [obsSqCv, setObsSqCv] = useState(null)
  // obs sn
  const [obsSnBookErrorMsg, setObsSnBookErrorMsg] = useState(null)
  const [obsSnCv, setObsSnCv] = useState(null)

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
      obsRepoTree, 
      obsRepoTreeManifest,
      obsManifestSha,
      obsRepoTreeStatus,
      obsTnRepoTree,
      obsTnRepoTreeManifest,
      obsTnManifestSha,
      obsTnRepoTreeStatus,
      obsTwlRepoTree,
      obsTwlRepoTreeManifest,
      obsTwlManifestSha,
      obsTwlRepoTreeStatus,
      obsTqRepoTree,
      obsTqRepoTreeManifest,
      obsTqManifestSha,
      obsTqRepoTreeStatus,
      obsTaRepoTree,
      obsTaRepoTreeManifest,
      obsTaManifestSha,
      obsTaRepoTreeStatus,
      obsTwRepoTree,
      obsTwRepoTreeManifest,
      obsTwManifestSha,
      obsTwRepoTreeStatus,
      obsSnRepoTree,
      obsSnRepoTreeManifest,
      obsSnManifestSha,
      obsSnRepoTreeStatus,
      obsSqRepoTree,
      obsSqRepoTreeManifest,
      obsSqManifestSha,
      obsSqRepoTreeStatus,
      refresh,
    },
    actions: {
      setRefresh,
    }
  } = useContext(AdminContext)

  /*
  -- OBS (50+ files)
  */
  useEffect(() => {
    // check manifiest first
    checkManifestBook(bookId, obsRepoTreeManifest, obsRepoTree, setObsBookErrorMsg)
  }, [bookId, obsRepoTree, obsRepoTreeManifest])
  /*
  -- OBS: if manifest OK, then check on the files
  -- Note that the below useEffect() is sort of chained to the above.
     The above sets the obs status and the below watches for it.
  */
  useEffect(() => {
        
    async function checkObs() {
      setObsBookErrorMsg(RETRIEVING)
      const rc = await checkObsForFiles(authentication, languageId, owner, server)
      setObsBookErrorMsg(rc.Status)
      // observe that obs files are retrieved and are in the Content
      const lists = { 
        Present: rc.Present, 
        Absent: rc.Absent, 
        Content: rc.Content,
        Status: rc.Status,
      }
      setObsMissing(lists)
    }

    if ( obsBookErrorMsg === OK ) {
      // If manifest ok, then check the files next
      checkObs()
    }

  }, [obsBookErrorMsg, OK])

  /*
  -- OBS TN
  */
  useEffect(() => {
    checkManifestBook(bookId, obsTnRepoTreeManifest, obsTnRepoTree, setObsTnBookErrorMsg)
  }, [bookId, obsTnRepoTree, obsTnRepoTreeManifest])

  /*
  -- OBS TWL
  */
  useEffect(() => {
    checkManifestBook(bookId, obsTwlRepoTreeManifest, obsTwlRepoTree, setObsTwlBookErrorMsg)
  }, [bookId, obsTwlRepoTree, obsTwlRepoTreeManifest])

  /*
  -- OBS TQ
  */
  useEffect(() => {
    checkManifestBook(bookId, obsTqRepoTreeManifest, obsTqRepoTree, setObsTqBookErrorMsg)
  }, [bookId, obsTqRepoTree, obsTqRepoTreeManifest])

  /*
  -- OBS TA
  */
  useEffect(() => {
    if ( obsTnBookErrorMsg === null ) {
      return // wait until we know the result
    }

    // no need to update existence checks when TN is being validated
    if ( obsTnBookErrorMsg === RETRIEVING || obsTnBookErrorMsg === VALIDATION_FINISHED ) {
      return
    }

    async function getTaWords() {
      const rc = await checkTaForBook(authentication, bookId, languageId, owner, server, obsTaRepoTree)
      setObsTaErrorMsg(rc.Status ? rc.Status : null)
      const lists = { Present: rc.Present, Absent: rc.Absent}
      setObsTaMissing(lists)
    }

    // check tn repo first
    if ( obsTnRepoTreeStatus === WORKING ) {
      return
    }
    // check ta repo first
    if ( obsTaRepoTreeStatus === WORKING ) {
      return
    }
    // OK, repo is there as is manifest, but we won't be using the manifest for TA
    // Now check to see if there is twlRepo error
    if ( obsTnRepoTreeStatus !== null ) {
      setObsTaErrorMsg(NO_TN_REPO)
      return
    }
    // OK, now check whether the tn book file is present
    if ( obsTnBookErrorMsg === OK ) {
      // All looks good... let's get the TN book file
      // fetch it!
      if (authentication && obsTaRepoTree && obsTnRepoTree) {
        getTaWords()
      }
    } else {
      setObsTaErrorMsg(SEE_TN_ERROR)
    }
  }, [obsTaRepoTree, obsTaRepoTreeStatus, obsTnRepoTree, obsTnRepoTreeStatus, obsTnBookErrorMsg, OK])

  /*
  -- OBS TW
  */
  useEffect(() => {
    if ( obsTwlBookErrorMsg === null ) {
      return // wait until we know the result
    }

    // no need to re-evaluate TW article existence while TWL is being validated
    if ( obsTwlBookErrorMsg === RETRIEVING || obsTwlBookErrorMsg === VALIDATION_FINISHED ) {
      return
    }

    async function getTwWords() {
      const rc = await checkTwForBook(authentication, bookId, languageId, owner, server, obsTwRepoTree)
      setObsTwErrorMsg(rc.Status ? rc.Status : null)
      const lists = { Present: rc.Present, Absent: rc.Absent}
      setObsTwMissing(lists)
    }

    // check twl repo first
    if ( obsTwlRepoTreeStatus === WORKING ) {
      return
    }
    // check tw repo first
    if ( obsTwRepoTreeStatus === WORKING ) {
      return
    }
    // OK repo is there as is manifest, but we won't be using the manifest for TW
    // Now check to see if there is twlRepo error
    if ( obsTwlRepoTreeStatus !== null ) {
      setObsTwErrorMsg(NO_TWL_REPO)
      return
    }
    // OK, now check whether the twl book file is present
    if ( obsTwlBookErrorMsg === OK ) {
      // All looks good... let's get the TWL book file
      // fetch it!
      if (authentication && obsTwRepoTree && obsTwlRepoTree) {
        getTwWords()
      }
    } else {
      setObsTwErrorMsg(SEE_TWL_ERROR)
    }
  }, [obsTwRepoTree, obsTwRepoTreeStatus, obsTwlRepoTree, obsTwlRepoTreeStatus, obsTwlBookErrorMsg, OK])

  /*
  -- OBS SN
  */
  useEffect(() => {
    checkManifestBook(bookId, obsSnRepoTreeManifest, obsSnRepoTree, setObsSnBookErrorMsg)
  }, [bookId, obsSnRepoTree, obsSnRepoTreeManifest])

  /*
  -- OBS SQ
  */
  useEffect(() => {
    checkManifestBook(bookId, obsSqRepoTreeManifest, obsSqRepoTree, setObsSqBookErrorMsg)
  }, [bookId, obsSqRepoTree, obsSqRepoTreeManifest])

  const getAllValidationResults = () => {
    let hdrs =  ['ResourceId','Filename','Priority','Chapter','Verse','Line','Row ID','Details','Char Pos','Excerpt','Message','Location'];
    let data = [];
    data.push(hdrs);
    cvCombine('OBS',obsCv,data)
    cvCombine('OBS-TN',obsTnCv,data)
    cvCombine('OBS-TWL',obsTwlCv,data)
    cvCombine('OBS-TQ',obsTqCv,data)
    cvCombine('OBS-SQ',obsSqCv,data)
    cvCombine('OBS-SN',obsSnCv,data)
    return csv.toCSV(data)
  }

  const headers = ["Resource", "Repo", "Status", "Action"]
  const rows = [
    ["Open Bible Stories (OBS)", `${languageId}_obs`, obsRepoTreeStatus || obsBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs`,obsRepoTreeStatus,obsBookErrorMsg, obsRepoTreeManifest, obsManifestSha, 
        obsMissing, null, setObsCv, obsCv, getAllValidationResults, setObsBookErrorMsg,
      ) 
    ],
    ["OBS Translation Notes", `${languageId}_obs-tn`, obsTnRepoTreeStatus || obsTnBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-tn`,obsTnRepoTreeStatus,obsTnBookErrorMsg, obsTnRepoTreeManifest, obsTnManifestSha, 
        null, 'tn_OBS.tsv', setObsTnCv, obsTnCv, getAllValidationResults, setObsTnBookErrorMsg,
      ) 
    ],
    ["OBS Translation Word List", `${languageId}_obs-twl`, obsTwlRepoTreeStatus || obsTwlBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-twl`,obsTwlRepoTreeStatus,obsTwlBookErrorMsg, obsTwlRepoTreeManifest, obsTwlManifestSha, 
        null, 'twl_OBS.tsv', setObsTwlCv, obsTwlCv, getAllValidationResults, setObsTwlBookErrorMsg,
      ) 
    ],
    ["OBS Translation Questions", `${languageId}_obs-tq`, obsTqRepoTreeStatus || obsTqBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-tq`,obsTqRepoTreeStatus,obsTqBookErrorMsg, obsTqRepoTreeManifest, obsTqManifestSha, 
        null, 'tq_OBS.tsv', setObsTqCv, obsTqCv, getAllValidationResults, setObsTqBookErrorMsg,
      ) 
    ],
    ["OBS Translation Academy", `${languageId}_ta`, obsTaRepoTreeStatus || obsTaErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_ta`,obsTaRepoTreeStatus,obsTaErrorMsg, obsTaRepoTreeManifest, obsTaManifestSha, obsTaMissing, 
        null, setObsTaCv, obsTaCv, getAllValidationResults, setObsTaErrorMsg
      ) 
    ],
    ["OBS Translation Words", `${languageId}_tw`, obsTwRepoTreeStatus || obsTwErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tw`,obsTwRepoTreeStatus,obsTwErrorMsg, obsTwRepoTreeManifest, obsTwManifestSha, obsTwMissing, 
        null, setObsTwCv, obsTwCv, getAllValidationResults, setObsTwErrorMsg,
      ) 
    ],
    ["OBS Study Notes", `${languageId}_obs-sn`, obsSnRepoTreeStatus || obsSnBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-sn`,obsSnRepoTreeStatus,obsSnBookErrorMsg, obsSnRepoTreeManifest, obsSnManifestSha, 
        null, 'sn_OBS.tsv', setObsSnCv, obsSnCv, getAllValidationResults, setObsSnBookErrorMsg,
      ) 
    ],
    ["OBS Study Questions", `${languageId}_obs-sq`, obsSqRepoTreeStatus || obsSqBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-sq`,obsSqRepoTreeStatus,obsSqBookErrorMsg, obsSqRepoTreeManifest, obsSqManifestSha, 
        null, 'sq_OBS.tsv', setObsSqCv, obsSqCv, getAllValidationResults, setObsSqBookErrorMsg,
      ) 
    ],
  ]

  return (
    <Card title={BIBLE_AND_OBS[bookId]} 
      classes={classes} 
      hideMarkdownToggle={true} 
      closeable={true}
      onClose={() => removeBook(bookId)}
    >
      <DenseTable cols={headers} rows={rows} />
    </Card>
  )
}

RepoObsValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}

/*
*/