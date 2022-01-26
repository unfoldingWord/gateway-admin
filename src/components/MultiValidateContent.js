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


function MultiValidateContent({ active, server, owner, repo, bookId, list, onRefresh, onContentValidation }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitValidateContent, setSubmitValidateContent] = useState(false)
   
  useEffect(() => {
    if ( !submitValidateContent ) return;

    async function doSubmitValidateContent() {
      const keys = Object.keys(list.Content)
      onContentValidation && onContentValidation(null) // set to null first

      // loop thru all the files and validate them
      let results = []
      for (let i=0; i<keys.length; i++) {
        const filename = keys[i]
        const content = list.Content[keys[i]]
        const data = await contentValidate(owner, repo, bookId.toUpperCase(), filename, content)
        if ( data.length < 2 ) continue
        if ( results.length === 0 ) {
          results.push(data)
        } else {
          results.push(data.slice(1))
        }
      }
      
      onContentValidation && onContentValidation(results) // set to results
      setSubmitValidateContent(false)
    }
    doSubmitValidateContent()
  }, [submitValidateContent, server, owner, repo, list, bookId, onRefresh])
  
  const classes = useStyles({ active })
  return (
      <Tooltip title={ `Validate Content for OBS` }>
        <IconButton className={classes.iconButton} 
          onClick={() => setSubmitValidateContent(true)} 
          aria-label="Validate Content">
          <DoneIcon />
        </IconButton>
      </Tooltip>
  )
}

export default MultiValidateContent