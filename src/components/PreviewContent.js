import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Pageview from '@material-ui/icons/Pageview'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import {
  doFetch,
  isServerDisconnected,
} from '@utils/network'
import { contentValidate } from '@utils/contentValidation'
import { RETRIEVING, VALIDATION_FINISHED } from '@common/constants';
import { ALL_BIBLE_BOOKS, isNT } from '@common/BooksOfTheBible';
import { useProskomma, useImport, useCatalog, useRenderPreview } from 'proskomma-react-hooks';

const useStyles = makeStyles(theme => ({
  root: {
    color: theme.palette.primary.main,
    backgroundColor: props => (props.active ? '#ffffff' : 'transparent'),
    '&:hover': {
      color: props => (props.active ? '#ffffff' : theme.palette.primary.main),
      backgroundColor: props => (props.active ? '#07b811' : '#ffffff'),
    },
    border: '1px solid #0089C7',
  },
}))


function PreviewContent({ active, server, owner, repo, bookId, filename, onRefresh,
  onAction, languageId
}) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitPreview, setSubmitPreview] = useState(false)
  const [documents, setDocuments] = useState([])

  const verbose = true
  const proskommaHook = useProskomma({
    verbose,
  });

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

  const i18n = {
    // coverAlt: "Cover",
    titlePage: "unfoldingWord Literal Translation: Preview",
    copyright: "Licensed under a Creative Commons Attribution-Sharealike 4.0 International License",
    // preface: "Preface",
    tocBooks: "Books of the Bible",
    ot: "Old Testament",
    nt: "New Testament"
    // notes: "Notes",
  };

  const structure = { ot: [], nt: [] };
  if ( isNT(bookId) ) {
    structure.nt = [bookId]
  } else {
    structure.ot = [bookId]
  }
  const {
    html, // dummy output (currently <html><head>...</head><body>...</body></html>)
    rendering, // dummy timer for simulating false, true, false.
    progress, // dummy 0...50...100
    errors, // caught and floated up
  } = useRenderPreview({
    ...proskommaHook,
    docSet: catalogHook.catalog.docSets[0], // docset provides language and docSetId to potentially query, and build structure
    title: i18n.titlePage, // isn't this already in the i18n? Do we need to pass it again?
    dir: 'ltr', //TODO need to dyanimically obtain this
    structure, // eventually generate structure from catalog
    i18n,
    ready: submitPreview, // bool to allow render to run, don't run until true and all content is present
    // pagedJS, // is this a link or a local file?
    // css, //
    // htmlFragment, // show full html or what's in the body
    verbose,
  });

  useEffect(() => {
    if (html && submitPreview) {
      const wnd = window.open("about:blank", "", "_blank");
      wnd.document.write(html);
      setSubmitPreview(false)
    };
  }, [html, submitPreview]);

  // useEffect( () => {
  //   setSubmitPreview(false)
  //   console.log(errors)
  // }, [errors])

  useEffect(() => {
    if ( !submitPreview ) return;

    async function doSubmitPreview() {
      let errorCode
      let _errorMessage = null
      let content = null
      let fetchError = true
      let url = `${server}/${owner}/${repo}/raw/branch/master/${filename}`

      try {
        //onAction && onAction(RETRIEVING)
        content = await doFetch(url, authentication)
          .then(response => {
            if (response?.status !== 200) {
              errorCode = response?.status
              console.warn(`doFetch - error fetching file ${filename},
                status code ${errorCode},
                URL=${url},
                response:`,response)
              fetchError = true
              return null
          }
          fetchError = false
          return response?.data
        })
        if (fetchError) {
          _errorMessage = `Error retrieving ${filename}`
          content = null // just to be sure
        }
      } catch (e) {
        const message = e?.message
        const disconnected = isServerDisconnected(e)
        console.warn(`doFetch - error fetching file ${filename},
          message '${message}',
          disconnected=${disconnected},
          URL=${url},
          error message:`,
          e)
        _errorMessage = `Network error: ${message}`
        content = null
      }

      if (content) {
        // create the preview

        const document = ({bookCode, bookName, testament}) => ({
          selectors: { org: owner, lang: languageId, abbr: bookCode },
          data: content,
          bookCode,
          testament,
        });

        const docs = [
          document({bookCode: bookId,
          bookName: ALL_BIBLE_BOOKS[bookId],
          testament: isNT(bookId) ? "nt" : "ot",
          })
        ]
        setDocuments(docs)
      }

      // setSubmitPreview(false)
    }
    doSubmitPreview()
  }, [submitPreview, server, owner, repo, filename, bookId, onRefresh])

  const classes = useStyles({ active })
  return (
      <Tooltip title={ `Preview Content` }>
        <IconButton className={classes.iconButton}
          onClick={() => setSubmitPreview(true)}
          aria-label="Preview Content">
          <Pageview />
        </IconButton>
      </Tooltip>
  )
}

export default PreviewContent
