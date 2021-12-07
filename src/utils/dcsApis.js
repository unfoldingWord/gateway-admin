import Path from 'path';
import base64 from 'base-64';
import utf8 from 'utf8';
import _ from "lodash";
import { apiPath } from '@common/constants'
import getResourceManifest from '@common/manifests'

export async function repoExists(server, username, repository, tokenid) {

  // example: https://qa.door43.org/api/v1/repos/translate_test/en_tn 
  const uri = Path.join(server,apiPath,'repos',username,repository) ;
  const res = await fetch(uri+'?token='+tokenid, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  let repoExistsFlag = false;
  if (res.status === 200) {
    // success
    repoExistsFlag = true;
  } 
  return repoExistsFlag;
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

// swagger: https://qa.door43.org/api/v1/swagger#/repository/repoCreateFile
// template: /repos/{owner}/{repo}/contents/{filepath}
export async function manifestCreate({server, username, repository, tokenid}) {
  const resourceId = repository.split('_')[1];
  const manifest = getResourceManifest( {resourceId} );
  const content = base64.encode(utf8.encode(manifest));
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
