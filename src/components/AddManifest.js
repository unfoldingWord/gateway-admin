import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import { StoreContext } from '@context/StoreContext'
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


function AddManifest({ active, server, owner, repo, manifest, onRefresh }) {
  const {
    state: {
      authentication,
    },
  } = useContext(AuthContext)

  const { state: { languageId } } = useContext(StoreContext)

  const [submitAddManifest, setSubmitAddManifest] = useState(false)

  useEffect(() => {
    if ( !submitAddManifest ) return;

    async function doSubmitAddManifest() {
      const tokenid = authentication.token.sha1;
      const resourceId = dcsApis.getResourceIdFromRepo(repo)
      const manifestCreateRes = await dcsApis.manifestCreate({
        server: server,
        username: owner,
        repository: repo,
        tokenid,
        languageId,
      })
      if ( manifestCreateRes.status === 201 ) {
        console.log("Manifest Created! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
      } else {
        console.log('Manifest Create Error:', manifestCreateRes)
        console.log("Manifest Failed! Parameters:",`Server:${server}, Owner:${owner}, Repo:${repo}`)
      }
        setSubmitAddManifest(false)
        onRefresh(resourceId)
    }
    doSubmitAddManifest()
  }, [submitAddManifest, server, owner, repo, manifest, onRefresh])

  const classes = useStyles({ active })
  return (
      <Tooltip title={`Add manifest to repository`}>
        <IconButton className={classes.iconButton} onClick={() => setSubmitAddManifest(true)} aria-label="Add Manifest">
          <AddCircleIcon />
        </IconButton>
      </Tooltip>
  )
}

export default AddManifest
