import { useContext, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
// import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import PrintSettings from '@components/PrintSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { ALL_BIBLE_BOOKS, BIBLES_ABBRV_INDEX, isNT } from '@common/BooksOfTheBible'
import { useProskomma, useImport, useCatalog, useRenderPreview } from 'proskomma-react-hooks'
import {getLanguage} from "@common/languages"
import { locateContent } from '@utils/contentValidation'

const i18n_default = {
  // coverAlt: "Cover",
  titlePage: "unfoldingWord Literal Translation: Preview",
  copyright: "Licensed under a Creative Commons Attribution-Sharealike 4.0 International License",
  // preface: "Preface",
  tocBooks: "Books of the Bible",
  ot: "Old Testament",
  nt: "New Testament"
  // notes: "Notes",
};

const PrintPage = () => {
  const router = useRouter()
  const [confirmPrint, setConfirmPrint] = useState(false)
  const [printDisabled, setPrintDisabled] = useState(true)
  const [status, setStatus] = useState("Click Confirm Print to continue")

  const [documents, setDocuments] = useState([])
  const [i18n, setI18n] = useState(i18n_default)


  const { state: authentication } = useContext(AuthenticationContext)
  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  const handleClickPrint = () => {
    setConfirmPrint(true)
  }

  const language = useMemo(() => {
    const lang_ = getLanguage({ languageId })
    return lang_
  }, [languageId])

  const {
    state: {
      printConstraints,
      printResource,
      books,
    },
    actions: {
      setPrintConstraints,
      setPrintResource,
    }
  } = useContext(AdminContext)

  useEffect( () => {
    if (printConstraints === null) {
      setPrintDisabled(true)
    } else if (printConstraints.ot || printConstraints.nt || printConstraints.bpFilter) {
      setPrintDisabled(false)
    } else {
      setPrintDisabled(true)
    }
  },[printConstraints])

  const verbose = true
  const proskommaHook = useProskomma({
    verbose,
  })

  const importHook = useImport({
    ...proskommaHook,
    documents: documents,
    ready: documents.length && proskommaHook?.proskomma,
    verbose,
  });
  const catalogHook = useCatalog({
    ...proskommaHook,
    cv: !importHook.importing,
    verbose,
  });

  const structure = {};
  let ntList = []
  let otList = []
  for (let i=0; i<books.length; i++) {
    if ( isNT(books[i]) ) {
      ntList.push(books[i])
    } else {
      otList.push(books[i])
    }
  }
  if ( ntList.length > 0 ) {
    structure.nt = ntList
  }
  if ( otList.length > 0 ) {
    structure.ot = otList
  }
  const {
    html, // dummy output (currently <html><head>...</head><body>...</body></html>)
    running, // dummy timer for simulating false, true, false.
    progress, // dummy 0...50...100
    errors, // caught and floated up
  } = useRenderPreview({
    ...proskommaHook,
    docSetId: catalogHook?.catalog?.docSets?.[0]?.id, // docset provides language and docSetId to potentially query, and build structure
    textDirection: language?.direction || 'ltr',
    structure, // eventually generate structure from catalog
    i18n,
    language: languageId,
    ready: confirmPrint && i18n?.title && catalogHook?.catalog?.docSets?.[0]?.id, // bool to allow render to run, don't run until true and all content is present
    // pagedJS, // is this a link or a local file?
    // css, //
    // htmlFragment, // show full html or what's in the body
    verbose,
  });

  useEffect( () => {
    console.log("Errors:",errors)
    console.log("catalog:", catalogHook?.catalog)
  }, [errors])

  useEffect(() => {
    console.log("html yet?", html ? "yes" : "no")
    console.log("confirmPrint:", confirmPrint)
    console.log("running:", running)
    if (html && confirmPrint && !running) {
      setStatus("Generating Preview!")
      const newPage = window.open("about:blank", "_blank", "width=850,height=1000")
      newPage.document.write(html.replace("https://unpkg.com/pagedjs/dist", "/static/js"))
      newPage.document.close()
      setStatus("Press Control-P to save as PDF")
      setConfirmPrint(false) // all done
    }
  }, [html, confirmPrint, running])


  useEffect( () => {

    async function doPrint() {
      const tokenid = authentication.token.sha1;
      console.log("doPrint() - entered")
      console.log("printConstraints:",printConstraints)
      console.log("printResource", printResource)
      let repo = languageId + "_"
      if ( printResource === 'lt' ) {
        if ( organization.toLowerCase() === 'unfoldingword' ) {
          repo += 'ult'
        } else {
          repo += 'glt'
        }
      } else {
        if ( organization.toLowerCase() === 'unfoldingword' ) {
          repo += 'ust'
        } else {
          repo += 'gst'
        }
      }
      // setStatus(JSON.stringify(books))
      let errFlag = false
      let docs = []
      for ( let i=0; i < books.length; i++ ) {
        const bookId = books[i]
        const bookName = ALL_BIBLE_BOOKS[bookId]
        const filename = BIBLES_ABBRV_INDEX[bookId] + "-" + bookId.toUpperCase() + ".usfm"
        let url = `${server}/${organization}/${repo}/raw/branch/master/${filename}`
        // setTimeout( () =>  setStatus(url), 5000*(i+1))
        setStatus("Retrieving:"+filename)
        const content = await locateContent(url, authentication)
        if ( content ) {
          docs.push(
            { selectors: { org: organization, lang: languageId, abbr: bookId },
              data: content, 
              bookCode: bookId, 
              bookName: bookName,
              testament: isNT(bookId) ? "nt":"ot,",
            }
          )
          setStatus("Retrieved OK:"+filename)
        } else {
          setStatus("Error retrieving "+filename)
          errFlag = true
          break
        }
      }
      if ( ! errFlag ) {
        const languageName = language.localized || language.languageName || language.languageId
        const title = `${organization} - ${languageName}`
        const i18n = {
          ...i18n_default,
          titlePage: title,
          title,
        }
        setI18n(i18n)
        setStatus("Begin importing documents for printing")
        setDocuments(docs)
        setStatus("Completed import of documents for printing")
      }
      // setConfirmPrint(false)
    }
    if ( confirmPrint ) doPrint()

  }, [server, organization, languageId, confirmPrint, printConstraints, printResource])

  return (
    <Layout>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
          <h1 className='mx-4'>Print Repository</h1>
          <PrintSettings />
          <div className='flex justify-end'>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              onClick={() => {
                router.push('/')
              }}
            >
              Close
            </Button>
            <Button
              size='large'
              color='primary'
              className='my-3 mx-1'
              variant='contained'
              disabled={printDisabled}
              onClick={
                () => {
                  handleClickPrint()
                }
              }
            >
              Print Repository
            </Button>
            <br/>
          </div>
          {<h2 className='mx-4'>Status: {status}</h2>}
        </div>
      </div>
    </Layout>
  )
}

export default PrintPage
