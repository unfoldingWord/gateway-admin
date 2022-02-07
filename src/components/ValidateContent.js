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
import { RETRIEVING, VALIDATION_FINISHED } from '@common/constants';

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


function ValidateContent({ active, server, owner, repo, bookId, filename, onRefresh, onContentValidation, onAction }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitValidateContent, setSubmitValidateContent] = useState(false)
   
  useEffect(() => {
    if ( !submitValidateContent ) return;

    async function doSubmitValidateContent() {
      let errorCode
      let _errorMessage = null
      let content = null
      let fetchError = true
      let url = `${server}/${owner}/${repo}/raw/branch/master/${filename}`
    
      try {
        onAction && onAction(RETRIEVING)
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
        // do the validation
        onContentValidation && onContentValidation(null) // set to null first
        const data = await contentValidate(owner, repo, bookId.toUpperCase(), filename, content)
        onContentValidation && onContentValidation(data) // set to results
        onAction && onAction(VALIDATION_FINISHED)
      }
      
      setSubmitValidateContent(false)
    }
    doSubmitValidateContent()
  }, [submitValidateContent, server, owner, repo, filename, bookId, onRefresh])
  
  let articleList
  if ( repo.endsWith('ta') ) {
    articleList = "Translation Academy Articles"
  } else if ( repo.endsWith('tw') ) {
    articleList = "Translation Word Articles"
  }
  const classes = useStyles({ active })
  return (
      <Tooltip title={ `Validate Content for ${filename || articleList}` }>
        <IconButton className={classes.iconButton} 
          onClick={() => setSubmitValidateContent(true)} 
          aria-label="Validate Content">
          <DoneIcon />
        </IconButton>
      </Tooltip>
  )
}

export default ValidateContent