import Path from 'path';
import base64 from 'base-64';
import utf8 from 'utf8';
import YAML from 'js-yaml-parser'

import _ from "lodash";
import { apiPath } from '@common/constants'
import getResourceManifest from '@common/manifests'
import getResourceManifestProject from '@common/manifestProjects'
import {ALL_BIBLE_BOOKS, BIBLES_ABBRV_INDEX, isNT} from '@common/BooksOfTheBible'

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
  const uri = Path.join(server,apiPath,'orgs',username,'repos') ;
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
  console.log("projects before sort:",_projects)
  if ( _projects.length > 1 ) {
    _projects.sort(
      (a,b) => {
        return a.sort - b.sort
      }
    )
  }
  console.log("projects after sort:",_projects)
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
  console.log("manifestAddBook() with parms:",`${server}, ${username}, ${repository}, ${bookId}, ${sha} and manifest is:`)
  console.log(manifest)
  const resourceId = repository.split('_')[1];
  // only applies to scripture oriented resources, skip tw and ta
  let _manifest 
  if ( resourceId === 'ta' || resourceId === 'tw' ) {
    // skip adding book to project section
    _manifest = manifest
  } else {
    _manifest = addProject( { resourceId, manifest, bookId })
  }
  console.log("new manifest:",_manifest)
  const content = base64.encode(utf8.encode(_manifest));
  const uri = server + "/" + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml') ;
  const date = new Date(Date.now());
  const dateString = date.toISOString();
  console.log("manifestAddBook() uri=", uri)
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
  console.log("manifestCreate() with parms:",`${server}, ${username}, ${repository}, ${bookId}`)
  //const resourceId = getResourceIdFromRepo(repository)
  const resourceId = repository.split("_")[1]
  const manifestYaml = getResourceManifest( {resourceId} );

  const content = base64.encode(utf8.encode(manifestYaml));
  const uri = Path.join(server,apiPath,'repos',username,repository,'contents','manifest.yaml') ;
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
