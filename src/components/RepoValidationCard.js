import { useEffect, useState, useContext } from 'react'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { ALL_BIBLE_BOOKS } from '@common/BooksOfTheBible'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'



export default function RepoValidationCard({
  bookId,
  classes
}) {
  const [projectExists, setProjectExists] = useState(false)
  const [fileExists, setFileExists] = useState(false)

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
  } } = useContext(AdminContext)

  useEffect(() => {
    // reset the booleans
    setProjectExists(false)
    setFileExists(false)
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
        setProjectExists(true)
        pathToBook = projects[i].path
        break
      }
    }

    // if project id exists, then does the file actually exist?
    if ( isBookIdInManfest ) {
      for (let i=0; i < tnRepoTree.length; i++) {
        let _path = tnRepoTree[i].path
        let _manifestpath = pathToBook.replace(/^\.\//,'')
        if ( _manifestpath === _path ) {
          setFileExists(true)
          break
        }
      }
    }
  
  }, [tnRepoTree, tnRepoTreeManifest])


  return (
    <Card title={ALL_BIBLE_BOOKS[bookId]} classes={classes} hideMarkdownToggle={true} >
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
    </Card>
  )
}


RepoValidationCard.propTypes = {
  bookId: PropTypes.string,
  classes: PropTypes.object,
}
