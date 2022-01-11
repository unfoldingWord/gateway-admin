import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DoneIcon from '@material-ui/icons/Done'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import {
  doFetch,
  isServerDisconnected,
  onNetworkActionButton,
  processNetworkError,
  reloadApp,
} from '@utils/network'
import { contentValidate } from '@utils/contentValidation'
import { getResourceIdFromRepo } from '@utils/dcsApis'

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


function ValidateContent({ active, server, owner, repo, bookId, filename, onRefresh }) {
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

      if (content) {
        // do the validation
        console.log("CV Content:", content)
        const data = await contentValidate(owner, repo, bookId.toUpperCase(), filename, content)
        console.log("CV Results:",data)
      }
      
      setSubmitValidateContent(false)
      onRefresh(getResourceIdFromRepo(repo))    
    }
    doSubmitValidateContent()
  }, [submitValidateContent, server, owner, repo, filename, bookId, onRefresh])
    
  const classes = useStyles({ active })
  return (
      <Tooltip title={`Validate Content for ${filename}`}>
        <IconButton className={classes.iconButton} 
          onClick={() => setSubmitValidateContent(true)} 
          aria-label="Validate Content">
          <DoneIcon />
        </IconButton>
      </Tooltip>
  )
}

export default ValidateContent