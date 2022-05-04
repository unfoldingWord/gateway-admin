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
import useDeepEffect from 'use-deep-compare-effect';

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
    docSetId: ['unfoldingword_en_ult'], // docset provides language and docSetId to potentially query, and build structure
    textDirection: language?.direction || 'ltr',
    structure, // eventually generate structure from catalog
    i18n,
    language: languageId,
    ready: importHook.done, // bool to allow render to run, don't run until true and all content is present
    // pagedJS, // is this a link or a local file?
    // css, //
    // htmlFragment, // show full html or what's in the body
    verbose,
  });

  useDeepEffect( () => {
    console.log("Errors:",errors)
    console.log("catalogHook:", catalogHook)
    console.log("importHook:", importHook)
  }, [errors, catalogHook, importHook])

  useEffect(() => {
    console.log("--- Render useEffect Dependencies ---")
    console.log("--- html:", html)
    console.log("--- errors:", errors)
    console.log("--- progress:", progress) 
    console.log("--- running:", running)
    if (html && progress === 100 ) {
      setStatus("Generating Preview!")
      const newPage = window.open('','','_window');
      newPage.document.head.innerHTML = "<title>PDF Preview</title>";
      const script = newPage.document.createElement('script');
      script.src = 'https://unpkg.com/pagedjs/dist/paged.polyfill.js';
      newPage.document.head.appendChild(script);
      const style = newPage.document.createElement('style');
      const newStyles = `
      body {
        margin: 0;
        background: grey;
      }
      .pagedjs_pages {
      }
      .pagedjs_page {
        background: white;
        margin: 1em;
      }
      .pagedjs_right_page {
        float: right;
      }
      .pagedjs_left_page {
        float: left;
      }
      div#page-2 {
        clear: right;
      }
      `;
      style.innerHTML = newStyles + html.replace(/^[\s\S]*<style>/, "").replace(/<\/style>[\s\S]*/, "");
      newPage.document.head.appendChild(style);
      newPage.document.body.innerHTML = html.replace(/^[\s\S]*<body>/, "").replace(/<\/body>[\s\S]*/, "");      
      setStatus("Press Control-P to save as PDF")
      setConfirmPrint(false) // all done
    }
  }, [html, errors, running, progress])


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
        // Note: abbr is the base translation, not the book abbreviation
        // Thus for uW, we only have two base translations, 'ust' and 'ult'
        let translationAbbr;
        if ( printResource === 'lt') {
          translationAbbr = 'ult'
        } else {
          translationAbbr = 'ust'
        }
        if ( content ) {
          docs.push(
            { selectors: { org: organization.toLowerCase(), lang: languageId, abbr: translationAbbr },
              data: content, 
              bookCode: bookId.toUpperCase(), 
              bookName: bookName,
              testament: isNT(bookId) ? "nt":"ot",
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


/* code graveyard

    if ( confirmPrint ) {
      console.log("confirmPrint is true")
    } else {
      return
    }
    if ( errors && errors.length > 0 ) {
      console.log("render returned errors:", errors)
      return
    }
    if ( importHook && importHook.importing ) {
      console.log("in useEffect/render... still importing")
      return
    }
    if ( importHook.done ) {
      console.log("importing is done!")
    } else {
      console.log("in useEffect/render... importing not done")
      return
    }
    if ( html ) {
      console.log("html data is available")
      if ( running ) {
        console.log("... but running is still true")
        return
      } else {
        console.log("html data and no longer running")
      }
    } else {
      console.log("html data is not available")
      return
    }
*/
