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
import { WORKING, OK, REPO_NOT_FOUND, FILE_NOT_FOUND, BOOK_NOT_IN_MANIFEST } from '@common/constants'

import CreateIcon from '@material-ui/icons/Create'
import DoneIcon from '@material-ui/icons/Done'
import VisibilityIcon from '@material-ui/icons/Visibility'

import CreateRepoButton from './CreateRepoButton'
import AddBookToManifest from './AddBookToManifest'
import DenseTable from './DenseTable'

export default function RepoObsValidationCard({
  bookId,
  classes,
  onClose: removeBook,
}) {
  // OBS
  const [obsBookErrorMsg, setObsBookErrorMsg] = useState(null)
  const [obsTnBookErrorMsg, setObsTnBookErrorMsg] = useState(null)
  const [obsTwlBookErrorMsg, setObsTwlBookErrorMsg] = useState(null)

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
      obsRepoTreeErrorMessage,
      obsTnRepoTree,
      obsTnRepoTreeManifest,
      obsTnRepoTreeErrorMessage,
      obsTwlRepoTree,
      obsTwlRepoTreeManifest,
      obsTwlRepoTreeErrorMessage,
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


  useEffect(() => {
    checkManifestBook(obsRepoTreeManifest, obsRepoTree, setObsBookErrorMsg)
  }, [obsRepoTree, obsRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(obsTnRepoTreeManifest, obsTnRepoTree, setObsTnBookErrorMsg)
  }, [obsTnRepoTree, obsTnRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(obsTwlRepoTreeManifest, obsTwlRepoTree, setObsTwlBookErrorMsg)
  }, [obsTwlRepoTree, obsTwlRepoTreeManifest])

  const applyIcon = (repo,repoErr,bookErr, manifest) => {
    // console.log("applyIcon() parameters:",`repo:${repo}
    //   repoErr:${repoErr}
    //   bookErr:${bookErr}
    //   manifest:${manifest}
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
/* not working yet... problem with PUT to update file, error 422 (not helpful)
    if ( bookErr === BOOK_NOT_IN_MANIFEST ) {
      return (
        <AddBookToManifest active={true} server={server} owner={owner} repo={repo} refresh={refresh} manifest={manifest} bookId={bookId} onRefresh={setRefresh} />
      )
    }
*/

    if ( bookErr !== null ) {
      if ( repo.endsWith("_tw") || repo.endsWith("_ta") ) {
        return (
          <VisibilityIcon />
        )
      }
      return (
        <CreateIcon/>
      )
    }

  }
  const headers = ["Resource", "Repo", "Status", "Action"]
  const rows = [
    ["Open Bible Stories (OBS)", `${languageId}_obs`, obsRepoTreeErrorMessage || obsBookErrorMsg, 
      applyIcon(`${languageId}_obs`,obsRepoTreeErrorMessage,obsBookErrorMsg, obsRepoTreeManifest) 
    ],
    ["OBS Translation Notes", `${languageId}_obs-tn`, obsTnRepoTreeErrorMessage || obsTnBookErrorMsg, 
      applyIcon(`${languageId}_obs-tn`,obsTnRepoTreeErrorMessage,obsTnBookErrorMsg, obsTnRepoTreeManifest) 
    ],
    ["OBS Translation Word List", `${languageId}_obs-twl`, obsTwlRepoTreeErrorMessage || obsTwlBookErrorMsg, 
      applyIcon(`${languageId}_obs-twl`,obsTwlRepoTreeErrorMessage,obsTwlBookErrorMsg, obsTwlRepoTreeManifest) 
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

