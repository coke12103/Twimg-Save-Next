const fs = require('fs');
const EventEmitter = require('events');

const settings_template = require('../../../assets/settings.json');

module.exports = class SettingsManager extends EventEmitter{
  constructor(){
    super();

    this.values = {};
  }

  init(path = './settings.json'){
    this.path = path;

    try{
      // 無ければ作る
      if(!fs.existsSync(path)) this.create_default_settings();

      this.load_settings();
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  create_default_settings(){
    const default_settings = {};

    for(const setting of settings_template.values){
      default_settings[setting.id] = setting.default_value;
    }

    try{
      fs.writeFileSync(this.path, JSON.stringify(default_settings, null, ' '));
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  load_settings(){
    try{
      const file = JSON.parse(fs.readFileSync(this.path, 'utf8'));

      for(const setting of settings_template.values){
        this.values[setting.id] = setting.id in file ? file[setting.id] : setting.default_value;
      }
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  get(id){
    if(!(id in this.values)) throw "指定された値がありません";

    return this.values[id];
  }

  set(id, val){
    if(!(id in this.values)) throw "指定された値がありません";

    this.values[id] = val;

    try{
      this.sync();
      this.emit('value_change', id);
    }catch(err){
      console.log(err);
      throw err;
    }
  }

  sync(){
    try{
      fs.writeFileSync(this.path, JSON.stringify(this.values, null, ' '));

      this.load_settings();
    }catch(err){
      console.log(err);
      throw err;
    }
  }
}
