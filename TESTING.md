# Comprehensive Test Document
This document is intended to describe a comprehensive test for gateway-admin.
Each level 1 heading covers a specific are of functionality.

As of this writing (2022-01-05), repo initialization and Cypress testing notes 
are the two areas covered in this document.

# Repo Initialization
This covers creating repos, manifests, adding books to manifests, checking
for file existence, and for TA and TW, using TN and TWL respectively to 
identify which are present and which are absent.

The tests here are all manual in nature.

## Test Pre-requisites

First, a new, and empty, organization must be created in QA DCS, say, `ga_test`.

## Test 1 - Add Books (DONE)
Next, login to QA DCS and go to Settings to use the organization you have created.

After clicking "save and continue", you should see an empty page.

Click the "Add Book" button and add two books, one OT and one NT (say Ruth and Titus). For each book card, click the resources button to show book/repo details.

Expected results: all repos for both books should show the "+" icon under the action column.

## Test 2 - Add a repo (DONE)
From the Ruth card, click the add repo button to create the en_glt repo.

Expected result on the server:
- in the ga_test org, the repo en_glt will be created.
- the manifest will be created
- the manifest will have an "invalid" sticker since at least one project is required

Expected results on the client:
- the repo will now show as existing with a new status saying "Book not in manifest"
- the action will be a plus sign having the tooltip "add book"
- the above will be on all the cards, not just the one used to create the repo

## Test 3 - Add a book to the manifest (DONE)
On the Ruth card, click the Add Book action.

Expected result on server:
- in `ga_test/en_glt`, the manifest will now have a project entry for Ruth.
- the manifest will have a "valid" sticker

Expected result on client:
- the status will change to "File not found". 
- The tooltip will say "Use tC Create to create file"; but no action will be done if clicked.
- the status on the other card(s) will remain as "Book not in manifest".

## Test 4 - Add more books to the manifest (DONE)
On the Titus card, click the Add book action.

Add another book, say, Psalms; click to add it to the manifest.

Expected result on server:
- All three books will be in the manifest and will be sorted in bible order. 

Expected result on client:
- all three cards will show "File not found" and the action tooltip saying "Use tC Create to create file".

## Test 5 - All scripture resources and manifests (DONE)
In this test, create all repos for all scripture resource types and add at least one book to the manifest. 

Expected result on server:
- All repos created and manifests are valid
- NOTE: if a book is not added to the manifest, it will have the Invalid sticker applied to it.

Expected result on client:
- Statuses and actions are appropriate, namely, book missing in the manifest or file not found (depending on whether a book was added)

## Test 6 - TA and TW resources and manifests (DONE)
In this test, create repos for Translation Academy and Translation Words. 

Expected result on server:
- All repos created and manifests are valid

Expected result on client:
- The status will read "See TWL error" and "See TN error", respectively.
- The action icon will be the "blocked" icon.
- The tooltip will read either "Use tC Create to create translation word list" for TWL or "Use tC Create to create translation notes" for TA.


## Test 7 - All OBS resources and manifests (DONE)
In this test, create OBS repos for all resource types. Since OBS resources only have a single file, the manifest will be created with that single file.

Expected result on server:
- All repos created and manifests are valid.

Expected result on client:
- All statuses will state "file not found".
- The view action tooltip will state Use tC Create to

## Test 8 - Add a missing manifest
- On one of the repos, (manually) delete the manifest in QA DCS. 

Expected result on client:
- status will state that manifest is missing
- the action will offer to create the manifest

- Click the action.

Expected result on server:
- manifest will be created with no books in the projects

Expected result on client:
- Non-scripture resources (OBS resources, TA, and TW) will show "File not found"
- otherwise, will show "Add book to manifest"

## Test 9a - Undecodable manifest
**NOTE** there is no know way of handling this problem. Plus it may never happen.
The issue here is whether the Gitea API encodes the content using base64. At present,
there is no other known encoding known or supported.

- On one of the repos, update the manifest to be an invalid YAML file, 
for instance, by just making the file one line saying "I am not a YAML file".

Expected result on client:
- status will state that manifest cannot be decoded
- the action will offer to create a new the manifest

- Click the action.

Expected result on client:
- A dialog will be shown with a message to replace the existing manifest file.
- There will be two buttons on the dialog:
  - Cancel: this will close the dialog without taking any action
  - Replace: this will replace the manifest on the server

Expected result on server:
- in case of "cancel", the file remains unchanged
- in case of "replace", the file will now be a valid manifest for that resource

**NOTE** In Github terms, replacing a file is much different than adding a new one.
A replace is essentially an update and requires the SHA value of the existing, old file
and a commit message.

## Test 9 - Manifest is not a YAML file
In this case, when the file is converted to JSON, it will be a JavaScript object.
The result is tested to see if it is an object or not. If not, then this status is
will be shown to the user.

- On one of the repos, update the manifest to be an invalid YAML file, 
for instance, by just making the file one line saying "I am not a YAML file".

Expected result on client:
- status will state that manifest is not a YAML file.
- the action will offer to replace the file with a new, appropriate manifest

- Click the action.

Expected result on client:
- The status will be "Book not in manifest" for scripture resources and "File not found" for OBS resources.
- The action will add to add a book to the projects section.

Expected result on server:
- Manifest file overwritten with a manifest without any projects.

**NOTE** In Github terms, replacing a file is much different than adding a new one.
A replace is essentially an update and requires the SHA value of the existing, old file
and a commit message.


# To Do

The below is a complete list (as of this writing) of every possible thing that can go wrong.
This list was taken from issue https://github.com/unfoldingWord/gateway-admin/issues/40.

The below may differ from the original source above and is preferred over the original.

### REPO_NOT_FOUND = 'Repo not found'
Action is to create the repo. **DONE**

### FILE_NOT_FOUND = 'File not found'
No action required. Tooltip will indicate that tc-create should be used to create the file. **DONE**

### BOOK_NOT_IN_MANIFEST = 'Book not in manifest'
Action is to add the selected book to the manifest. **DONE**

### "xxx missing"
This status is shown for TW and TA resources (Bible and OBS). 
Action will show the user the items that are missing. **DONE**

### "No TWL repo" and "See TWL error"
These two statuses are possible for the TW resource. Since the TW resources for a book cannot be determined with the TWL, these are possible outcomes. There is no action to be taken for TW, since the action must be taken for TWL instead. 

Tooltip will provide a fuller explanation of the status. **DONE**

### "No TN repo" and "See TN error"
This is same as preceding but for the TA resource. **DONE**

### NO_FILES_IN_REPO = "No files in repo"
Action is to create the manifest. **DONE**

### NO_MANIFEST_FOUND = "No manifest found"
Action is to create the manifest. (same as preceding) **DONE**

### UNABLE_TO_DECODE_MANIFEST = "Unable to decode manifest" **IGNORE**
This will happen when the manifest content is not encoded using base64. This may never happen.

### MANIFEST_NOT_YAML **DONE**
If the file is not a proper resource manifest file, then this status is returned.

### UNABLE_TO_RETRIEVE_MANIFEST = "Unable to retrieve manifest" **DONE**
This is likely a network or access error. Propose that the admin be informed to try again later or fix possible access permissions.


# Cypress Tests

_Table of Contents_
- Initial Installation and Setup
- Running Tests
- Creating Tests

## Initial Installation and Setup
Follow directions in the [Cypress docs](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements). 

**Steps**:
- The first step is: `yarn add cypress --dev`
- Add these lines to package.json scripts:
```json
    "cypress:run": "NODE_ENV=test cypress run",
    "cypress": "NODE_ENV=test cypress open"
```
- Make sure cypress is fully installed by running the following. The second command will create `cypress.json` and will create the cypress folder. Be sure to add the folder and JSON file to your repository. The cypress folder will contain a number of examples. It will open the cypress window and it will remain open. Just close it to continue.
```
yarn
yarn run cypress install
```
- Create test config file `cypress.env.json` in root folder with the following contents (substitute your username in password). 
In the below, it is set to point to the QA DCS server. To point to production, use "https://git.door43.org" and "localhost:3000",
for TEST_SERVER and TEST_VISIT respectively.
Add this file to `.gitignore` so that the user account is not made public.
```
{
  "TEST_USERNAME": "<user>",
  "TEST_PASSWORD": "<password>"
  "TEST_SERVER": "https://qa.door43.org",
  "TEST_VISIT": "localhost:3000/?server=qa"
}
```
- The account used will need to be part of unfoldingWord organization for the test to complete.
- In the `cypress/integration` folder, remove all content.
- Copy the test `01-app-init.spec.js` from gateway-edit into this folder.
- Modify it as needed.

NOTE: the test script `./cypress/integration/01-login-select-org-lang.js` contains
significant modifications of the original from gateway-edit.

## Running Tests
At this point, you have the first test ready to run. Try it.

- In first terminal, start the app and wait until Next.js has compiled the pages.
```
yarn dev
```
- Then in second terminal, to run cypress interactively do:
```
yarn cypress 
```
- or to run headless: in second terminal, run cypress by:
```
yarn cypress:run
```


## Creating Tests
 


# Translation Notes Conversion from 9 column to 7

## Steps

1. create an org
2. go to https://qa.door43.org/Es-419_gl/es-419_tn
3. click the button to fork
4. fork to that new org
5. login to gA
6. go to account settings
7. select new org 
8. select es-419 as language
9. click save and continue
10. in menu, select "Convert Tsv9 to Tvs7"
11. you will see this message:
```
Checking for tC Create user branches...
There are tC Create user branches - cannot continue
```
12. click close to return to main workspace
13. go to new org and repo
14. go to branches
15. delete all tc-create branches (in real life they need to be merged into master before conversion; so this prevents loss of data)
16. return to conversion page
17. Now it will say:
```
Checking for tC Create user branches...
There are no tC Create user branches, click Convert button to continue
```
18. click the Convert button
19. The progress output will be something like this:
```
Archive of master branch successful.
Begin converting files...
Working on en_tn_01-GEN.tsv
... is bookdId GEN
... Converted:en_tn_01-GEN.tsv
Working on en_tn_02-EXO.tsv
... is bookdId EXO
... Converted:en_tn_02-EXO.tsv
Working on en_tn_08-RUT.tsv
... is bookdId RUT
... Converted:en_tn_08-RUT.tsv
Working on en_tn_32-JON.tsv
... is bookdId JON
... Converted:en_tn_32-JON.tsv
Working on en_tn_56-2TI.tsv
... is bookdId 2TI
... Converted:en_tn_56-2TI.tsv
Working on en_tn_57-TIT.tsv
... is bookdId TIT
... Converted:en_tn_57-TIT.tsv
Working on en_tn_58-PHM.tsv
... is bookdId PHM
... Converted:en_tn_58-PHM.tsv
Working on en_tn_65-3JN.tsv
... is bookdId 3JN
... Converted:en_tn_65-3JN.tsv
Updating manifest
Manifest updated
```
20. To test again, then:
  - go to repo
  - click settings
  - scroll down to bottom
  - click delete repository
  - confirm it
  - now you start at the top by re-forking

