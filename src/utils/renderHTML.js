import { doRender } from "proskomma-render-pdf";
import {isNT, BIBLES_ABBRV_INDEX} from '../common/BooksOfTheBible';

export const SINGLE_BOOK_CONFIG = {
  "title": "unfoldingWord Literal Translation",
  "language": "en",
  "textDirection": "ltr",
  "uid": "ULT",
  "structure": [
    [
      "section",
      "nt",
      [
        [
          "bookCode",
          "%bookID%"
        ]
      ]
    ]
  ],
  "i18n": {
    "notes": "Notes",
    "tocBooks": "Books of the Bible",
    "titlePage": "unfoldingWord Literal Translation",
    "copyright": "Licensed under a Creative Commons Attribution-Sharealike 4.0 International License",
    "coverAlt": "Cover",
    "preface": "Preface",
    "ot": "Old Testament",
    "nt": "New Testament"
  }
};

export async function renderHTML({ proskomma, language, textDirection, books }) {
  let response = {};
  let docSetIds = ['en_ult'];
  let _structure = [];
  let ntList = [];
  let otList = [];
  // sort the books array
  books.sort( (a,b) => {
    if ( BIBLES_ABBRV_INDEX[a] < BIBLES_ABBRV_INDEX[b] ) return -1;
    if ( BIBLES_ABBRV_INDEX[a] > BIBLES_ABBRV_INDEX[b] ) return 1;
    return 0;
  })
  for (let i=0; i < books.length; i++) {
    let entry = [];
    entry.push('bookCode');
    entry.push(books[i].toUpperCase());
    
    if ( isNT(books[i]) ) {
      ntList.push( entry );
    } else {
      otList.push( entry );
    }
  }

  // Next the ot/nt lists to the structure
  if ( otList.length > 0 ) {
    let section = []
    section.push("section");
    section.push("ot");
    section.push(otList);  
    _structure.push(section);
  }

  if ( ntList.length > 0 ) {
    let section = []
    section.push("section");
    section.push("nt");
    section.push(ntList);  
    _structure.push(section);
  }

  const config = {
    ...SINGLE_BOOK_CONFIG,
    title: SINGLE_BOOK_CONFIG.title,
    language,
    textDirection,
    structure: _structure,
    i18n: SINGLE_BOOK_CONFIG.i18n,
    bookOutput: {}, //?
  };

  try {
    console.log("Render config, docSetIds:", config, docSetIds)
    // response = await doRender(proskomma, config, docSetIds);
    response = await doRender(proskomma, config);
  } catch (err) {
    console.log("render error:", err)
  }
  return response;
}

