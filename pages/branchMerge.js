import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { makeStyles } from '@material-ui/core/styles'
import Paper from 'translation-helps-rcl/dist/components/Paper'

import {
  Grid, Link, Box, Divider, Container,
} from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import Button from '@material-ui/core/Button'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import { AuthenticationContext } from 'gitea-react-toolkit'
import Layout from '@components/Layout'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { resourceSelectList, resourceIdMapper } from '@common/ResourceList'

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
}))

const BranchMerge = () => {
  const classes = useStyles()

  const router = useRouter()

  const [resourceState, setResourceState] = useState('')

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

  const resources = resourceSelectList()

  const handleResourceChange = (event) => {
    const item = event.target.name
    const isChecked = event.target.checked
    const newMap = new Map(releaseResources)

    if ( isChecked ) {
      newMap.set(item, isChecked)
      prepResourceForRelease(item)
    } else {
      newMap.delete(item)
    }
    setReleaseResources(newMap)
  }


  return (
    <>
      <Layout>
        <Paper>
          <div className='flex flex-col justify-center items-center'>
            <div className='flex flex-col w-full px-4 lg:w-132 lg:p-0'>
              <h1 className='mx-4'>No Conflict Merge Management</h1>
              <FormControl required component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Select a Resource</FormLabel>
                <FormGroup>
                  <RadioGroup
                    aria-labelledby="release-type-radio-buttons-group-label"
                    defaultValue="prod"
                    name="release-type-radio-buttons-group"
                    row
                    value={resourceState}
                    onChange={handleResourceChange}
                  >
                    {resources.map( ({ id,name }) =>
                      <FormControlLabel key={id} value={id} control={<Radio />} label={name} />,
                    )}
                  </RadioGroup>

                </FormGroup>
                <FormHelperText />
              </FormControl>
              <p>here is where a branch picker goes</p>
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
