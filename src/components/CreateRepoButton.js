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


function CreateRepoButton({ active, server, owner, repo, bookId, refresh, onRefresh }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const [submitCreate, setSubmitCreate] = useState(false)
   
  useEffect(() => {
    if ( !submitCreate ) return;

    async function doSubmitCreate() {
      const tokenid = authentication.token.sha1;
      const resourceId = repo.split('_')[1];

      const res = await dcsApis.repoCreate({server: server, username: owner, repository: repo, tokenid})
    
      if (res.status === 201) {
        console.log("Repo Created! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
        const manifestCreateRes = await dcsApis.manifestCreate({
          server: server, 
          username: owner, 
          repository: repo, 
          bookId, tokenid
        })
        if ( manifestCreateRes.status === 201 ) {
          console.log("Manifest Created! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
        } else {
          console.log('Manifest Create Error:', manifestCreateRes)
          console.log("Manifest Failed! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
        }
      } else {
          console.log('Repo Create Error:', res)
          console.log("Repo Failed! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
        }
      onRefresh(resourceId)    
    }
    doSubmitCreate()
  }, [submitCreate, server, owner, repo, onRefresh])
    
  const classes = useStyles({ active })
  return (
      <Tooltip title="Create Repo">
        <IconButton className={classes.iconButton} onClick={() => setSubmitCreate(true)} aria-label="Create Repo">
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
  )
}

export default CreateRepoButton
