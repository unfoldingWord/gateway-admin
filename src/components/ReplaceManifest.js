import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import * as dcsApis from '@utils/dcsApis'
// import { BIBLE_AND_OBS } from '@common/BooksOfTheBible'

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


function ReplaceManifest({ active, server, owner, repo, sha, onRefresh }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitReplaceManifest, setSubmitReplaceManifest] = useState(false)
   
  useEffect(() => {
    if ( !submitReplaceManifest ) return;

    async function doSubmitReplaceManifest() {
      const tokenid = authentication.token.sha1;
      const resourceId = dcsApis.getResourceIdFromRepo(repo)
      const manifestCreateRes = await dcsApis.manifestReplace({
        server: server, 
        username: owner, 
        repository: repo, 
        sha, tokenid,
      })
      if ( manifestCreateRes.status === 200 ) {
        console.log("Manifest Created! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
      } else {
        console.log('Manifest Create Error:', manifestCreateRes)
        console.log("Manifest Failed! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
      }
        setSubmitReplaceManifest(false)
        onRefresh(resourceId)    
    }
    doSubmitReplaceManifest()
  }, [submitReplaceManifest, server, owner, repo, sha, onRefresh])
    
  const classes = useStyles({ active })
  return (
      <Tooltip title={`Replace manifest in repository`}>
        <IconButton className={classes.iconButton} 
            onClick={() => setSubmitReplaceManifest(true)} aria-label="Replace Manifest">
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
  )
}

export default ReplaceManifest