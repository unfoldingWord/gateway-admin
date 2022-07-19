import Path from 'path';
import base64 from 'base-64';
import utf8 from 'utf8';
import YAML from 'js-yaml-parser'

import _ from "lodash";
import { apiPath } from '@common/constants'
import getResourceManifest from '@common/manifests'
import getResourceManifestProject from '@common/manifestProjects'
import {ALL_BIBLE_BOOKS, BIBLES_ABBRV_INDEX, isNT} from '@common/BooksOfTheBible'
import { doFetch, isServerDisconnected } from './network';

export function getResourceIdFromRepo(repo) {
  let resourceId = repo.split('_')[1];
  if ( resourceId === 'glt' || resourceId === 'ult' ) {
    resourceId = 'lt'
  } else if ( resourceId === 'gst' || resourceId === 'ust' ) {
    resourceId = 'st'
  }
  return resourceId
}

export async function repoCreate({server, username, repository, tokenid}) {
  const uri = server + "/" + Path.join(apiPath,'orgs',username,'repos') ;
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
    }`
  })

  return res
}

function addProject( { resourceId, manifest, bookId }) {
  let currentProjects = manifest.projects
  let projectTemplate = getResourceManifestProject({resourceId})

  const _title = ALL_BIBLE_BOOKS[bookId]
  projectTemplate.title = _title
  projectTemplate.identifier = bookId
  projectTemplate.sort = parseInt(BIBLES_ABBRV_INDEX[bookId])

  if ( resourceId === 'lt' || resourceId === 'st' ) {
    projectTemplate.path = "./" + BIBLES_ABBRV_INDEX[bookId] + "-" + bookId.toUpperCase() + ".usfm"
  } else if ( resourceId === 'twl' ) {
    projectTemplate.path = "./twl_" + bookId.toUpperCase() + ".tsv"
  } else if ( resourceId === 'tn' ) {
    projectTemplate.path = "./tn_" + bookId.toUpperCase() + ".tsv"
  } else if ( resourceId === 'tq' ) {
    projectTemplate.path = "./tq_" + bookId.toUpperCase() + ".tsv"
  } else if ( resourceId === 'sn' ) {
    projectTemplate.path = "./sn_" + bookId.toUpperCase() + ".tsv"
  } else if ( resourceId === 'sq' ) {
    projectTemplate.path = "./sq_" + bookId.toUpperCase() + ".tsv"
  }

  if ( isNT(bookId) ) {
    projectTemplate.categories = [ 'bible-nt' ]
  } else {
    projectTemplate.categories = [ 'bible-ot' ]
  }

  // sort the projects using sort attribute
  let _projects
  if ( currentProjects === undefined || currentProjects[0] === null ) {
    _projects = [projectTemplate]
  } else {
    _projects = [...currentProjects, projectTemplate]
  }
  if ( _projects.length > 1 ) {
    _projects.sort(
      (a,b) => {
        return a.sort - b.sort
      }
    )
  }
  let _manifest = {
    ...manifest,
    projects: [..._projects]
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

export async function manifestAddBook({server, username, repository, manifest, sha, bookId, tokenid}) {
  const resourceId = repository.split('_')[1];
  // only applies to scripture oriented resources, skip tw and ta
  let _manifest 
  if ( resourceId === 'ta' || resourceId === 'tw' ) {
    // skip adding book to project section
    _manifest = manifest
  } else {
    _manifest = addProject( { resourceId, manifest, bookId })
  }
  const content = base64.encode(utf8.encode(_manifest));
  const uri = server + "/" + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml') ;
  const date = new Date(Date.now());
  const dateString = date.toISOString();
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
    }`
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
export async function manifestCreate({server, username, repository, bookId, tokenid}) {
  //const resourceId = getResourceIdFromRepo(repository)
  const resourceId = repository.split("_")[1]
  const manifestYaml = getResourceManifest( {resourceId} );

  const content = base64.encode(utf8.encode(manifestYaml));
  const uri = server + "/" + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml') ;
  const date = new Date(Date.now());
  const dateString = date.toISOString();
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
    }`
  })

  return res
}

export async function manifestReplace({server, username, repository, sha, tokenid}) {
  const resourceId = repository.split('_')[1];
  const manifestYaml = getResourceManifest( {resourceId} );
  const content = base64.encode(utf8.encode(manifestYaml));
  const uri = server + "/" + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml') ;
  const date = new Date(Date.now());
  const dateString = date.toISOString();
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
    }`
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
export async function validManifest({server, organization, languageId, resourceId}) {
  // example:
  // https://qa.door43.org/api/catalog/v5/entry/es-419_gl/es-419_tn/master
  const uri = server + "/" + Path.join('api','catalog','v5','entry',organization,`${languageId}_${resourceId}`,'master') ;
  let val = {}
  try {
    const response = await doFetch(uri)
    if (response.status === 200) {
      // master branch is in the catalog, thus must have a valid manifest
      // now fetch the latest release!
      val = await latestReleaseVersion({server, organization, languageId, resourceId})
    } else if (response.status === 404) {
      val.isValid = false
      val.message = `Repo does not exist: ${languageId}_${resourceId}`
    } else if (response.status === 500)  {
      val.isValid = false
      val.message = "Repo does not have a valid manifest"
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
 async function latestReleaseVersion({server, organization, languageId, resourceId}) {
  // example:
  // https://qa.door43.org/api/v1/repos/es-419_gl/es-419_tn/releases?draft=false&pre-release=false&page=1&limit=9999'
  const uri = server + "/" + Path.join('api','v1','repos',organization,`${languageId}_${resourceId}`,'releases?page=1&limit=9999') ;
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
      val.message = "Unexpected status returned:"+response.status
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

/**
 * Create a new release from the master branch
 * @param {string} server
 * @param {string} organization
 * @param {string} languageId
 * @param {string} resourceId
 * @return {object} response 
 */
 export async function createRelease({server, organization, languageId, resourceId, version, notes, name, state, tokenid}) {
  // example: POST
  // https://qa.door43.org/api/v1/repos/es-419_gl/es-419_tn/releases

  let val = {}
  const uri = server + "/" + Path.join(apiPath,'repos',organization,`${languageId}_${resourceId}`,'releases') ;
  let prelease = false;
  // compute the draft and prerelease booleans
  // - draft is always false
  // - if state is 'prod', then set prelease to false
  if ( state === 'prelease' ) {
    prelease = true
  }
  try {
    const res = await fetch(uri+'?token='+tokenid, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "tag_name": "${version}",
        "target_commitish": "master",
        "name": "${name}",
        "body": "${notes}",
        "draft": false,
        "prerelease": false
      }`
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
    console.warn(`createRelease() - error creating release,
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
