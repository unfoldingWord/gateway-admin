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
  const [tnProjectExists, setTnProjectExists] = useState(false)
  const [tnFileExists, setTnFileExists] = useState(false)
  const [tnBookErrorMsg, setTnBookErrorMsg] = useState(null)
  // TWL
  const [twlProjectExists, setTwlProjectExists] = useState(false)
  const [twlFileExists, setTwlFileExists] = useState(false)
  const [twlBookErrorMsg, setTwlBookErrorMsg] = useState(null)

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
  } } = useContext(AdminContext)

  useEffect(() => {
    // reset the booleans
    setTnProjectExists(false)
    setTnFileExists(false)
    let projects = []
    if (tnRepoTreeManifest && tnRepoTreeManifest.projects) {
      projects = tnRepoTreeManifest.projects
    } else {
      return
    }
    let isBookIdInManfest = false
    let pathToBook;
    for (let i=0; i < projects.length; i++) {
      if ( projects[i].identifier === bookId ) {
        isBookIdInManfest = true
        setTnProjectExists(true)
        pathToBook = projects[i].path
        break
      }
    }

    // if project id exists, then does the file actually exist?
    if ( isBookIdInManfest ) {
      let _fileExists = false
      for (let i=0; i < tnRepoTree.length; i++) {
        let _path = tnRepoTree[i].path
        let _manifestpath = pathToBook.replace(/^\.\//,'')
        if ( _manifestpath === _path ) {
          //setFileExists(true)
          _fileExists = true
          break
        }
      }
      if ( _fileExists ) {
        setTnFileExists(true)
        setTnBookErrorMsg(null)
      } else {
        setTnFileExists(false)
        setTnBookErrorMsg("Manifest book not found")
      }
    } else {
      setTnBookErrorMsg("Book not in manifest")
    }

  }, [tnRepoTree, tnRepoTreeManifest])

  useEffect(() => {
    // reset the booleans
    setTwlProjectExists(false)
    setTwlFileExists(false)
    let projects = []
    if (twlRepoTreeManifest && twlRepoTreeManifest.projects) {
      projects = twlRepoTreeManifest.projects
    } else {
      return
    }
    let isBookIdInManfest = false
    let pathToBook;
    for (let i=0; i < projects.length; i++) {
      if ( projects[i].identifier === bookId ) {
        isBookIdInManfest = true
        setTwlProjectExists(true)
        pathToBook = projects[i].path
        break
      }
    }

    // if project id exists, then does the file actually exist?
    if ( isBookIdInManfest ) {
      let _fileExists = false
      for (let i=0; i < twlRepoTree.length; i++) {
        let _path = twlRepoTree[i].path
        let _manifestpath = pathToBook.replace(/^\.\//,'')
        if ( _manifestpath === _path ) {
          //setFileExists(true)
          _fileExists = true
          break
        }
      }
      if ( _fileExists ) {
        setTwlFileExists(true)
        setTwlBookErrorMsg(null)
      } else {
        setTwlFileExists(false)
        setTwlBookErrorMsg("Manifest book not found")
      }
    } else {
      setTwlBookErrorMsg("Book not in manifest")
    }

  }, [twlRepoTree, twlRepoTreeManifest])

  const headers = ["Resource", "Repo", "Status"]
  const rows = [
    ["Translation Notes", `${languageId}_tn`, tnRepoTreeErrorMessage || tnBookErrorMsg || "OK"],
    ["Translation Word List", `${languageId}_twl`, twlRepoTreeErrorMessage || twlBookErrorMsg || "OK"]
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


/*
      <p style={{ padding: '30px' }}>
        {ALL_BIBLE_BOOKS[bookId]} has bookId of "{bookId}". <br/>
        Owner is: {owner}.<br/>
        LanguageId is: {languageId}.<br/>
        Server is: {server}. <br/>
        TN Tree: {JSON.stringify(tnRepoTree).slice(0,16)} <br/>
        TN Manifest: {JSON.stringify(tnRepoTreeManifest).slice(0,16)} <br/>
        TN Err Msg: {tnRepoTreeErrorMessage} <br/>
        TN Project Id Exists? {projectExists ? "true":"false"} <br/>
        TN File Exists? {fileExists ? "true":"false"} <br/>
      </p>

*/