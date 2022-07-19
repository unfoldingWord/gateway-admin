import React, {
  useContext, useEffect, useState,
} from 'react'
import Paper from 'translation-helps-rcl/dist/components/Paper'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'

import { StoreContext } from '@context/StoreContext'
import { AdminContext } from '@context/AdminContext'
import { resourceSelectList } from '@common/ResourceList'
import { validManifest } from '@utils/dcsApis'
import { resourceIdMapper } from '@common/ResourceList'

const useStyles = makeStyles(theme => ({
  formControl: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    minWidth: '100%',
  },
}))

export default function ReleaseSettings() {
  const classes = useStyles()

  const [textDisabled, setTextDisabled] = useState(true)
  const [manifestValid, setManifestValid] = useState({})

  const {
    state: {
      owner: organization,
      languageId,
      server,
    },
  } = useContext(StoreContext)

  const {
    state: {
      releaseResource,
      // releaseVersion,
      // releaseNotes,
      // releaseName,
      releaseState,
    },
    actions: {
      setReleaseResource,
      setReleaseVersion,
      setReleaseNotes,
      setReleaseName,
      setReleaseState,
    }
  } = useContext(AdminContext)

  const handleResourceChange = (event, newvalue) => {
    setReleaseResource(newvalue)
    // setTimeout( () => console.log("new resource=",releaseResource), 1)
  }
  const handleVersionChange = event => {
    setReleaseVersion(event.target.value)
    // setTimeout( () => console.log("new version=",releaseVersion), 1)
  }
  const handleReleaseNotesChange = event => {
    setReleaseNotes(event.target.value)
    // setTimeout( () => console.log("new version=",releaseVersion), 1)
  }
  const handleReleaseNameChange = event => {
    setReleaseName(event.target.value)
    // setTimeout( () => console.log("new version=",releaseVersion), 1)
  }
  const handleReleaseStateChange = event => {
    setReleaseState(event.target.value)
    // setTimeout( () => console.log("new version=",releaseVersion), 1)
  }

  useEffect( () => {
    async function checkValidManifest() {
      const _resourceId = resourceIdMapper(organization, releaseResource.id)
      const _validManifest = await validManifest({server, organization, languageId, resourceId: _resourceId})
      setManifestValid(_validManifest)
      setTextDisabled(false)
    }
    if ( releaseResource ) {
      checkValidManifest()
    }
  }, [releaseResource])

  const defaultProps = {
    options: resourceSelectList(),
    getOptionLabel: (option) => option.name,
    getOptionSelected: (option, value) => option.name === value.name
  };

  return (
    <>
      <Paper className='flex flex-col h-90 w-full p-6 pt-3 my-2'>
        <p><b>Release Repository Settings for Organization</b> <i>{organization}</i> <b>and Language ID</b> <i>{languageId}</i></p>
        <div className='flex flex-col justify-between'>
          <FormControl variant='outlined' className={classes.formControl} >
            <Autocomplete
              {...defaultProps}
              id="select-resource"
              // value={resource}
              onChange={handleResourceChange}
              renderInput={(params) => <TextField {...params} 
              label="Select Resource" margin="normal" />}
            />      
          </FormControl>
          <FormControl>
          <FormLabel id="release-type-radio-buttons-group-label">Release Type</FormLabel>
            <RadioGroup
              aria-labelledby="release-type-radio-buttons-group-label"
              defaultValue="prod"
              name="release-type-radio-buttons-group"
              row
              value={releaseState}
              onChange={handleReleaseStateChange}
            >
              <FormControlLabel value="prod" control={<Radio />} label="Production" />
              <FormControlLabel value="prerelease" control={<Radio />} label="Pre-Release" />
            </RadioGroup>
          </FormControl>
          <p>Last Release Version is: 
            { manifestValid && manifestValid.message && <i> {manifestValid.message}</i>
              ||
              <i> (Please select resource first)</i>
            }
          </p>
          <FormControl variant='outlined' className={classes.formControl}>
            <TextField id="version" 
              variant='outlined'
              required={true} 
              label="Version" 
              // autoFocus={true}
              // defaultValue={version}
              type='text'
              onChange={handleVersionChange}
              disabled={textDisabled}
            />
          </FormControl>
          <FormControl variant='outlined' className={classes.formControl}>
            <TextField id="name" 
              variant='outlined'
              required={true} 
              label="Release Name" 
              // autoFocus={true}
              // defaultValue={version}
              type='text'
              onChange={handleReleaseNameChange}
              disabled={textDisabled}
            />
          </FormControl>
          <FormControl variant='outlined' className={classes.formControl}>
            <TextField id="releaseNotes" 
              variant='outlined'
              required={true} 
              label="Release Notes" 
              type='text'
              multiline={true}
              onChange={handleReleaseNotesChange}
              // disabled={textDisabled}
            />
          </FormControl>
        </div>
      </Paper>
    </>
  )
}

