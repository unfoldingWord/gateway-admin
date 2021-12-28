import { useEffect, useState, useContext } from 'react'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import React from 'react';
//import { makeStyles } from '@material-ui/core/styles';
import { checkTwForBook, checkTaForBook } from '@utils/checkArticles'
import { WORKING, OK, REPO_NOT_FOUND, FILE_NOT_FOUND, BOOK_NOT_IN_MANIFEST, NO_TWL_REPO, SEE_TWL_ERROR, NO_TN_REPO, SEE_TN_ERROR } from '@common/constants'

import CreateIcon from '@material-ui/icons/Create'
import DoneIcon from '@material-ui/icons/Done'
import VisibilityIcon from '@material-ui/icons/Visibility'

import CreateRepoButton from './CreateRepoButton'
import AddBookToManifest from './AddBookToManifest'
import DenseTable from './DenseTable'
import ViewListButton from './ViewListButton'

export default function RepoValidationCard({
  bookId,
  classes,
  onClose: removeBook,
}) {
  // TN
  const [tnBookErrorMsg, setTnBookErrorMsg] = useState(null)
  // TWL
  const [twlBookErrorMsg, setTwlBookErrorMsg] = useState(null)
  // TW
  const [twErrorMsg, setTwErrorMsg] = useState(WORKING)
  const [twMissing, setTwMissing]   = useState([])
  // TA
  const [taErrorMsg, setTaErrorMsg] = useState(WORKING)
  const [taMissing, setTaMissing]   = useState([])
  // LT (GLT or ULT)
  const [ltBookErrorMsg, setLtBookErrorMsg] = useState(null)
  // ST (GST or UST)
  const [stBookErrorMsg, setStBookErrorMsg] = useState(null)
  // TQ 
  const [tqBookErrorMsg, setTqBookErrorMsg] = useState(null)
  // SQ 
  const [sqBookErrorMsg, setSqBookErrorMsg] = useState(null)
  // TQ 
  const [snBookErrorMsg, setSnBookErrorMsg] = useState(null)

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

  function checkManifestBook(manifest, repoTree, setError) {
    let projects = []
    if (manifest && manifest.projects) {
      projects = manifest.projects
    } else {
      return
    }
    let isBookIdInManfest = false
    let pathToBook;
    for (let i=0; i < projects.length; i++) {
      if ( projects[i]?.identifier === bookId ) {
        isBookIdInManfest = true
        pathToBook = projects[i].path
        break
      }
    }

    // if project id exists, then does the file actually exist?
    if ( isBookIdInManfest ) {
      let _fileExists = false
      for (let i=0; i < repoTree.length; i++) {
        let _path = repoTree[i].path
        let _manifestpath = pathToBook.replace(/^\.\//,'')
        if ( _manifestpath === _path ) {
          _fileExists = true
          break
        }
      }
      if ( _fileExists ) {
        setError(OK)
      } else {
        setError(FILE_NOT_FOUND)
      }
    } else {
      setError(BOOK_NOT_IN_MANIFEST)
    }
  }

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
      setTwErrorMsg('Checking TW list')
      const rc = await checkTwForBook(authentication, bookId, languageId, owner, server, twRepoTree)
      setTwErrorMsg(rc.Status ? rc.Status : null)
      if ( rc.Absent.length > 0 ) {
        console.log("bookId, Missing TW:",bookId,rc.Absent)
        setTwMissing(rc.Absent)
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
      const rc = await checkTaForBook(authentication, bookId, languageId, owner, server, taRepoTree)
      setTaErrorMsg(rc.Status ? rc.Status : null)
      if ( rc.Absent.length > 0 ) {
        console.log("bookId, Missing TA:",bookId,rc.Absent)
        setTaMissing(rc.Absent)
      } 
    }

    // check tn repo first
    if ( tnRepoTreeStatus === WORKING ) {
      return
    }
    // check ta repo first
    if ( taRepoTreeStatus === WORKING ) {
      return
    }
    // OK, repo is there as is manifest, but we won't be using the manifest for TA
    // Now check to see if there is twlRepo error
    if ( tnRepoTreeStatus !== null ) {
      setTaErrorMsg(NO_TN_REPO)
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
    checkManifestBook(tnRepoTreeManifest, tnRepoTree, setTnBookErrorMsg)
  }, [tnRepoTree, tnRepoTreeManifest])

  /*
  -- 
  -- TWL
  -- 
  */
  useEffect(() => {
    checkManifestBook(twlRepoTreeManifest, twlRepoTree, setTwlBookErrorMsg)
  }, [twlRepoTree, twlRepoTreeManifest])

  /*
  -- 
  -- LT (ult or glt)
  -- 
  */
  useEffect(() => {
    checkManifestBook(ltRepoTreeManifest, ltRepoTree, setLtBookErrorMsg)
  }, [ltRepoTree, ltRepoTreeManifest])

  /*
  -- 
  -- ST (ust or gst)
  -- 
  */
  useEffect(() => {
    checkManifestBook(stRepoTreeManifest, stRepoTree, setStBookErrorMsg)
  }, [stRepoTree, stRepoTreeManifest])

  /*
  -- 
  -- TQ
  -- 
  */
  useEffect(() => {
    checkManifestBook(tqRepoTreeManifest, tqRepoTree, setTqBookErrorMsg)
  }, [tqRepoTree, tqRepoTreeManifest])

  /*
  -- 
  -- SQ
  -- 
  */
  useEffect(() => {
    checkManifestBook(sqRepoTreeManifest, sqRepoTree, setSqBookErrorMsg)
  }, [sqRepoTree, sqRepoTreeManifest])

  /*
  -- 
  -- SN
  -- 
  */
  useEffect(() => {
    checkManifestBook(snRepoTreeManifest, snRepoTree, setSnBookErrorMsg)
  }, [snRepoTree, snRepoTreeManifest])

  let _ltRepo = languageId
  let _stRepo = languageId
  if ( owner === "unfoldingWord" || owner === "unfoldingword" ) {
    _ltRepo += "_ult"
    _stRepo += "_ust"
  } else {
    _ltRepo += "_glt"
    _stRepo += "_gst"
  }
  const applyIcon = (repo,repoErr,bookErr,manifest,manifestSha) => {
    // console.log("applyIcon() parameters:",`repo:${repo}
    //   repoErr:${repoErr}
    //   bookErr:${bookErr}
    //   manifest:${manifest}
    //   manifestSha:${manifestSha}
    // `)
    if ( repo.endsWith("_tw") || repo.endsWith("_ta") ) {
      if ( repoErr === null && bookErr === WORKING ) {
        return (
          <p>{WORKING}</p>
        )
      }
    }

    if ( repoErr === null && bookErr === null ) {
      return (
        <p>{WORKING}</p>
      )
    }

    if ( repoErr === REPO_NOT_FOUND ) {
      return (
        <CreateRepoButton active={true} server={server} owner={owner} repo={repo} refresh={refresh} bookId={bookId} onRefresh={setRefresh} />
      )
    }

    if ( repoErr !== null ) {
      return (
        <p>{repoErr}</p>
      )
    }

    if ( bookErr === OK ) {
      return (
        <DoneIcon />
      )
    }

    if ( bookErr === BOOK_NOT_IN_MANIFEST ) {
      return (
        <AddBookToManifest 
          active={true} server={server} owner={owner} repo={repo} refresh={refresh} 
          manifest={manifest} sha={manifestSha} bookId={bookId} onRefresh={setRefresh} 
        />
      )
    }

    if ( bookErr.endsWith('Missing') ) {
      if ( repo.endsWith("_tw") ) {
        const title = "Translation Word Articles Missing"
        return (
          <ViewListButton title={title} value={twMissing} />
        )
      } else {
        const title = "Translation Academy Articles Missing"
        return (
          <ViewListButton title={title} value={taMissing} />
        )
      }

    }

    if ( bookErr !== null ) {
      if ( repo.endsWith("_tw") || repo.endsWith("_ta") ) {
        return (
          <VisibilityIcon />
        )
      }
      return (
        <Tooltip title="Use tC Create to create file">
          <IconButton className={classes.iconButton} aria-label="Use-tc-create">
            <CreateIcon/>
          </IconButton>
        </Tooltip>

      )
    }

  }
  const headers = ["Resource", "Repo", "Status", "Action"]
  const rows = [
    ["Literal Translation", `${_ltRepo}`, ltRepoTreeStatus || ltBookErrorMsg, 
      applyIcon(_ltRepo,ltRepoTreeStatus,ltBookErrorMsg, ltRepoTreeManifest, ltManifestSha) 
    ],
    ["Simplified Translation", `${_stRepo}`, stRepoTreeStatus || stBookErrorMsg, 
      applyIcon(_stRepo,stRepoTreeStatus,stBookErrorMsg, stRepoTreeManifest, stManifestSha) 
    ],
    ["Translation Notes", `${languageId}_tn`, tnRepoTreeStatus || tnBookErrorMsg, 
      applyIcon(`${languageId}_tn`,tnRepoTreeStatus,tnBookErrorMsg, tnRepoTreeManifest, tnManifestSha) 
    ],
    ["Translation Word List", `${languageId}_twl`, twlRepoTreeStatus || twlBookErrorMsg, 
      applyIcon(`${languageId}_twl`,twlRepoTreeStatus,twlBookErrorMsg, twlRepoTreeManifest, twlManifestSha) 
    ],
    ["Translation Words", `${languageId}_tw`, twRepoTreeStatus || twErrorMsg, 
      applyIcon(`${languageId}_tw`,twRepoTreeStatus,twErrorMsg, twRepoTreeManifest, twManifestSha) 
    ],
    ["Translation Academy", `${languageId}_ta`, taRepoTreeStatus || taErrorMsg, 
      applyIcon(`${languageId}_ta`,taRepoTreeStatus,taErrorMsg, taRepoTreeManifest, taManifestSha) 
    ],
    ["Translation Questions", `${languageId}_tq`, tqRepoTreeStatus || tqBookErrorMsg, 
      applyIcon(`${languageId}_tq`,tqRepoTreeStatus,tqBookErrorMsg, tqRepoTreeManifest, tqManifestSha) 
    ],
    ["Study Questions", `${languageId}_sq`, sqRepoTreeStatus || sqBookErrorMsg, 
      applyIcon(`${languageId}_sq`,sqRepoTreeStatus,sqBookErrorMsg, sqRepoTreeManifest, sqManifestSha) 
    ],
    ["Study Notes", `${languageId}_sn`, snRepoTreeStatus || snBookErrorMsg, 
      applyIcon(`${languageId}_sn`,snRepoTreeStatus,snBookErrorMsg, snRepoTreeManifest, snManifestSha) 
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

