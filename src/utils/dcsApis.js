import Path from 'path';
import base64 from 'base-64';
import utf8 from 'utf8';
import YAML from 'js-yaml-parser'

import _ from "lodash";
import { apiPath } from '@common/constants'
import getResourceManifest from '@common/manifests'
import getResourceManifestProject from '@common/manifestProjects'
import {ALL_BIBLE_BOOKS, BIBLES_ABBRV_INDEX, isNT} from '@common/BooksOfTheBible'

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

  // fix the title
  const _title = ALL_BIBLE_BOOKS[bookId]
  projectTemplate.title = _title
  projectTemplate.identifier = bookId
  projectTemplate.sort = parseInt(BIBLES_ABBRV_INDEX[bookId])
  projectTemplate.path = "./" + BIBLES_ABBRV_INDEX[bookId] + "-" + bookId.toUpperCase() + ".usfm"
  if ( isNT(bookId) ) {
    projectTemplate.categories = [ 'bible-nt' ]
  } else {
    projectTemplate.categories = [ 'bible-ot' ]
  }
  
  let _manifest
  if ( currentProjects[0] === null ) {
    _manifest = {
      ...manifest,
      projects: [projectTemplate],
    }
  } else {
    _manifest = {
      ...manifest,
      projects: [...currentProjects, projectTemplate],
    }
  }
  const __manifest = YAML.safeDump(_manifest)

  return __manifest
}

export async function manifestAddBook({server, username, repository, manifest, bookId, tokenid}) {
  // console.log("manifestAddBook() with parms:",`${server}, ${username}, ${repository}, ${bookId}, and manifest is:`)
  // console.log(manifest)
  const resourceId = repository.split('_')[1];
  const _manifest = addProject( { resourceId, manifest, bookId })
  //console.log("new manifest:",_manifest)
  const content = base64.encode(utf8.encode(_manifest));
  const uri = server + "/" + Path.join(apiPath,'repos',username,repository,'contents','manifest.yaml') ;
  const date = new Date(Date.now());
  const dateString = date.toISOString();
  //console.log("manifestAddBook() uri=", uri)
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
      "message": "Add Book to Manifest",
      "new_branch": "master",
      "sha": "",
      "signoff": true
    }`
  })

  return res
}
/* model for PUT
{
  "author": {
    "email": "user@example.com",
    "name": "string"
  },
  "branch": "string",
  "committer": {
    "email": "user@example.com",
    "name": "string"
  },
  "content": "string",
  "dates": {
    "author": "2021-12-15T23:27:18.129Z",
    "committer": "2021-12-15T23:27:18.129Z"
  },
  "from_path": "string",
  "message": "string",
  "new_branch": "string",
  "sha": "string",
  "signoff": true
}

*/

//
// swagger: https://qa.door43.org/api/v1/swagger#/repository/repoCreateFile
// template: /repos/{owner}/{repo}/contents/{filepath}
// When a manifest is created as part of the repo create process, then
// the projects section of the manifest should only include the book
// selected by the user.
//
export async function manifestCreate({server, username, repository, bookId, tokenid}) {
  console.log("manifestCreate() with parms:",`${server}, ${username}, ${repository}, ${bookId}`)
  const resourceId = repository.split('_')[1];
  const manifestYaml = getResourceManifest( {resourceId} );
  const manifest = YAML.safeLoad(manifestYaml)
  const _manifest = addProject( { resourceId, manifest, bookId })
  const content = base64.encode(utf8.encode(_manifest));
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
