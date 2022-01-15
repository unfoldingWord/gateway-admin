import {useState, useEffect, useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GetAppIcon from '@material-ui/icons/GetApp';
import { green, red, yellow, grey } from '@material-ui/core/colors'
import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

import { AuthContext } from '@context/AuthContext'
import * as cvs from '@utils/csvMaker'

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


function DownloadCvResults({ active, bookId, getAllValidationResults }) {
  const [submitDownloadCvResults, setSubmitDownloadCvResults] = useState(false)
   
  useEffect(() => {
    console.log("useEffect() in DownloadCvResults()")
    if ( !submitDownloadCvResults ) return;

    async function doSubmitDownloadCvResults() {
      console.log("doSubmitDownloadCvResults()")
      const results = getAllValidationResults()
      let ts = new Date().toISOString();
      let fn = 'gaValidationResults-' + bookId + '-' + ts + '.csv';

      cvs.download(fn,results)
      setSubmitDownloadCvResults(false)
    }
    doSubmitDownloadCvResults()
  }, [submitDownloadCvResults, bookId])
  

  const classes = useStyles({ active })
  return (
    <Tooltip title="Download all content validation results">
      <IconButton className={classes.iconButton} onClick={() => setSubmitDownloadCvResults(true)} aria-label="Download CV Results">
        <GetAppIcon aria-label="Download CV results" />
      </IconButton>
    </Tooltip>
  )
}

export default DownloadCvResults