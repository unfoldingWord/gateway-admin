import {WORKING,REPO_NOT_FOUND,BOOK_NOT_IN_MANIFEST,
  OK, NO_MANIFEST_FOUND, NO_FILES_IN_REPO, MANIFEST_NOT_YAML,
}
from '@common/constants'

import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import CreateIcon from '@material-ui/icons/Create'
import BlockIcon from '@material-ui/icons/Block'
import GetAppIcon from '@material-ui/icons/GetApp';

import CreateRepoButton from './CreateRepoButton'
import AddBookToManifest from './AddBookToManifest'
import AddManifest from './AddManifest'
import ReplaceManifest from './ReplaceManifest'

import ViewListButton from './ViewListButton'
import ValidateContent from './ValidateContent'
import DownloadCvResults from './DownloadCvResults'


export function applyIcon(server,owner,bookId,
  refresh,setRefresh,repo,repoErr,bookErr,manifest,manifestSha,
  missingList,filename,setContentValidation,validationResults,getAllValidationResults,
) {
  // console.log("applyIcon() parameters:",`repo:${repo}
  //   repoErr:${repoErr}
  //   bookErr:${bookErr}
  //   manifest:${manifest}
  //   manifestSha:${manifestSha}
  // `)
  if ( repo.endsWith("_tw") || repo.endsWith("_ta") ) {
    if ( repoErr === null && bookErr === WORKING ) {
      return (
        <p>{WORKING}</p>
      )
    }
  }

  let _validationResults = true
  if ( validationResults === null || validationResults === undefined ) { _validationResults = false }
  if ( _validationResults ) {
    return (
      // <Tooltip title="Download all content validation results">
      //   <GetAppIcon aria-label="Download CV results" />
      // </Tooltip>
      <DownloadCvResults active={true} 
        validationResults={validationResults}
        getAllValidationResults={getAllValidationResults}
        bookId={bookId}
      />
    )
}

  if ( repoErr === null && bookErr === null ) {
    return (
      <p>{WORKING}</p>
    )
  }

  if ( repoErr === REPO_NOT_FOUND ) {
    return (
      <CreateRepoButton active={true} server={server} owner={owner} 
      repo={repo} refresh={refresh} bookId={bookId} onRefresh={setRefresh} />
    )
  }

  if ( repoErr === NO_MANIFEST_FOUND || repoErr === NO_FILES_IN_REPO ) {
    return (
      <AddManifest active={true} server={server} owner={owner} 
      repo={repo} refresh={refresh} onRefresh={setRefresh} />
    )
  }

  if ( repoErr === MANIFEST_NOT_YAML ) {
    return (
      <ReplaceManifest 
        active={true} server={server} owner={owner} repo={repo} refresh={refresh} 
        sha={manifestSha} onRefresh={setRefresh} 
      />
    )
  }

  if ( repoErr !== null ) {
    return (
      <p>{repoErr}</p>
    )
  }

  if ( bookErr === OK ) {
    // return (
    //   <DoneIcon />
    // )
    return (
      <ValidateContent 
        active={true} server={server} owner={owner} 
        repo={repo} refresh={refresh} 
        filename={filename} bookId={bookId} onRefresh={setRefresh} 
        onContentValidation={setContentValidation}
      />
    )
  }

  if ( bookErr === BOOK_NOT_IN_MANIFEST ) {
    return (
      <AddBookToManifest 
        active={true} server={server} owner={owner} repo={repo} refresh={refresh} 
        manifest={manifest} sha={manifestSha} bookId={bookId} onRefresh={setRefresh} 
      />
    )
  }

  if ( bookErr.endsWith('Missing') ) {
    if ( repo.endsWith("_tw") ) {
      const title = "Translation Word Articles Missing"
      return (
        <ViewListButton title={title} value={missingList} />
      )
    } else {
      const title = "Translation Academy Articles Missing"
      return (
        <ViewListButton title={title} value={missingList} />
      )
    }
  }

  if ( bookErr !== null ) {
    if ( repo.endsWith("_tw") ) {
      return (
        <Tooltip title="Use tC Create to create translation word list">
          <IconButton aria-label="Use-tc-create-tw">
            <BlockIcon />
          </IconButton>
        </Tooltip>
      )
    }
    if ( repo.endsWith("_ta") ) {
      return (
        <Tooltip title="Use tC Create to create translation notes">
          <IconButton aria-label="Use-tc-create-ta">
            <BlockIcon />
          </IconButton>
        </Tooltip>
      )
    }
    return (
      <Tooltip title="Use tC Create to create file">
        <IconButton aria-label="Use-tc-create">
          <CreateIcon/>
        </IconButton>
      </Tooltip>

    )
  }

}
