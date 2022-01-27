import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DoneIcon from '@material-ui/icons/Done';
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import {
  doFetch,
  isServerDisconnected,
} from '@utils/network'
import { contentValidate } from '@utils/contentValidation'
import * as localforage from '@utils/fetchCache';

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

async function locateContent(url, authentication) {
  let content = await localforage.sessionStore.getItem(url)
  if ( content !== null ) {
    return content
  }

  let errorCode
  let _errorMessage = null
  let fetchError = true

  // not in cache ... go get it
  try {
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
      _errorMessage = `Fetch error`
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
    _errorMessage = "Network error"
    content = null
  }
  if ( content ) {
    localforage.sessionStore.setItem(url,content)
  }
  return content
}

function ValidateListContent({ active, server, owner, repo, bookId, list, onRefresh, onContentValidation }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitValidateListContent, setSubmitValidateListContent] = useState(false)
   
  useEffect(() => {
    if ( !submitValidateListContent ) return;

    async function doSubmitValidateListContent() {
      onContentValidation && onContentValidation(null) // set to null first
      const files = list.Present
      let results = []
      for (let i=0; i<files.length; i++) {
        let url = `${server}/${owner}/${repo}/raw/branch/master/${files[i]}`
        const content = locateContent(url, authentication)
        if ( content ) {
          const data = await contentValidate(owner, repo, bookId.toUpperCase(), files[i], content)
          if ( data.length < 2 ) continue
          if ( results.length === 0 ) {
            results.push( ...data )
          } else {
            results.push( ...data.slice(1))
          }
        }

      }
      onContentValidation && onContentValidation(results) // set to results
      setSubmitValidateListContent(false)
    }
    doSubmitValidateListContent()
  }, [submitValidateListContent, server, owner, repo, list, bookId, onRefresh])
  
  const classes = useStyles({ active })
  return (
      <Tooltip title="Validate Content for Translation Academy Articles" >
        <IconButton className={classes.iconButton} 
          onClick={() => setSubmitValidateListContent(true)} 
          aria-label="Validate Content">
          <DoneIcon />
        </IconButton>
      </Tooltip>
  )
}

export default ValidateListContent