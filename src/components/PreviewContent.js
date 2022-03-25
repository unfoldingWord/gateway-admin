import { useState, useEffect, useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Pageview from '@material-ui/icons/Pageview'
import { Tooltip, IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import {
  doFetch,
  isServerDisconnected,
} from '@utils/network'
import { ALL_BIBLE_BOOKS, isNT } from '@common/BooksOfTheBible';
import { useProskomma, useImport, useCatalog, useRenderPreview } from 'proskomma-react-hooks';
import {getLanguage} from "@common/languages";
import {getBuildId} from "@utils/build";

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
  onAction, languageId, typeName
}) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitPreview, setSubmitPreview] = useState(false)
  const [documents, setDocuments] = useState([])
  const [i18n, setI18n] = useState(i18n_default)

  const language = useMemo(() => {
    const lang_ = getLanguage({ languageId })
    return lang_
  }, [languageId])

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
    ready: submitPreview && i18n?.title, // bool to allow render to run, don't run until true and all content is present
    // pagedJS, // is this a link or a local file?
    // css, //
    // htmlFragment, // show full html or what's in the body
    verbose,
  });

  useEffect(() => {
    if (html && submitPreview && !running) {
      const newPage = window.open("about:blank", "_blank", "width=850,height=1000")
      newPage.document.write(html.replace("https://unpkg.com/pagedjs/dist", "/static/js"))
      newPage.document.close()
      setSubmitPreview(false)
    }
  }, [html, submitPreview, running])

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

        const document = ({ bookCode, bookName, testament }) => ({
          selectors: { org: owner, lang: languageId, abbr: bookCode },
          data: content,
          bookCode,
          testament,
        })

        const bookName = ALL_BIBLE_BOOKS[bookId]
        const docs = [
          document({
            bookCode: bookId,
            bookName: bookName,
            testament: isNT(bookId) ? "nt" : "ot",
          }),
        ]
        const languageName = language.localized || language.languageName || language.languageId
        const title = `${owner} - ${languageName} ${typeName} - ${bookName}`
        const i18n = {
          ...i18n_default,
          titlePage: title,
          title,
        }
        setI18n(i18n)
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
