import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button'
// import CircularProgress from '@material-ui/core/CircularProgress'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import PrintSettings from '@components/PrintSettings'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { ALL_BIBLE_BOOKS, isNT } from '@common/BooksOfTheBible';
import { useProskomma, useImport, useCatalog, useRenderPreview } from 'proskomma-react-hooks';
import {getLanguage} from "@common/languages";

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

  const [documents, setDocuments] = useState([])
  const [i18n, setI18n] = useState(i18n_default)

  const language = useMemo(() => {
    const lang_ = getLanguage({ languageId })
    return lang_
  }, [languageId])

  const { state: authentication } = useContext(AuthenticationContext)
  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  const {
    state: {
      printConstraints,
      printResource,
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
  if ( isNT(bookId) ) {
    structure.nt = [bookId]
  } else {
    structure.ot = [bookId]
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
    ready: confirmPrint && i18n?.title, // bool to allow render to run, don't run until true and all content is present
    // pagedJS, // is this a link or a local file?
    // css, //
    // htmlFragment, // show full html or what's in the body
    verbose,
  });

  useEffect(() => {
    if (html && confirmPrint && !running) {
      const newPage = window.open("about:blank", "_blank", "width=850,height=1000")
      newPage.document.write(html.replace("https://unpkg.com/pagedjs/dist", "/static/js"))
      newPage.document.close()
      setSubmitPreview(false)
    }
  }, [html, confirmPrint, running])


  useEffect( () => {

    if ( !confirmPrint ) return;

    async function doPrint() {
      const tokenid = authentication.token.sha1;
      console.log("doPrint() - entered")
      console.log("printConstraints:",printConstraints)
      console.log("printResource", printResource)
    }

    doPrint()

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
                  setConfirmPrint(true)
                }
              }
            >
              Print Repository
            </Button>
            <br/>
          </div>
          {confirmPrint &&
            <h2 className='mx-4'>Status: {JSON.stringify(printConstraints)}</h2>         
          }
        </div>
      </div>
    </Layout>
  )
}

export default PrintPage
