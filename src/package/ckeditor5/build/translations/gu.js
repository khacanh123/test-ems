(function (i) {
  const n = (i['gu'] = i['gu'] || {});
  n.dictionary = Object.assign(n.dictionary || {}, {
    '%0 of %1': '',
    'Block quote': ' વિચાર ટાંકો',
    Bold: 'ઘાટુ - બોલ્ડ્',
    Cancel: '',
    Italic: 'ત્રાંસુ - ઇટલિક્',
    Save: '',
    'Show more items': '',
    Subscript: '',
    Superscript: '',
    Underline: 'નીચે લિટી - અન્ડરલાઇન્',
  });
  n.getPluralForm = function (i) {
    return i != 1;
  };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
