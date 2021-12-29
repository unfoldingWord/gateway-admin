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
import { WORKING, OK, SEE_TWL_ERROR, NO_TWL_REPO, SEE_TN_ERROR, NO_TN_REPO } 
from '@common/constants'

import DenseTable from './DenseTable'
import { checkManifestBook } from '@common/manifests'
import { applyIcon } from './iconHelper'

export default function RepoObsValidationCard({
  bookId,
  classes,
  onClose: removeBook,
}) {
  // OBS
  const [obsBookErrorMsg, setObsBookErrorMsg] = useState(null)
  const [obsTnBookErrorMsg, setObsTnBookErrorMsg] = useState(null)
  const [obsTwlBookErrorMsg, setObsTwlBookErrorMsg] = useState(null)
  const [obsTqBookErrorMsg, setObsTqBookErrorMsg] = useState(null)
  const [obsTaErrorMsg, setObsTaErrorMsg] = useState(null)
  const [obsTaMissing, setTaMissing] = useState([])
  const [obsTwErrorMsg, setObsTwErrorMsg] = useState(null)
  const [obsTwMissing, setTwMissing] = useState([])
  const [obsSnBookErrorMsg, setObsSnBookErrorMsg] = useState(null)
  const [obsSqBookErrorMsg, setObsSqBookErrorMsg] = useState(null)

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

  useEffect(() => {
    checkManifestBook(bookId, obsRepoTreeManifest, obsRepoTree, setObsBookErrorMsg)
  }, [bookId, obsRepoTree, obsRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(bookId, obsTnRepoTreeManifest, obsTnRepoTree, setObsTnBookErrorMsg)
  }, [bookId, obsTnRepoTree, obsTnRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(bookId, obsTwlRepoTreeManifest, obsTwlRepoTree, setObsTwlBookErrorMsg)
  }, [bookId, obsTwlRepoTree, obsTwlRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(bookId, obsTqRepoTreeManifest, obsTqRepoTree, setObsTqBookErrorMsg)
  }, [bookId, obsTqRepoTree, obsTqRepoTreeManifest])

  useEffect(() => {
    if ( obsTnBookErrorMsg === null ) {
      return // wait until we know the result
    }

    async function getTaWords() {
      const rc = await checkTaForBook(authentication, bookId, languageId, owner, server, obsTaRepoTree)
      setObsTaErrorMsg(rc.Status ? rc.Status : null)
      if ( rc.Absent.length > 0 ) {
        console.log("bookId, Missing TA:",bookId,rc.Absent)
      } 
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

  useEffect(() => {
    if ( obsTwlBookErrorMsg === null ) {
      return // wait until we know the result
    }

    async function getTwWords() {
      const rc = await checkTwForBook(authentication, bookId, languageId, owner, server, obsTwRepoTree)
      setObsTwErrorMsg(rc.Status ? rc.Status : null)
      if ( rc.Absent.length > 0 ) {
        console.log("bookId, Missing TW:",bookId,rc.Absent)
      } 
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

  useEffect(() => {
    checkManifestBook(bookId, obsSnRepoTreeManifest, obsSnRepoTree, setObsSnBookErrorMsg)
  }, [bookId, obsSnRepoTree, obsSnRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(bookId, obsSqRepoTreeManifest, obsSqRepoTree, setObsSqBookErrorMsg)
  }, [bookId, obsSqRepoTree, obsSqRepoTreeManifest])


  const headers = ["Resource", "Repo", "Status", "Action"]
  const rows = [
    ["Open Bible Stories (OBS)", `${languageId}_obs`, obsRepoTreeStatus || obsBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs`,obsRepoTreeStatus,obsBookErrorMsg, obsRepoTreeManifest, obsManifestSha) 
    ],
    ["OBS Translation Notes", `${languageId}_obs-tn`, obsTnRepoTreeStatus || obsTnBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-tn`,obsTnRepoTreeStatus,obsTnBookErrorMsg, obsTnRepoTreeManifest, obsTnManifestSha) 
    ],
    ["OBS Translation Word List", `${languageId}_obs-twl`, obsTwlRepoTreeStatus || obsTwlBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-twl`,obsTwlRepoTreeStatus,obsTwlBookErrorMsg, obsTwlRepoTreeManifest, obsTwlManifestSha) 
    ],
    ["OBS Translation Questions", `${languageId}_obs-tq`, obsTqRepoTreeStatus || obsTqBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-tq`,obsTqRepoTreeStatus,obsTqBookErrorMsg, obsTqRepoTreeManifest, obsTqManifestSha) 
    ],
    ["OBS Translation Academy", `${languageId}_ta`, obsTaRepoTreeStatus || obsTaErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_ta`,obsTaRepoTreeStatus,obsTaErrorMsg, obsTaRepoTreeManifest, obsTaManifestSha, obsTaMissing) 
    ],
    ["OBS Translation Words", `${languageId}_tw`, obsTwRepoTreeStatus || obsTwErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_tw`,obsTwRepoTreeStatus,obsTwErrorMsg, obsTwRepoTreeManifest, obsTwManifestSha, obsTwMissing) 
    ],
    ["OBS Study Notes", `${languageId}_obs-sn`, obsSnRepoTreeStatus || obsSnBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-sn`,obsSnRepoTreeStatus,obsSnBookErrorMsg, obsSnRepoTreeManifest, obsSnManifestSha) 
    ],
    ["OBS Study Questions", `${languageId}_obs-sq`, obsSqRepoTreeStatus || obsSqBookErrorMsg, 
      applyIcon(server,owner,bookId,refresh,setRefresh,`${languageId}_obs-sq`,obsSqRepoTreeStatus,obsSqBookErrorMsg, obsSqRepoTreeManifest, obsSqManifestSha) 
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

RepoObsValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}

