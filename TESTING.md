# Comprehensive Test Document
This document is intended to describe a comprehensive test for gateway-admin.

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
Action is to create the manifest.

### NO_MANIFEST_FOUND = "No manifest found"
Action is to create the manifest. (same as preceding)

### UNABLE_TO_DECODE_MANIFEST = "Unable to decode manifest"
This will happen when the manifest content is not encoded using base64. This may never happen.

### MANIFEST_NOT_YAML
If the file is not a proper resource manifest file, then this status is returned.

### UNABLE_TO_RETRIEVE_MANIFEST = "Unable to retrieve manifest"
This is likely a network or access error. Propose that the admin be informed to try again later or fix possible access permissions.
