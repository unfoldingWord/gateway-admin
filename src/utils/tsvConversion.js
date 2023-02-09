const ID_FIRST = 'abcdefghijklmnopqrstuvwxyz'; // We don't start ID with numbers
const ID_NEXT = 'abcdefghijklmnopqrstuvwxyz0123456789';

const ZERO_WIDTH_SPACE = '\u200B';
const NO_BREAK_SPACE = '\u00A0';
const ZERO_WIDTH_NO_BREAK_SPACE = '\uFEFF';

const HARD_NL = `\\n`;
const ELLIPSIS = '\u2026';
const THREE_DOTS = '...';

/**
 * look for a white space character not detected with trim()
 * @param {string} char
 * @returns {boolean}
 */
 const isExtraWhiteSpace = char => {
  const whiteSpaceChars = [ NO_BREAK_SPACE, ZERO_WIDTH_SPACE, ZERO_WIDTH_NO_BREAK_SPACE ];

  for (let i = 0; i < whiteSpaceChars.length; i++) {
    if (char === whiteSpaceChars[i]) {
      return true;
    }
  }
  return false;
};


/**
 * trim text of white space including zero width white space
 * @param text
 */
 const trimWhiteSpace = text => {
  let result = text;
  let changed = true;

  while (changed) {
    const trimmedText = result.trim();
    changed = result !== trimmedText;

    if (changed) {
      result = trimmedText;
    }

    if (result.length) {
      const leadingChar = result.substring(0,1);

      if (isExtraWhiteSpace(leadingChar)) {
        changed = true;
        result = result.substring(1);
      }

      if (result.length) {
        const trailingChar = result.substring(result.length - 1);

        if (isExtraWhiteSpace(trailingChar)) {
          changed = true;
          result = result.substring(0, result.length - 1);
        }
      }
    }
  }

  return result;
};

/**
 * add error to list
 * @param {array} errors
 * @param {string} message
 * @param {string} line
 * @param {number} lineNum
 */
function appendErrors(errors, message, line = null, lineNum = -1) {
  let msg = message;

  if (line) {
    msg += `, in line ${lineNum}: ${line}`;
  }

  console.log(msg);
  errors.push(msg);
}

/**
 * trim white space from value
 * @param value
 * @returns {*}
 */
function trimValue(value) {
  if (typeof value === 'string') {
    value = value.replaceAll(HARD_NL, '\n');
    value = trimWhiteSpace(value);
  }

  return value;
}

/**
 * trim each of the fields of leading and trailing white space
 * @param obj
 * @param keys
 */
function trimKeys(obj, keys) {
  for (const key of keys) {
    let value = obj[key];
    let newValue = (value === null) || (value === undefined) ? '' : value;

    if (value) {
      newValue = trimValue(value);
    }

    if (newValue !== value) {
      obj[key] = newValue;
    }
  }
}

/**
 * pick random character from string
 * @param {string} str
 * @returns {string}
 */
function getRandomCharacter(str) {
  const len = str.length;
  const pos = Math.floor(Math.random() * len);
  return str[pos];
}

/**
 * replace character at index with newChar
 * @param {string} str
 * @param {number} index
 * @param {string} newChar
 * @returns {string}
 */
function replaceCharAt(str, index, newChar) {
  const s = str.substring(0, index) + newChar + str.substring(index + 1);
  return s;
}

/**
 * convert tsv_ data from 9 column to 7 column - on major error tsvObjects will be null.
 *        errors is a string that contains all the errors detected
 *
 * @param {string} tsv_ - data in 9 column format
 * @returns {{tsvObjects: *[], errors: (string|null)}}
 */
export function convertTsv9to7(tsv_) {
  let tsvObjects;
  const errors = [];
  let line;
  let lineNum;
  let msg;
  let tsv = null;

  // remove any CR characters
  const _tsv = tsv_.split('\n');
  const __tsv = _tsv.map( (line) => line.trim() );
  tsv_ = __tsv.join('\n');


  try {
    tsvObjects = tsvtojson_(tsv_);
  } catch (e) {
    msg = `convertTsv9to7() - could not convert TSV data to json: "` + e.toString();
    appendErrors(errors, msg);
    tsv = null;
  }

  try {
    if (tsvObjects && Array.isArray(tsvObjects) && tsvObjects.length) {
      const lines = tsv_.split('\n');
      // lines = lines.map( (line) => line.trim() )
      const line0 = lines[0];
      const fields = line0.split('\t');

      const expectedFields = ['Book', 'Chapter', 'Verse', 'ID', 'SupportReference', 'OrigQuote', 'Occurrence', 'GLQuote', 'OccurrenceNote'];
      let missingFields = false;
      let extraFields = false;

      for (const expected of expectedFields) {
        if (!fields.includes(expected)) {
          msg = `missing field '${expected}' in header`;
          appendErrors(errors, msg, line, lineNum);
          missingFields = true;
        }
      }

      for (const field of fields) {
        if (!expectedFields.includes(field)) {
          msg = `extra field '${field}' in header`;
          appendErrors(errors, msg, line, lineNum);
          extraFields = true;
        }
      }

      if (fields.length !== expectedFields.length) {
        line = line0;
        lineNum = 1;
        throw `Number of columns should be ${expectedFields.length}, but ${fields.length} columns found`;
      }

      if (missingFields || extraFields) {
        line = line0;
        lineNum = 1;
        throw `Invalid Field names in header`;
      }

      for (let i = 0, l = tsvObjects.length; i < l; i++) {
        // keep track of current line for error reporting
        line = lines[i + 1];
        lineNum = i + 2;

        const tsvObject = tsvObjects[i];
        trimKeys(tsvObject, expectedFields);

        let {
          Book,
          Chapter,
          Verse,
          ID,
          SupportReference,
          OrigQuote,
          Occurrence,
          GLQuote,
          OccurrenceNote,
        } = tsvObject;

        let Reference = `${Chapter}:${Verse}`;
        const BCV = `${Book} ${Chapter}:${Verse}`;

        if (ID.length !== 4) {
          msg = `Expected ${BCV} row ID to be 4 characters (not ${ID.length} characters with '${ID}')`;
          appendErrors(errors, msg, line, lineNum);
          ID = getRandomCharacter(ID_FIRST) + getRandomCharacter(ID_NEXT) + getRandomCharacter(ID_NEXT) + getRandomCharacter(ID_NEXT);
        }

        if (!ID_FIRST.includes(ID[0])) {
          msg = `${BCV} row ID has invalid first character ${ID[0]}`;
          appendErrors(errors, msg, line, lineNum);
          ID = replaceCharAt(ID, 0, getRandomCharacter(ID_FIRST));
        }

        for (let pos = 1; pos < 4; pos++) {
          if (!ID_NEXT.includes(ID[pos])) {
            msg = `${BCV} row ID has invalid ${pos} character ${ID[pos]}`;
            appendErrors(errors, msg, line, lineNum);
            ID = replaceCharAt(ID, pos, getRandomCharacter(ID_NEXT));
          }
        }

        const Tags = '';
        SupportReference = SupportReference && `rc://*/ta/man/translate/${SupportReference}`;

        /*
          if original quote is empty copy the value of GL quote into it
        */
        if ( OrigQuote.trim().length === 0 ) {
          OrigQuote = GLQuote;
        }

        OrigQuote = OrigQuote.replaceAll(NO_BREAK_SPACE, ' '); // Replace non-break spaces
        OrigQuote = OrigQuote.replaceAll(ZERO_WIDTH_SPACE, ''); // Delete zero-width spaces
        OrigQuote = OrigQuote.replaceAll(THREE_DOTS, ELLIPSIS);
        OrigQuote = OrigQuote.replaceAll(' ' + ELLIPSIS, ELLIPSIS).replaceAll(ELLIPSIS + ' ', ELLIPSIS);

        // ELLIPSIS Should only be BETWEEN words
        if (OrigQuote[0] === ELLIPSIS) {
          OrigQuote = OrigQuote.substring(1);
        }

        if (OrigQuote[OrigQuote.length - 1] === ELLIPSIS) {
          OrigQuote = OrigQuote.substring(0, OrigQuote.length - 1);
        }

        OrigQuote = OrigQuote.replaceAll(ELLIPSIS, ' & ');
        OrigQuote = trimValue(OrigQuote);

        if (!OrigQuote && (Occurrence !== '0')) {
          msg = `Expected occurrence=='0' for ${BCV} ${SupportReference} '${OrigQuote}' ${Occurrence} '${GLQuote}'`;
          appendErrors(errors, msg, line, lineNum);
          Occurrence = '0';
        }

        if (OrigQuote && (Occurrence === '0')) {
          msg = `Expected no OrigQuote for occurrence=='0' for ${BCV} ${SupportReference} '${OrigQuote}' ${Occurrence} '${GLQuote}'`;
          appendErrors(errors, msg, line, lineNum);
        }

        // console.log(i, tsvObject, tsv_[i + 1]);
        OccurrenceNote = OccurrenceNote.replaceAll('<BR>', '<br>');
        let start = OccurrenceNote.substring(0,4);

        if ( start === '<br>' ) {
          OccurrenceNote = OccurrenceNote.substring(4);
        }

        let end = OccurrenceNote.substring(OccurrenceNote.length-4);

        if ( end === '<br>' ) {
          OccurrenceNote = OccurrenceNote.substring(0, OccurrenceNote.length-4);
        }

        OccurrenceNote = OccurrenceNote.replaceAll('<br>', '\\n');
        OccurrenceNote = OccurrenceNote.replaceAll('rc://en/', 'rc://*/');
        OccurrenceNote = OccurrenceNote.replaceAll('…', ' … ').replaceAll('  …', ' …').replaceAll('…  ', '… ');

        while (OccurrenceNote.includes('*  ')) {
          OccurrenceNote = OccurrenceNote.replaceAll('*  ', '* ');
        }
        OccurrenceNote = OccurrenceNote.replaceAll('\\n   ', '\\n@@@').replaceAll('\\n  ', '\\n@@');
        OccurrenceNote = OccurrenceNote.replaceAll('  ', ' '); //Might mess up markdown indents ???
        OccurrenceNote = OccurrenceNote.replaceAll('\\n@@@', '\\n   ').replaceAll('\\n@@', '\\n  ');
        OccurrenceNote = trimValue(OccurrenceNote);

        if (OccurrenceNote.includes('  ') && (!OccurrenceNote.includes('  *'))) { // used in markdown for indenting
          msg = `NOTE: ${BCV} ${lineNum} OccurrenceNote has unexpected double-spaces: '${OccurrenceNote}`;
          appendErrors(errors, msg, line, lineNum);
        }

        if (!OccurrenceNote) {
          msg = `NOTE: ${BCV} ${lineNum} OccurrenceNote is empty: '${OccurrenceNote}`;
          appendErrors(errors, msg, line, lineNum);
          OccurrenceNote = '';
        }

        // Normally GL Quote is a Bible quote
        if ((GLQuote === 'Connecting Statement:') ||
          (GLQuote === 'General Information:') ||
          (GLQuote === 'A Bible story from:')) {
          OccurrenceNote = `# ${GLQuote}\\n\\n${OccurrenceNote}`;
          GLQuote = '';
        }

        const newTsvObject = {
          Reference,
          ID,
          Tags,
          SupportReference,
          Quote: OrigQuote,
          Occurrence,
          Note: OccurrenceNote,
        };
        tsvObjects[i] = newTsvObject;
        // output_line = f'{reference}\t{ID}\t{tags}\t{support_reference}\t{orig_quote}\t{occurrence}\t{occurrence_note}'
      }

      const output = [];
      const headers = [
        'Reference',
        'ID',
        'Tags',
        'SupportReference',
        'Quote',
        'Occurrence',
        'Note',
      ];
      output.push(headers.join('\t'));

      for (const tsvObject of tsvObjects) {
        const fields = [];

        for (const columnName of headers) {
          const value = tsvObject[columnName] || '';
          fields.push(value);
        }

        let line = fields.join('\t');

        if (line.includes('\n')) {
          line = line.replaceAll('\n', '\\n');
        }
        output.push(line);
      }
      tsv = output.join('\n') + '\n';
    } else {
      throw `convertTsv9to7() - invalid tsv data, could not parse`;
    }
  } catch (e) {
    const msg = e.toString();
    appendErrors(errors, msg, line, lineNum);
    tsv = null;
  }
  return {
    tsv,
    errors: errors ? errors.join('\n') : null,
  };
}

/**
 * convert tsv data to json objects
 *  taken from tsvtojson - with fs.readFileSync removed
 * @param tsv
 * @param headers
 * @param splitString
 * @returns {*[]}
 */
const tsvtojson_ = (tsv, headers, splitString) => {
  let header = headers || [];
  let json = [];
  let splitString_ = splitString || '\n';

  tsv.split(splitString_).forEach((line, index) => {
    if (!index && !header.length) {
      header = line.split('\t');
    } else {
      let obj = {};

      line.split('\t').forEach((value, index) => {
        // eslint-disable-next-line no-unused-expressions
        value ? (obj[header[index]] = value) : '';
      });

      // eslint-disable-next-line no-unused-expressions
      Object.keys(obj).length ? json.push(obj) : '';
    }
  });
  return json;
};
