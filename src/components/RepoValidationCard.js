import { useEffect, useState, useContext } from 'react'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { ALL_BIBLE_BOOKS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import DenseTable from '@components/DenseTable'
import { checkTwForBook, checkTaForBook } from '@utils/checkArticles'

export default function RepoValidationCard({
  bookId,
  classes
}) {
  // TN
  const [tnBookErrorMsg, setTnBookErrorMsg] = useState(null)
  // TWL
  const [twlBookErrorMsg, setTwlBookErrorMsg] = useState(null)
  // TW
  const [twErrorMsg, setTwErrorMsg] = useState("Working...")
  // TA
  const [taErrorMsg, setTaErrorMsg] = useState("Working...")
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
    taRepoTree,
    taRepoTreeManifest,
    taRepoTreeErrorMessage,
    twRepoTree,
    twRepoTreeManifest,
    twRepoTreeErrorMessage,
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
        setError("OK")
      } else {
        setError("Manifest book not found")
      }
    } else {
      setError("Book not in manifest")
    }
  }

  useEffect(() => {
    if ( twlBookErrorMsg === null ) {
      return // wait until we know the result
    }

    async function getTwWords() {
      const rc = await checkTwForBook(authentication, bookId, languageId, owner, server, twRepoTree)
      setTwErrorMsg(rc.ErrorMessage ? rc.ErrorMessage : null)
      if ( rc.Absent.length > 0 ) {
        console.log("bookId, Missing TW:",bookId,rc.Absent)
      } 
    }

    // check twl repo first
    if ( twlRepoTreeErrorMessage === "Working..." ) {
      return
    }
    // check tw repo first
    if ( twRepoTreeErrorMessage === "Working..." ) {
      return
    }
    // OK repo is there as is manifest, but we won't be using the manifest for TW
    // Now check to see if there is twlRepo error
    if ( twlRepoTreeErrorMessage !== null ) {
      setTwErrorMsg("No TWL Repo")
      return
    }
    // OK, now check whether the twl book file is present
    if ( twlBookErrorMsg === "OK" ) {
      // All looks good... let's get the TWL book file
      // fetch it!
      if (authentication && twRepoTree && twlRepoTree) {
        getTwWords()
      }
    } else {
      setTwErrorMsg("See TWL error")
    }
  }, [twRepoTree, twRepoTreeErrorMessage, twlRepoTree, twlRepoTreeErrorMessage, twlBookErrorMsg])

  useEffect(() => {
    if ( tnBookErrorMsg === null ) {
      return // wait until we know the result
    }

    async function getTaWords() {
      const rc = await checkTaForBook(authentication, bookId, languageId, owner, server, taRepoTree)
      setTaErrorMsg(rc.ErrorMessage ? rc.ErrorMessage : null)
      if ( rc.Absent.length > 0 ) {
        console.log("bookId, Missing TA:",bookId,rc.Absent)
      } 
    }

    // check tn repo first
    if ( tnRepoTreeErrorMessage === "Working..." ) {
      return
    }
    // check ta repo first
    if ( taRepoTreeErrorMessage === "Working..." ) {
      return
    }
    // OK repo is there as is manifest, but we won't be using the manifest for TA
    // Now check to see if there is twlRepo error
    if ( tnRepoTreeErrorMessage !== null ) {
      setTaErrorMsg("No TN Repo")
      return
    }
    // OK, now check whether the tn book file is present
    if ( tnBookErrorMsg === "OK" ) {
      // All looks good... let's get the TWL book file
      // fetch it!
      if (authentication && taRepoTree && tnRepoTree) {
        getTaWords()
      }
    } else {
      setTaErrorMsg("See TN error")
    }
  }, [taRepoTree, taRepoTreeErrorMessage, tnRepoTree, tnRepoTreeErrorMessage, tnBookErrorMsg])

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
    ["Literal Translation", `${_ltRepo}`, ltRepoTreeErrorMessage || ltBookErrorMsg ],
    ["Simplified Translation", `${_stRepo}`, stRepoTreeErrorMessage || stBookErrorMsg ],
    ["Translation Notes", `${languageId}_tn`, tnRepoTreeErrorMessage || tnBookErrorMsg ],
    ["Translation Word List", `${languageId}_twl`, twlRepoTreeErrorMessage || twlBookErrorMsg ],
    ["Translation Words", `${languageId}_tw`, twRepoTreeErrorMessage || twErrorMsg ],
    ["Translation Academy", `${languageId}_ta`, taRepoTreeErrorMessage || taErrorMsg ],
    ["Translation Questions", `${languageId}_tq`, tqRepoTreeErrorMessage || tqBookErrorMsg ],
    ["Study Questions", `${languageId}_sq`, sqRepoTreeErrorMessage || sqBookErrorMsg ],
    ["Study Notes", `${languageId}_sn`, snRepoTreeErrorMessage || snBookErrorMsg ],
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
