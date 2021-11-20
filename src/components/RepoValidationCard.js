import { useEffect, useState, useContext } from 'react'

import PropTypes from 'prop-types'
import { Card } from 'translation-helps-rcl'
import { ALL_BIBLE_BOOKS } from '@common/BooksOfTheBible'
import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import DenseTable from '@components/DenseTable'
import { checkTwForBook } from '@utils/checkArticles'

export default function RepoValidationCard({
  bookId,
  classes
}) {
  // TN
  const [tnBookErrorMsg, setTnBookErrorMsg] = useState(null)
  // TWL
  const [twlBookErrorMsg, setTwlBookErrorMsg] = useState(null)
  // TW
  const [twErrorMsg, setTwErrorMsg] = useState(null)
  // TA
  const [taErrorMsg, setTaErrorMsg] = useState(null)
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
        setError(null)
      } else {
        setError("Manifest book not found")
      }
    } else {
      setError("Book not in manifest")
    }
  }

  useEffect(() => {
    // Examine twl book error message
    // - if message is null means all is OK
    // - if not null, then report "TWL unavailable" and return
    // that something is:
    // a. fetch the twl file
    // b. parse it
    // c. get the rc link to the tW article
    // d. transform it to a URL
    // e. fetch it
    // f. if fetched then add to a "present" array
    // g. if not, then add to a "missing" array
    // h. if missing array length is > zero, then report "xx missing"
    // g. otherwise report "OK"
    // i. be sure to add both missing and present arrays to a state var in this card
    async function getTwWords() {
      const rc = await checkTwForBook(authentication, bookId, languageId, owner, server, twRepoTree)
      //setValues({tnRepoTree: _tree, tnRepoTreeManifest: _manifest, tnRepoTreeErrorMessage: _errorMesage})
      setTwErrorMsg(rc.ErrorMessage ? rc.ErrorMessage : null)
      console.log("getTwWords() rc=",rc)
    }

    // check tw repo first
    if ( twRepoTreeErrorMessage !== null ) {
      return
    }
    // OK repo is there as is manifest, but we won't be using the manifest for TW
    // Now check to see if there is twlRepo error
    if ( twlRepoTreeErrorMessage !== null ) {
      setTwErrorMsg("No TWL Repo")
      return
    }
    // OK, now check whether the twl book file is present
    if ( twlBookErrorMsg !== null ) {
      setTwErrorMsg("No TWL file for book")
      return
    }

    // All looks good... let's get the TWL book file
    // fetch it!
    if (authentication && twRepoTree && twlRepoTree) {
      const rc = getTwWords()
    }
    




  }, [twRepoTree, twRepoTreeErrorMessage, twlRepoTree, twlRepoTreeErrorMessage, twlBookErrorMsg])

  useEffect(() => {
    // add tn book error message
    // if message is null, just return
    // if not null, then if not "OK", then report "TN unavailable"
    // only need to do something if the message = "OK"
    // that something is:
    // a. fetch the tn file
    // b. parse it
    // c. get the rc link to the tA article
    // d. transform it to a URL
    // e. fetch it
    // f. if fetched then add to a "present" array
    // g. if not, then add to a "missing" array
    // h. if missing array length is > zero, then report "xx missing"
    // g. otherwise report "OK"
    // i. be sure to add both missing and present arrays to a state var in this card
  }, [taRepoTree, tnRepoTree, tnRepoTreeErrorMessage])

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
    ["Translation Words", `${languageId}_tw`, twRepoTreeErrorMessage || twErrorMsg || "OK"],
    ["Translation Academy", `${languageId}_ta`, taRepoTreeErrorMessage || taErrorMsg || "OK"],
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
