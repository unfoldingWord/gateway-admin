import Path from 'path'
import base64 from 'base-64'
import utf8 from 'utf8'
import YAML from 'js-yaml-parser'

import _ from 'lodash'
import { apiPath } from '@common/constants'
import getResourceManifest from '@common/manifests'
import getResourceManifestProject from '@common/manifestProjects'
import {
  ALL_BIBLE_BOOKS, BIBLES_ABBRV_INDEX, isNT,
} from '@common/BooksOfTheBible'
import { RESOURCES_WITH_NO_BOOK_FILES } from '@common/ResourceList'
import { isServerDisconnected } from './network'


/**
 * determine if version tag is formatted properly
 * @param {string} versionTag
 * @return {boolean}
 */
export function getNextVersionTag(versionTag) {
  let newVersion = versionTag

  // get to the integer we need
  if ( newVersion.startsWith('v') ) {
    // remove it
    newVersion = versionTag.substring(1)
  }

  if ( newVersion.includes('.') ) {
    newVersion = newVersion.split('.')[0]
  }

  let _newVersion = Number(newVersion)

  if (Number.isInteger(_newVersion) && _newVersion > 0) {
    _newVersion++
    newVersion = 'v'+_newVersion
  } else {
    newVersion = 'v1' // default to version 1 -- "v1"
  }
  return newVersion
}

/**
 * determine latest release version
 * @param {string} server
 * @param {string} organization
 * @param {string} languageId
 * @param {string} resourceId
 * @return {object}
 *                 shape of return object is {isValid: bool, message: string}
 */
export async function latestReleaseVersion({
  server, organization, languageId, resourceId,
}) {
  // example:
  // https://qa.door43.org/api/v1/repos/es-419_gl/es-419_tn/releases?draft=false&pre-release=false&page=1&limit=9999'
  const uri = server + '/' + Path.join('api','v1','repos',organization,`${languageId}_${resourceId}`,'releases?page=1&limit=1')

  const response = await fetch(uri)

  console.log(response)

  if (response.ok) {
    const body = await response.json()

    if ( body.length === 0 ) {
      return 'v0'
    } else {
      return body[0]['tag_name']
    }
  } else {
    throw new Error('Failed to get latest version: '+response.status)
  }
}


export function getResourceIdFromRepo(repo) {
  let resourceId = repo.split('_')[1]

  if ( resourceId === 'glt' || resourceId === 'ult' ) {
    resourceId = 'lt'
  } else if ( resourceId === 'gst' || resourceId === 'ust' ) {
    resourceId = 'st'
  }
  return resourceId
}

export async function repoCreate({
  server, username, repository, tokenid,
}) {
  const uri = server + '/' + Path.join(apiPath,'orgs',username,'repos')
  const res = await fetch(uri+'?token='+tokenid, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{
      "auto_init": true,
      "default_branch": "master",
      "description": "Init New Repo by Admin App",
      "gitignores": "macOS",
      "issue_labels": "",
      "license": "CC-BY-SA-4.0.md",
      "name": "${repository}",
      "private": false,
      "readme": "",
      "template": true,
      "trust_model": "default"
    }`,
  })

  return res
}

function getProject({
  resourceId, bookId, languageId,
}) {
  const project = getResourceManifestProject({ resourceId })

  project.title = ALL_BIBLE_BOOKS[bookId]
  project.identifier = bookId
  project.sort = parseInt(BIBLES_ABBRV_INDEX[bookId])

  switch ( resourceId ) {
  case 'lt':
  case 'st':
  case 'ult':
  case 'usl':
  case 'glt':
  case 'gst':
    project.path = './' + BIBLES_ABBRV_INDEX[bookId] + '-' + bookId.toUpperCase() + '.usfm'
    break
  case 'twl':
  case 'tn':
  case 'tq':
  case 'sn':
  case 'sq':
    project.path = './' + resourceId + '_' + bookId.toUpperCase() + '.tsv'
    break
  default:
    // error state.
  }

  if ( isNT(bookId) ) {
    project.categories = [ 'bible-nt' ]
  } else {
    project.categories = [ 'bible-ot' ]
  }

  return project
}

function addProject( {
  resourceId, manifest, bookId,
}) {
  let currentProjects = manifest.projects
  const project = getProject({ resourceId, bookId })

  // sort the projects using sort attribute
  let _projects

  if ( currentProjects === undefined || currentProjects[0] === null ) {
    _projects = [project]
  } else {
    _projects = [...currentProjects, project]
  }

  if ( _projects.length > 1 ) {
    _projects.sort(
      (a,b) => a.sort - b.sort,
    )
  }

  let _manifest = {
    ...manifest,
    projects: [..._projects],
  }
  // if ( currentProjects[0] === null ) {
  //   _manifest = {
  //     ...manifest,
  //     projects: [projectTemplate],
  //   }
  // } else {
  //   _manifest = {
  //     ...manifest,
  //     projects: [...currentProjects, projectTemplate],
  //   }
  // }
  const __manifest = YAML.safeDump(_manifest)

  return __manifest
}

export async function manifestAddBook({
  server, username, repository, manifest, sha, bookId, tokenid,
}) {
  const resourceId = repository.split('_')[1]
  // only applies to scripture oriented resources, skip tw and ta
  let _manifest

  if ( RESOURCES_WITH_NO_BOOK_FILES.includes ( resourceId ) ) {
    // skip adding book to project section
    _manifest = manifest
  } else {
    _manifest = addProject( {
      resourceId, manifest, bookId,
    })
  }

  const content = base64.encode(utf8.encode(_manifest))
  const uri = server + '/' + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml')
  const date = new Date(Date.now())
  const dateString = date.toISOString()
  const res = await fetch(uri+'?token='+tokenid, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: `{
      "author": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "branch": "master",
      "committer": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "content": "${content}",
      "dates": {
        "author": "${dateString}",
        "committer": "${dateString}"
      },
      "from_path": "manifest.yaml",
      "message": "Add Book ${bookId} to Manifest",
      "new_branch": "master",
      "sha": "${sha}",
      "signoff": true
    }`,
  })

  return res
}

//
// swagger: https://qa.door43.org/api/v1/swagger#/repository/repoCreateFile
// template: /repos/{owner}/{repo}/contents/{filepath}
// When a manifest is created as part of the repo create process, then
// the projects section of the manifest should only include the book
// selected by the user.
//
export async function manifestCreate({
  server, username, repository, bookId, tokenid,
}) {
  //const resourceId = getResourceIdFromRepo(repository)
  const resourceId = repository.split('_')[1]
  const manifestYaml = getResourceManifest( { resourceId } )

  const content = base64.encode(utf8.encode(manifestYaml))
  const uri = server + '/' + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml')
  const date = new Date(Date.now())
  const dateString = date.toISOString()
  const res = await fetch(uri+'?token='+tokenid, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{
      "author": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "branch": "master",
      "committer": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "content": "${content}",
      "dates": {
        "author": "${dateString}",
        "committer": "${dateString}"
      },
      "message": "Initialize Manifest - must be updated",
      "new_branch": "master"
    }`,
  })

  return res
}

export async function manifestReplace({
  server, username, repository, sha, tokenid,
}) {
  const resourceId = repository.split('_')[1]
  const manifestYaml = getResourceManifest( { resourceId } )
  const content = base64.encode(utf8.encode(manifestYaml))
  const uri = server + '/' + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml')
  const date = new Date(Date.now())
  const dateString = date.toISOString()
  const res = await fetch(uri+'?token='+tokenid, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: `{
      "author": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "branch": "master",
      "committer": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "content": "${content}",
      "dates": {
        "author": "${dateString}",
        "committer": "${dateString}"
      },
      "from_path": "manifest.yaml",
      "message": "Replace Manifest with valid YAML file",
      "new_branch": "master",
      "sha": "${sha}",
      "signoff": true
    }`,
  })

  return res
}

export async function updateBranchWithLatestBookFiles({
  releaseBranchName,
  server,
  organization,
  languageId,
  resourceId,
  tokenid,
  books,
  manifest,
}) {
  for (const bookId of books) {
    const project = manifest.projects.find( (item) => item.identifier === bookId)

    if ( ! project ) {
      throw new Error(`Unable to find ${bookId} in manifest.yaml`)
    }

    const path = project.path.substring(2) // remove './' from path.
    const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents',path)

    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(uri+'?token='+tokenid, { headers: { 'Content-Type': 'application/json' } })

    if (res.ok) {
      // eslint-disable-next-line no-await-in-loop
      const body = await res.json()
      const sha = body.sha

      const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents',path)
      // eslint-disable-next-line no-await-in-loop
      const fileExistsInReleaseBranch = await fetch(uri+'?token='+tokenid+'&ref='+releaseBranchName, { headers: { 'Content-Type': 'application/json' } })
      const updateUri = server + '/' + Path.join(apiPath, 'repos', organization, `${languageId}_${resourceId}`, 'contents', path)
      const date = new Date(Date.now())
      const dateString = date.toISOString()

      // eslint-disable-next-line no-await-in-loop
      const result = await fetch(updateUri + '?token=' + tokenid, {
        method: fileExistsInReleaseBranch.ok ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{
          "author": {
            "email": "info@unfoldingword.org",
            "name": "unfoldingWord"
          },
          "committer": {
            "email": "info@unfoldingword.org",
            "name": "unfoldingWord"
          },
          "content": "${body.content}",
          "dates": {
            "author": "${dateString}",
            "committer": "${dateString}"
          },
          "message": "Update ${path} from master to prepare for book package release",
          "branch": "${releaseBranchName}",
          "sha": "${sha}",
          "signoff": true
        }`,
      })

      if ( ! result.ok ) {
        // eslint-disable-next-line no-await-in-loop
        const body = await result.json()
        throw new Error(`API ${updateUri} failed with ${body.message ?? result.status}`)
      }
    } else {
      // eslint-disable-next-line no-await-in-loop
      const body = await res.json()
      throw new Error(`API ${uri} failed with ${body.message ?? res.status} ${body.errors ? body.errors.join(' ; ') : ''}`)
    }
  }
}

export async function updateManifest({
  server, organization, languageId, resourceId, tokenid, releaseBranchName, books, nextVersion, previousVersion, firstRelease,
}) {
  const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents','manifest.yaml')

  const res = await fetch(uri+'?token='+tokenid, { headers: { 'Content-Type': 'application/json' } })

  if ( ! res.ok ) {
    throw new Error(`Manifest.yaml missing at ${uri} in master`)
  }

  const body = await res.json()
  const sha = body.sha
  const content = atob(body.content)
  const manifest = YAML.load( content )

  if ( nextVersion.startsWith('v') ) {
    // remove it
    nextVersion = nextVersion.substring(1)
  }

  if ( previousVersion.startsWith('v') ) {
    // remove it
    previousVersion = previousVersion.substring(1)
  }
  manifest.dublin_core.version = nextVersion
  manifest.dublin_core.modified = manifest.dublin_core.issued = new Date().toISOString().slice(0, 10)

  for ( let source of manifest.dublin_core.source ) {
    if ( source.identifier === resourceId && source.language === languageId ) {
      source.version = previousVersion
    }
  }

  if ( ! RESOURCES_WITH_NO_BOOK_FILES.includes( resourceId ) ) {
    for ( let bookId of books ) {
      if ( !manifest.projects.find( ( item ) => item.identifier === bookId ) ) {
        const project = getProject( {
          bookId, resourceId, languageId,
        } )

        if ( project.path ) {
          const index = manifest.projects.findLastIndex( ( item ) => item.sort > project.sort )
          manifest.projects.splice( index, 0, project )
        }
      }
    }

    if ( firstRelease ) {
      manifest.projects = manifest.projects.filter( (item) => books.includes(item.identifier))
    }
  }

  const updatedRes = await updateManifestInBranch({
    server, organization, languageId, resourceId, tokenid, branch:releaseBranchName, manifest, sha,
  })

  if ( ! updatedRes.ok ) {
    const body = await updatedRes.json()
    throw new Error(`Update Manifest API call for branch ${releaseBranchName} failed with ${body.message ?? res.status}`)
  }

  return manifest
}

async function updateManifestInBranch({
  server, organization, languageId, resourceId, tokenid, branch, manifest,
}) {
  const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents','manifest.yaml')
  const releaseBranchRes = await fetch(uri+'?token='+tokenid+'&ref='+branch, { headers: { 'Content-Type': 'application/json' } })

  if ( ! releaseBranchRes.ok ) {
    throw new Error('Failed to get manifest.yaml in release branch')
  }

  const body = await releaseBranchRes.json()
  const newYAML = YAML.dump(manifest)
  const newContent = btoa(newYAML)
  const updateUri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents','manifest.yaml')
  const date = new Date(Date.now())
  const dateString = date.toISOString()

  return fetch(updateUri+'?token='+tokenid, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: `{
      "author": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "committer": {
        "email": "info@unfoldingword.org",
        "name": "unfoldingWord"
      },
      "content": "${newContent}",
      "dates": {
        "author": "${dateString}",
        "committer": "${dateString}"
      },
      "from_path": "manifest.yaml",
      "message": "Replace Manifest with valid YAML file",
      "branch": "${branch}",
      "sha": "${body.sha}",
      "signoff": true
    }`,
  })
}

export async function branchExists({
  server, organization, languageId, resourceId, tokenid, branch,
}) {
  const exists = await fetch(server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'branches',branch)+'?token='+tokenid,
    { headers: { 'Content-Type': 'application/json' } },
  )
  return 200 === exists.status
}

async function deleteAllBookFiles( {
  releaseBranchName,
  server,
  organization,
  languageId,
  resourceId,
  tokenid,
  resourceTree,
} ) {
  for ( const file of resourceTree ) {
    if ( file.path.endsWith('.tsv') ) {
      const updateUri = server + '/' + Path.join(apiPath, 'repos', organization, `${languageId}_${resourceId}`, 'contents', file.path)
      const date = new Date(Date.now())
      const dateString = date.toISOString()

      // eslint-disable-next-line no-await-in-loop
      await fetch(updateUri + '?token=' + tokenid, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: `{
        "author": {
          "email": "info@unfoldingword.org",
          "name": "unfoldingWord"
        },
        "committer": {
          "email": "info@unfoldingword.org",
          "name": "unfoldingWord"
        },
        "dates": {
          "author": "${dateString}",
          "committer": "${dateString}"
        },
        "message": "Delete work in progress ${file.path} to prepare for release",
        "branch": "${releaseBranchName}",
        "sha": "${file.sha}",
        "signoff": true
      }`,
      })
    }
  }
}

/**
 * Create a new release from the master branch
 * @param {string} server
 * @param {string} organization
 * @param {string} languageId
 * @param {string} resourceId
 * @param {array} books
 * @param {string} notes
 * @param {string} name
 * @param {string} state
 * @param {string} tokenid
 * @param {array} resourceTree
 * @return {object} response
 */
export async function createRelease({
  server, organization, languageId, resourceId, books, notes, name, state, tokenid, resourceTree,
}) {
  let val = {}

  try {
    let firstRelease = false
    const previousVersion = await latestReleaseVersion({
      server, organization,languageId,resourceId,
    })

    const nextVersion = getNextVersionTag(previousVersion)

    let releaseBranchName = 'release_'+nextVersion
    let oldBranchName = 'release_'+previousVersion

    if ( RESOURCES_WITH_NO_BOOK_FILES.includes( resourceId ) ) {
      releaseBranchName = 'master'
    } else {
      const releaseBranchExists = await branchExists( {
        server, organization, languageId, resourceId, tokenid, branch: releaseBranchName,
      } )

      const oldBranchExists = await branchExists( {
        server, organization, languageId, resourceId, tokenid, branch: oldBranchName,
      } )

      if ( ! oldBranchExists ) {
        oldBranchName = 'master'
        firstRelease = true
      }

      if ( releaseBranchExists ) {
        await fetch( server + '/' + Path.join( apiPath, 'repos', organization, `${ languageId }_${ resourceId }`, 'branches', releaseBranchName ) + '?token=' + tokenid,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      await fetch( server + '/' + Path.join( apiPath, 'repos', organization, `${ languageId }_${ resourceId }`, 'branches' ) + '?token=' + tokenid, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{
          "new_branch_name": "${ releaseBranchName }",
          "old_branch_name": "${ oldBranchName }"
        }`,
      } )
    }

    const manifest = await updateManifest( {
      server,
      organization,
      languageId,
      resourceId,
      tokenid,
      releaseBranchName,
      books,
      previousVersion,
      nextVersion,
      firstRelease,
    })

    if ( firstRelease ) {
      await deleteAllBookFiles({
        releaseBranchName,
        server,
        organization,
        languageId,
        resourceId,
        tokenid,
        resourceTree,
      })
    }

    if (releaseBranchName !== 'master') {
      await updateBranchWithLatestBookFiles( {
        releaseBranchName,
        server,
        organization,
        languageId,
        resourceId,
        tokenid,
        books,
        manifest,
      } )
    }

    console.log(`
      Name: ${name}
      Notes: ${notes}
      Version: ${nextVersion}
      State: ${state}
    `)

    let prerelease = state === 'prerelease'

    // Deleting any existing tags with same name.
    await fetch( server + '/' + Path.join( apiPath, 'repos', organization, `${ languageId }_${ resourceId }`, 'tags', nextVersion ) + '?token=' + tokenid, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    } )

    const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'releases')

    const res = await fetch(uri+'?token='+tokenid, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "tag_name": "${nextVersion}",
        "target_commitish": "${releaseBranchName}",
        "name": "${name}",
        "body": "${notes}",
        "draft": false,
        "prerelease": ${prerelease}
      }`,
    })

    if ( res.status === 201 ) {
      val.status = true
      val.message = `Created release ${nextVersion} of ${languageId}_${resourceId}`
      val.version = nextVersion

      // Update manifest in master after release.
      if (releaseBranchName !== 'master') {
        const updatedRes = await updateManifestInBranch({
          server, organization, languageId, resourceId, tokenid, branch:'master', manifest,
        })

        if ( ! updatedRes.ok ) {
          console.warn(`failed to update master manifest.yaml ${updatedRes.status}`)
        }
      }
    } else if ( res.status === 404 ) {
      val.status = false
      val.message = `Repo does not exist (404): ${languageId}_${resourceId}`
    } else {
      val.status = false
      const body = await res.json()
      val.message = `Unexpected response: status ${res.status}, message ${body.message}`
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)

    console.warn(
      `createRelease() - error creating release,
      message '${message}',
      disconnected=${disconnected},
      Error:`,
      e,
    )
    val.status = false
    val.message = `Error: Disconnected=${disconnected}, Error: ${message}`
  }
  return val
}
