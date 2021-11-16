import { useEffect, useState, useContext } from 'react'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { ALL_BIBLE_BOOKS } from '@common/BooksOfTheBible'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import DenseTable from '@components/DenseTable'

export default function RepoValidationCard({
  bookId,
  classes
}) {
  // TN
  const [tnBookErrorMsg, setTnBookErrorMsg] = useState(null)
  // TWL
  const [twlBookErrorMsg, setTwlBookErrorMsg] = useState(null)
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
      owner,
      server,
      languageId,
    },
  } = useContext(StoreContext)

  const { state: {
    tnRepoTree, 
    tnRepoTreeManifest,
    tnRepoTreeErrorMessage,
    twlRepoTree,
    twlRepoTreeManifest,
    twlRepoTreeErrorMessage,
    ltRepoTree,
    ltRepoTreeManifest,
    ltRepoTreeErrorMessage,
    stRepoTree,
    stRepoTreeManifest,
    stRepoTreeErrorMessage,
    tqRepoTree,
    tqRepoTreeManifest,
    tqRepoTreeErrorMessage,
    sqRepoTree,
    sqRepoTreeManifest,
    sqRepoTreeErrorMessage,
    snRepoTree,
    snRepoTreeManifest,
    snRepoTreeErrorMessage,
} } = useContext(AdminContext)

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
      if ( projects[i].identifier === bookId ) {
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
        setError(null)
      } else {
        setError("Manifest book not found")
      }
    } else {
      setError("Book not in manifest")
    }
  }

  useEffect(() => {
    checkManifestBook(tnRepoTreeManifest, tnRepoTree, setTnBookErrorMsg)
  }, [tnRepoTree, tnRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(twlRepoTreeManifest, twlRepoTree, setTwlBookErrorMsg)
  }, [twlRepoTree, twlRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(ltRepoTreeManifest, ltRepoTree, setLtBookErrorMsg)
  }, [ltRepoTree, ltRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(stRepoTreeManifest, stRepoTree, setStBookErrorMsg)
  }, [stRepoTree, stRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(tqRepoTreeManifest, tqRepoTree, setTqBookErrorMsg)
  }, [tqRepoTree, tqRepoTreeManifest])

  useEffect(() => {
    checkManifestBook(sqRepoTreeManifest, sqRepoTree, setSqBookErrorMsg)
  }, [sqRepoTree, sqRepoTreeManifest])

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
  const headers = ["Resource", "Repo", "Status"]
  const rows = [
    ["Literal Translation", `${_ltRepo}`, ltRepoTreeErrorMessage || ltBookErrorMsg || "OK"],
    ["Simplified Translation", `${_stRepo}`, stRepoTreeErrorMessage || stBookErrorMsg || "OK"],
    ["Translation Notes", `${languageId}_tn`, tnRepoTreeErrorMessage || tnBookErrorMsg || "OK"],
    ["Translation Word List", `${languageId}_twl`, twlRepoTreeErrorMessage || twlBookErrorMsg || "OK"],
    ["Translation Questions", `${languageId}_tq`, tqRepoTreeErrorMessage || tqBookErrorMsg || "OK"],
    ["Study Questions", `${languageId}_sq`, sqRepoTreeErrorMessage || sqBookErrorMsg || "OK"],
    ["Study Notes", `${languageId}_sn`, snRepoTreeErrorMessage || snBookErrorMsg || "OK"],
  ]

  return (
    <Card title={ALL_BIBLE_BOOKS[bookId]} classes={classes} hideMarkdownToggle={true} >
      <DenseTable cols={headers} rows={rows} />
    </Card>
  )
}


RepoValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}
