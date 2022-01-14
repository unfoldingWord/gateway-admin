import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined'
import { green, red, yellow, grey } from '@material-ui/core/colors'
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


function ValidateContent({ active, server, owner, repo, bookId, filename, onRefresh, onContentValidation }) {
  const [cvStatus, setCvStatus] = useState(grey[900])
  const [cvIstatus, setCvIstatus] = useState(<DoneOutlineOutlinedIcon />)
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
        onContentValidation && onContentValidation(null) // set to null first
        const data = await contentValidate(owner, repo, bookId.toUpperCase(), filename, content)
        // now loop thru the results and determine the status
        let _status = grey[900]
        // setCvStatus(_status) // reset it
        for (let i=1; i < data.length; i++) {
          if ( parseInt(data[i][0]) >= 800 ) {
            _status = red[500]
            break // stop looking
          }
          if ( parseInt(data[i][0]) >= 600 ) {
            _status = yellow[500] // keep looking, don't break
          }
        }
        if ( _status === red[500] ) { 
          setCvIstatus(<DoneOutlineOutlinedIcon style={{ color: red[500] }} />)
        } else if ( _status === yellow[500]  ) {
          setCvIstatus(<DoneOutlineOutlinedIcon style={{ color: yellow[500] }} />)
        } else {
          console.log("set to green")
          setTimeout( () => setCvIstatus(<DoneOutlineOutlinedIcon style={{ color: green[500] }} />), 1)
        }
        //setTimeout( () => setCvStatus(_status), 1);
        onContentValidation && onContentValidation(data) // set to results
        console.log("CV Status,Results:",_status,data)
        console.log("colors red, yellow, green, grey", red[500], yellow[500], green[500], grey[900])
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
          {cvIstatus}
        </IconButton>
      </Tooltip>
  )
}

export default ValidateContent