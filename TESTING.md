# Comprehensive Test Document
This document is intended to describe a comprehensive test for gateway-admin.

## Test Pre-requisites

First, a new, and empty, organization must be created in QA DCS, say, `ga_test`.

## Test 1 - Add Books 
Next, login to QA DCS and go to Settings to use the organization you have created.

After clicking "save and continue", you should see an empty page.

Click the "Add Book" button and add two books, one OT and one NT (say Ruth and Titus). For each book card, click the resources button to show book/repo details.

Expected results: all repos for both books should show the "+" icon under the action column.

## Test 2 - Add a repo
From the Ruth card, click the add repo button to create the en_glt repo.

Expected result on the server:
- in the ga_test org, the repo en_glt will be created.
- the manifest will be created
- the manifest will have an "invalid" sticker since at least one project is required

Expected results on the client:
- the repo will now show as existing with a new status saying "Book not in manifest"
- the action will be a plus sign having the tooltip "add book"
- the above will be on all the cards, not just the one used to create the repo

## Test 3 - Add a book to the manifest
On the Ruth card, click the Add Book action.

Expected result on server:
- in `ga_test/en_glt`, the manifest will now have a project entry for Ruth.
- the manifest will have a "valid" sticker

Expected result on client:
- the status will change to "File not found". 
- The tooltip will say "Use tC Create to create file"; but no action will be done if clicked.
- the status on the other card(s) will remain as "Book not in manifest".

## Test 4 - Add more books to the manifest
On the Titus card, click the Add book action.

Add another book, say, Psalms; click to add it to the manifest.

Expected result on server:
- All three books will be in the manifest and will be sorted in bible order. 

Expected result on client:
- all three cards will show "File not found" and the action tooltip saying "Use tC Create to create file".

## Test 5 - All scripture resources and manifests
In this test, create all repos for all scripture resource types and add at least one book to the manifest. 

Expected result on server:
- All repos created and manifests are valid
- NOTE: if a book is not added to the manifest, it will have the Invalid sticker applied to it.

Expected result on client:
- Statuses and actions are appropriate, namely, book missing in the manifest or file not found (depending on whether a book was added)

## Test 6 - TA and TW resources and manifests
In this test, create repos for Translation Academy and Translation Words. 

Expected result on server:
- All repos created and manifests are valid

Expected result on client:
- The status will read "See TWL error" and "See TN error", respectively.
- The action icon will be the "blocked" icon.
- The tooltip will read either "Use tC Create to create translation word list" for TWL or "Use tC Create to create translation notes" for TA.


## Test 7 - All OBS resources and manifests
In this test, create OBS repos for all resource types. Since OBS resources only have a single file, the manifest will be created with that single file.

Expected result on server:
- All repos created and manifests are valid.

Expected result on client:
- All statuses will state "file not found".
- The view action tooltip will state Use tC Create to

## Test 8 - Add a missing manifest
To one of the repos, 
- delete the manifest.
- create the manifest.

Expected result on server:
- manifest will be created with no books in the projects

Expected result on client:
- status will state that manifest is missing
- action offered will be to create the manifest




