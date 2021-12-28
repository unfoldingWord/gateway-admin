import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import * as dcsApis from '@utils/dcsApis'

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


function AddBookButton({ active, server, owner, repo, manifest, sha, bookId, onRefresh }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitAddBook, setSubmitAddBook] = useState(false)
   
  useEffect(() => {
    if ( !submitAddBook ) return;

    async function doSubmitAddBook() {
      const tokenid = authentication.token.sha1;
      const resourceId = dcsApis.getResourceIdFromRepo(repo)
      const res = await dcsApis.manifestAddBook({server: server, username: owner, repository: repo, manifest: manifest, sha: sha, bookId: bookId, tokenid: tokenid})
      if ( res.status === 200 ) {
        console.log("Book added to manifest. Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
        console.log("Refreshing:",resourceId)
        onRefresh(null) // note: this resets it in case the prior value was the same as the new value
        // now wait a bit and set the refresh value to what we really need
        setTimeout( () => onRefresh(resourceId), 1);
      } else {
        console.log('Add Book to Manifest Error:', res)
        console.log("Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo},
          bookId:${bookId},
          manifestSha:${sha},
          manifest:
        `,manifest)
      }
      setSubmitAddBook(false)
    }
    doSubmitAddBook()
  }, [submitAddBook, server, owner, repo, manifest, bookId, onRefresh])
    
  const classes = useStyles({ active })
  return (
      <Tooltip title="Add Book">
        <IconButton className={classes.iconButton} onClick={() => setSubmitAddBook(true)} aria-label="Add Book">
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
  )
}

export default AddBookButton