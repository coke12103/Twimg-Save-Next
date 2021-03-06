const got = require('got');
const fs = require('fs');

module.exports = async function download(url, filename, save_dir, ref){
  const opt = {
    url: url,
    method: 'GET',
    responseType: 'buffer',
    headers: {
      'User-Agent': ' Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.97 Safari/537.36'
    }
  }

  if(ref) opt.headers['Referer'] = ref;

  let body;
  
  try{
    body = await got(opt);
    body = body.body;
  }catch(err){
    this.Clay.log(`Download: ${err}`);
    console.log(err);
    throw err;
  }

  this.Clay.set_status_text('Download: OK');

  try{
    fs.writeFileSync(`${save_dir}/${filename}`, body, { encoding: 'binary' });
  }catch(err){
    console.log(err);
    throw err;
  }

  return true;
}
