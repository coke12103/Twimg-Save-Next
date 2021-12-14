const fs = require('fs');
const path = require('path');
const Module = require('module');
const EventEmitter = require('events');
const Stream = require('stream');

const ClayApi = require('./api.js');

module.exports = class ClayCore extends EventEmitter{
  constructor(){
    super();

    this.sources = {};
    this.follow = {};
    this.spells = [];

    this.api = new ClayApi(this);

    this._stream = new Stream.Writable({
        write: function(data, _, callback){
          this.emit('console_log_update', data);
          callback();
        }.bind(this)
    });

    this.logger = new console.Console(this._stream);
  }

  load_plugins_folder(folder_path){
    folder_path = path.normalize(folder_path);

    this.logger.log(`load plugins path: ${folder_path}`);

    if((!fs.existsSync(folder_path)) || (!fs.statSync(folder_path).isDirectory())) throw new Error('plugins folder not found');

    const file_list = fs.readdirSync(folder_path);
    const plugin_spell_list = [];

    for(const item of file_list){
      const item_path = path.join(folder_path, item);

      // TODO: jsファイル単体で読み込めるプラグインあってもいいかもしれない
      if(!fs.statSync(item_path).isDirectory()) continue;

      const spell_path = path.join(item_path, 'plugin-info.json');
      if(!(fs.existsSync(spell_path) && !fs.statSync(spell_path).isDirectory())) continue;

      this.logger.log(`find plugin info!: `, spell_path);

      let loaded_spell;

      try{
        loaded_spell = JSON.parse(fs.readFileSync(spell_path));
        if(!loaded_spell) throw new Error('spell empty');
      }catch(err){
        this.logger.log(`parse or load failed!: ${spell_path}, ${err}`);
        continue;
      }

      loaded_spell.dir = item_path;

      if(loaded_spell.type.source_addition){
        loaded_spell.type.source_addition.regexp = new RegExp(loaded_spell.type.source_addition.regexp, 'i');
      }

      plugin_spell_list.push(loaded_spell);
      this.logger.log(`find plugin!: ${loaded_spell.name}`);
    }

    const loaded_spells = [];

    for(const spell of plugin_spell_list){
      try{
        if(spell.type.source_addition){
          this.sources[spell.id] = this._plugin_require(path.join(spell.dir, spell.main));
          this.logger.log(`require to v1 plugin: ${spell.name}`);
        }else if(spell.type.follow){
          this.follow[spell.id] = this._plugin_require(path.join(spell.dir, spell.main));
          this.logger.log(`require to follow plugin: ${spell.name}`);
        }

        loaded_spells.push(spell);
      }catch(err){
        this.logger.log(`require failed!: ${err}`);
      }
    }

    this.spells = this.spells.concat(loaded_spells);

    this.logger.log(`loaded plugins!\n  count: ${this.spells.length}`);
    this.logger.log(this.sources);

    this.emit('status_text_update', `${this.spells.length}個のプラグインをロード`);
  }

  find_source_plugin(url){
    let result = "";

    for(var spell of this.spells){
      if(!spell.type.source_addition || !spell.type.source_addition.regexp.test(url)) continue;
      result = spell.id;

      break;
    }

    return result;
  }

  _get_plugin_spell(id){
    return this.spells.find(el => el.id === id);
  }

  exec(plugin_id, url, save_dir, queue_id){
    const plugin = this._get_plugin_spell(plugin_id);
    const exec = plugin.type.source_addition.exec;

    this._set_target_sns(plugin.type.source_addition.target_text);
    this.logger.log('v1 plugin exec.');

    return this.sources[plugin_id][exec].bind({Clay: this.api, QueueId: queue_id}, url, save_dir)();
  }

  reset(){
    this.sources = {};
    this.follow = {};
    this.spells = [];
  }

  list_plugins(){
    return this.spells;
  }

  _plugin_require(main_path, filename = ''){
    let main_code;

    try{
      main_code = fs.readFileSync(main_path, 'utf-8');
    }catch(err){
      this.logger.log(err);
      throw err;
    }

    const parent = module.parent || undefined;
    const _module = new Module(filename, parent);

    _module.filename = filename;

    const paths = Module._nodeModulePaths(path.dirname(filename));
    _module.paths = paths;

    _module._compile(main_code, filename);

    return _module.exports;
  }

  _set_target_sns(target){
    this.emit('target_sns_update', target);
  }
}
