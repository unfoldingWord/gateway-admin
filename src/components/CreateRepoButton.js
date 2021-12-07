import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import MuiAlert from '@material-ui/lab/Alert'
import { AuthContext } from '@context/AuthContext'
import * as dcsApis from '@utils/dcsApis'


function Alert({ severity, message, onDismiss }) {

  return (
    <MuiAlert
      className='w-full mt-8 mb-4'
      elevation={6}
      variant='filled'
      severity={severity}
      action={
        severity === 'success' && (
          <Button color='inherit' size='small' 
            onClick={() => onDismiss() }>
            OK
          </Button>
        )
      }
    >
      {message}
    </MuiAlert>
  )
}

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


function CreateRepoButton({ active, server, owner, repo }) {
  console.log("CreateRepoButton() active, server, owner, repo:", active, server, owner, repo)
  const {authentication} = useContext(AuthContext)

  const [submitCreate, setSubmitCreate] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
   
  useEffect(() => {
    if ( !submitCreate ) return;

    
    async function doSubmitCreate() {
      const tokenid = authentication.token.sha1;
      const res = await dcsApis.repoCreate({server: server, username: owner, repository: repo, tokenid})
    
      if (res.status === 201) {
        setShowSuccess(true)
        const manifestCreateRes = await dcsApis.manifestCreate({username: owner, repository: repo, tokenid})
        if ( manifestCreateRes.status === 201 ) {
          setShowSuccess(true)
        } else {
          setErrorMessage('Repo created, but manifest creation failed with Error: '+manifestCreateRes.status+' ('+manifestCreateRes.statusText+')')
          setShowError(true)
        }
      } else {
          console.log('response:', res)
          setErrorMessage('Error: '+res.status+' ('+res.statusText+')')
          setShowError(true)
      }
    
    }
    
    doSubmitCreate();
    setSubmitCreate(false);
  }, [submitCreate, server, owner, repo])
    
  function dismissAlert() {
    setShowError(false);
    setShowSuccess(false);
  }
    
  const classes = useStyles({ active })
  return (
    <div>
      <Button className={classes.root} onClick={() => setSubmitCreate(true)} >
          Create Repo
      </Button>
      {showSuccess || showError ? (
          <Alert
            onDismiss={() => dismissAlert()}
            severity={showSuccess ? 'success' : 'error'}
            message={
            showSuccess
                ? `Repo Created!`
                : errorMessage
            }
          />
      ) : null}
    </div>
  )
}

export default CreateRepoButton
