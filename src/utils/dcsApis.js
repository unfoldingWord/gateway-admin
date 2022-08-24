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
import { doFetch, isServerDisconnected } from './network'

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

function getProject({ resourceId, bookId, languageId }) {
  const project = getResourceManifestProject({ resourceId })

  project.title = ALL_BIBLE_BOOKS[bookId]
  project.identifier = bookId
  project.sort = parseInt(BIBLES_ABBRV_INDEX[bookId])

  if ( resourceId === 'lt' || resourceId === 'st' ) {
    project.path = './' + BIBLES_ABBRV_INDEX[bookId] + '-' + bookId.toUpperCase() + '.usfm'
  } else if ( resourceId === 'twl' ) {
    project.path = './twl_' + bookId.toUpperCase() + '.tsv'
  } else if ( resourceId === 'tn' ) {
    project.path = './'+languageId+'_tn_' +BIBLES_ABBRV_INDEX[bookId]+'-'+ bookId.toUpperCase() + '.tsv'
  } else if ( resourceId === 'tq' ) {
    project.path = './tq_' + bookId.toUpperCase() + '.tsv'
  } else if ( resourceId === 'sn' ) {
    project.path = './sn_' + bookId.toUpperCase() + '.tsv'
  } else if ( resourceId === 'sq' ) {
    project.path = './sq_' + bookId.toUpperCase() + '.tsv'
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

  if ( resourceId === 'ta' || resourceId === 'tw' ) {
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

/**
 * determine if version tag is formatted properly
 * @param {string} versionTag
 * @return {boolean}
 */
export function validVersionTag(versionTag) {
  // if ( !versionTag.startsWith("v") ) return false

  return true
}


/**
 * determine if version tag is formatted properly
 * @param {string} server
 * @param {string} organization
 * @param {string} languageId
 * @param {string} resourceId
 * @return {object}
 *                 shape of return object is {isValid: bool, message: string}
 */
export async function validManifest({
  server, organization, languageId, resourceId,
}) {
  // example:
  // https://qa.door43.org/api/catalog/v5/entry/es-419_gl/es-419_tn/master
  const uri = server + '/' + Path.join('api','catalog','v5','entry',organization,`${languageId}_${resourceId}`,'master')
  let val = {}

  try {
    const response = await doFetch(uri)

    if (response.status === 200) {
      // master branch is in the catalog, thus must have a valid manifest
      // now fetch the latest release!
      val = await latestReleaseVersion({
        server, organization, languageId, resourceId,
      })
    } else if (response.status === 404) {
      val.isValid = false
      val.message = `Repo does not exist: ${languageId}_${resourceId}`
    } else if (response.status === 500) {
      val.isValid = false
      val.message = 'Repo does not have a valid manifest'
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)

    console.warn(`validManifest() - error fetching releases,
      message '${message}',
      disconnected=${disconnected},
      url ${uri}
      Error:`,
    e)
    val.isValid = false
    val.message = `Network Error: Disconnected=${disconnected}, Error: ${message}`
  }
  return val
}

/**
 * determine if version tag is formatted properly
 * @param {string} server
 * @param {string} organization
 * @param {string} languageId
 * @param {string} resourceId
 * @return {object}
 *                 shape of return object is {isValid: bool, message: string}
 */
async function latestReleaseVersion( {
  server, organization, languageId, resourceId,
}) {
  // example:
  // https://qa.door43.org/api/v1/repos/es-419_gl/es-419_tn/releases?draft=false&pre-release=false&page=1&limit=9999'
  const uri = server + '/' + Path.join('api','v1','repos',organization,`${languageId}_${resourceId}`,'releases?page=1&limit=9999')
  let val = {}

  try {
    const response = await doFetch(uri)

    if (response.status === 200) {
      // master branch is in the catalog, thus must have a valid manifest
      // now fetch the latest release!
      val.isValid = true

      if ( response.data.length === 0 ) {
        val.message = 'No releases yet, use "v1"'
      } else {
        val.message = response.data[0]['tag_name']
      }
    } else if (response.status === 404) {
      val.isValid = false
      val.message = `Repo does not exist: ${languageId}_${resourceId}`
    } else {
      val.isValid = false
      val.message = 'Unexpected status returned:'+response.status
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)

    console.warn(`latestReleaseVersion() - error fetching releases,
      message '${message}',
      disconnected=${disconnected},
      url ${uri}
      Error:`,
    e)
    val.isValid = false
    val.message = `Network Error: Disconnected=${disconnected}, Error: ${message}`
  }
  return val
}
export async function updateBranchWithLatestBookFiles({
  releaseBranchName,
  server,
  organization,
  languageId,
  resourceId,
  tokenid,
  books,
}) {
  const result = await Promise.all(books.map( async (bookId) => {
    const project = getProject({ bookId, resourceId, languageId })
    const path = project.path.substring(2) // remove './' from path.
    const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents',path)

    const res = await fetch(uri+'?token='+tokenid, { headers: { 'Content-Type': 'application/json' } })

    if (res.ok) {
      const body = await res.json()
      console.log(body)
      const sha = body.sha
      const updateUri = server + '/' + Path.join(apiPath, 'repos', organization, `${languageId}_${resourceId}`, 'contents', path)
      const date = new Date(Date.now())
      const dateString = date.toISOString()

      return fetch(updateUri + '?token=' + tokenid, {
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
        "content": "${body.content}",
        "dates": {
          "author": "${dateString}",
          "committer": "${dateString}"
        },
        "from_path": "${path}",
        "message": "Update ${path} from master to prepare for book package release",
        "branch": "${releaseBranchName}",
        "sha": "${sha}",
        "signoff": true
      }`,
      })
    }
  }))
  return result;
}

export async function updateManifest({
  server, organization, languageId, resourceId, tokenid, releaseBranchName,
}) {
  const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents','manifest.yaml')

  const res = await fetch(uri+'?token='+tokenid, { headers: { 'Content-Type': 'application/json' } })

  if (res.ok) {
    const body = await res.json()
    console.log(body)
    const sha = body.sha
    const content = atob(body.content)
    console.log(content)
    const manifestYAML = YAML.load(content)

    const previousVersion = manifestYAML.dublin_core.version
    const parts = previousVersion.split('.')
    parts[parts.length - 1]++
    const nextVersion = parts.join('.')
    manifestYAML.dublin_core.version = nextVersion
    manifestYAML.dublin_core.modified = manifestYAML.dublin_core.issued = new Date().toISOString().slice(0, 10)

    for ( let source of manifestYAML.dublin_core.source ) {
      if ( source.identifier === resourceId && source.language === languageId ) {
        source.version = previousVersion
      }
    }

    // TODO do something with manifestYAML.dublin_core.resources

    const newYAML = YAML.dump(manifestYAML)
    const newContent = base64.encode(utf8.encode(newYAML))
    const updateUri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'contents','manifest.yaml')
    const date = new Date(Date.now())
    const dateString = date.toISOString()

    await fetch(updateUri+'?token='+tokenid, {
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
        "branch": "${releaseBranchName}",
        "sha": "${sha}",
        "signoff": true
      }`,
    })

    return nextVersion
  }
}

export async function createReleases({
  server, organization, languageId, resourceIds, books, notes, name, state, tokenid,
}) {
  // Release all at the same time!
  const results = await Promise.all(resourceIds.map( (resourceId) => createRelease({
    server, organization, languageId, resourceId, books, notes, name, state, tokenid,
  })))

  return results.reduce( (prev, val) => ({
    status: prev.status && val.status,
    message: prev.message + ',\n' + val.message,
  }), { status: true, message: '' })
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
 * @return {object} response
 */
export async function createRelease({
  server, organization, languageId, resourceId, books, notes, name, state, tokenid,
}) {
  const releaseBranchName = 'release'

  await fetch(server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'branches',releaseBranchName)+'?token='+tokenid, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })
  await fetch(server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'branches')+'?token='+tokenid, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{
      "new_branch_name": "${releaseBranchName}"
    }`,
  })

  const success = await updateBranchWithLatestBookFiles({
    releaseBranchName,
    server,
    organization,
    languageId,
    resourceId,
    tokenid,
    books,
  })

  console.log(success);

  let version = await updateManifest( {
    server,
    organization,
    languageId,
    resourceId,
    tokenid,
    releaseBranchName,
  })

  version = 'v'+version

  // log release parameters
  console.log(`
    Name: ${name}
    Notes: ${notes}
    Version: ${version}
    State: ${state}
  `)
  // end log release parameters
  // example: POST
  // https://qa.door43.org/api/v1/repos/es-419_gl/es-419_tn/releases

  let val = {}
  const uri = server + '/' + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'releases')
  let prerelease = false

  // compute the draft and prerelease booleans
  // - draft is always false
  // - if state is 'prod', then set prelease to false
  if ( state === 'prerelease' ) {
    prerelease = true
  }

  try {
    const res = await fetch(uri+'?token='+tokenid, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "tag_name": "${version}",
        "target_commitish": "${releaseBranchName}",
        "name": "${name}",
        "body": "${notes}",
        "draft": false,
        "prerelease": ${prerelease}
      }`,
    })

    if ( res.status === 201 ) {
      val.status = true
      val.message = `Created release ${version} of ${languageId}_${resourceId} `
    } else if ( res.status === 404 ) {
      val.status = false
      val.message = `Repo does not exist (404): ${languageId}_${resourceId}`
    } else if ( res.status === 409 ) {
      val.status = false
      val.message = `Invalid JSON payload (409)`
    } else {
      val.status = false
      val.message = `Unexpected response: status ${res.status}, message ${res.message}`
    }
  } catch (e) {
    const message = e?.message
    const disconnected = isServerDisconnected(e)

    console.warn(
      `createRelease() - error creating release,
      message '${message}',
      disconnected=${disconnected},
      url ${uri}
      Error:`,
      e,
    )
    val.status = false
    val.message = `Network Error: Disconnected=${disconnected}, Error: ${message}`
  }
  return val
}
