import {
  useContext, useEffect, useState,
} from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

import Button from '@material-ui/core/Button'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { resourceSelectAllList, resourceIdMapper } from '@common/ResourceList'
import { getAllBranches } from '@utils/dcsApis'

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
}))

const BranchMerge = () => {
  const classes = useStyles()
  const [branches, setBranches] = useState([])
  const [branch, setBranch] = useState('')
  const [resourceId, setResourceId] = useState('')
  const router = useRouter()

  const { state: authentication } = useContext(AuthenticationContext)
  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  const {
    state: { releaseResources },
    actions: { setReleaseResources },
  } = useContext(AdminContext)

  const resources = resourceSelectAllList()

  const handleResourceChange = (event) => {
    console.log('handleResourceChange() event:', event.target.defaultValue)
    setResourceId(event.target.defaultValue)
  }

  useEffect( () => {
    async function fetchBranches() {
      const _rid = resourceIdMapper(organization,resourceId)
      const tokenid = authentication.token.sha1
      const allBranches = await getAllBranches( {
        server, organization, languageId, resourceId:_rid, tokenid,
      })
      console.log('allBranches', allBranches)
      setBranches(allBranches)
      setBranch('')
    }

    if ( resourceId !== '' ) {
      fetchBranches()
    }
  }, [resourceId, server, organization, languageId, authentication])

  const defaultProps = {
    options: branches,
    getOptionLabel: (option) => option ? option : '',
  }


  return (
    <>
      <Layout>
        <Paper>
          <div className='flex flex-col justify-center items-center'>
            <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
              <h1 className='mx-4'>No Conflict Merge Management</h1>
              <FormControl>
                <FormLabel id="resource-type-radio-buttons-group-label" component="legend">Select a Resource</FormLabel>
                <RadioGroup
                  aria-labelledby="resource-type-radio-buttons-group-label"
                  // defaultValue="lt"
                  name="resource-type-radio-buttons-group"
                  row
                  onChange={handleResourceChange}
                >
                  {resources.map( ({ id,name }) =>
                    <FormControlLabel key={id} value={id} control={<Radio />} label={name} />,
                  )}
                </RadioGroup>
              </FormControl>
              <Autocomplete
                {...defaultProps}
                id="select-branch"
                value={branch}
                onChange={(event, newValue) => {
                  console.log('Autocomplete() onchange() setValue:', newValue)
                  setBranch(newValue)
                }}
                renderInput={(params) => <TextField {...params} label="Select" margin="normal" />}
              />

              <div className='flex justify-end'>
                <Button
                  size='large'
                  color='primary'
                  className='my-3 mx-1'
                  variant='contained'
                >
              Update user branch with new stuff from Master
                </Button>
                <Button
                  size='large'
                  color='primary'
                  className='my-3 mx-1'
                  variant='contained'
                  //   disabled={!releaseActive}
                >
              Merge user branch into Master!
                </Button>
                <br/>
              </div>
            </div>
          </div>
        </Paper>
      </Layout>
    </>
  )
}

export default BranchMerge

/* code graveyard
              <FormControl required component="fieldset" className={classes.formControl}>


*/