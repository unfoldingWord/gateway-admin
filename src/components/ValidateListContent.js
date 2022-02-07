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
import { contentValidate, locateContent } from '@utils/contentValidation'
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


function ValidateListContent({ active, server, owner, repo, bookId, list, onRefresh, onContentValidation, onAction }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitValidateListContent, setSubmitValidateListContent] = useState(false)
   
  useEffect(() => {
    if ( !submitValidateListContent ) return;

    async function doSubmitValidateListContent() {
      onAction && onAction(RETRIEVING)
      onContentValidation && onContentValidation(null) // set to null first
      const files = list.Present
      let results = []
      for (let i=0; i<files.length; i++) {
        let url = `${server}/${owner}/${repo}/raw/branch/master/${files[i]}`
        if ( repo.endsWith("_ta") ) {
          url += "/01.md"
        }
        const content = locateContent(url, authentication)
        if ( content ) {
          const data = await contentValidate(owner, repo, bookId.toUpperCase(), files[i], content)
          if ( data.length < 2 ) continue
          if ( results.length === 0 ) {
            // keeping the header row on first push
            results.push( ...data )
          } else {
            // omitting the header row after first push
            results.push( ...data.slice(1))
          }
        }

      }
      onContentValidation && onContentValidation(results) // set to results
      onAction && onAction(VALIDATION_FINISHED)
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