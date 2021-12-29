import {WORKING,REPO_NOT_FOUND,BOOK_NOT_IN_MANIFEST,OK}
from '@common/constants'

import { Tooltip } from '@material-ui/core'
import { IconButton } from '@material-ui/core'
import CreateIcon from '@material-ui/icons/Create'
import DoneIcon from '@material-ui/icons/Done'
import BlockIcon from '@material-ui/icons/Block'

import CreateRepoButton from './CreateRepoButton'
import AddBookToManifest from './AddBookToManifest'

import ViewListButton from './ViewListButton'


export function applyIcon(repo,repoErr,bookErr,manifest,manifestSha) {
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

  if ( repoErr !== null ) {
    return (
      <p>{repoErr}</p>
    )
  }

  if ( bookErr === OK ) {
    return (
      <DoneIcon />
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
        <ViewListButton title={title} value={twMissing} />
      )
    } else {
      const title = "Translation Academy Articles Missing"
      return (
        <ViewListButton title={title} value={taMissing} />
      )
    }
  }

  if ( bookErr !== null ) {
    if ( repo.endsWith("_tw") ) {
      return (
        <Tooltip title="Use tC Create to create translation word list">
          <IconButton className={classes.iconButton} aria-label="Use-tc-create-tw">
            <BlockIcon />
          </IconButton>
        </Tooltip>
      )
    }
    if ( repo.endsWith("_ta") ) {
      return (
        <Tooltip title="Use tC Create to create translation notes">
          <IconButton className={classes.iconButton} aria-label="Use-tc-create-ta">
            <BlockIcon />
          </IconButton>
        </Tooltip>
      )
    }
    return (
      <Tooltip title="Use tC Create to create file">
        <IconButton className={classes.iconButton} aria-label="Use-tc-create">
          <CreateIcon/>
        </IconButton>
      </Tooltip>

    )
  }

}
