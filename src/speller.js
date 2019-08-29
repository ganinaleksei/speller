const config = require('./config');
const speller = require('yandex-speller');

module.exports = {
  correctText: async ({ text }) => {
    const speller_result = await new Promise((resolve, reject) => {
      speller.checkText(text, (err, result) => {
        resolve(result);
      }, {
        lang: config.lang || 'ru'
      });
    });
    
    let corrected_text = text;
    
    if(speller_result){
      speller_result.forEach((speller_item) => {
        corrected_text = corrected_text.replace(speller_item.word, speller_item.s[0]);
      });
    }
    
    return corrected_text;
  }
};
