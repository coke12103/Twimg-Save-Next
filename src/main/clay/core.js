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

  load_plugins_folder(orig_folder_path){
    var folder_path = path.normalize(orig_folder_path);

    this.logger.log(`load plugins path: ${folder_path}`);

    if(!fs.existsSync(folder_path)) throw new Error('plugins folder not found');
    if(!fs.statSync(folder_path).isDirectory()) throw new Error('plugins folder path is not folder');

    var file_list = fs.readdirSync(folder_path);
    var plugin_spell_list = [];

    for(var item of file_list){
      var item_path = path.join(folder_path, item);

      // jsファイル単体で読み込めるプラグインあってもいいかもしれない
      if(!(fs.existsSync(item_path) && fs.statSync(item_path).isDirectory())) continue;

      var spell_path = path.join(item_path, 'plugin-info.json');
      if(!(fs.existsSync(spell_path) && !fs.statSync(spell_path).isDirectory())) continue;

      this.logger.log(`find plugin info!: `, spell_path);

      try{
        var loaded_spell = JSON.parse(fs.readFileSync(spell_path));
        if(!loaded_spell) throw new Error('spell empty');
      }catch(err){
        this.logger.log(`parse or load failed!: ${spell_path}, ${err}`);
        continue;
      }

      loaded_spell.dir = item_path;

      if(loaded_spell.spell_ver && loaded_spell.type.source_addition){
        loaded_spell.type.source_addition.regexp = new RegExp(loaded_spell.type.source_addition.regexp, 'i');
      }else{
        if(loaded_spell.search_regexp) loaded_spell.search_regexp = new RegExp(loaded_spell.search_regexp, 'i');
        loaded_spell.spell_ver = '';
      }

      plugin_spell_list.push(loaded_spell);
      this.logger.log(`find plugin!: ${loaded_spell.name}`);
    }

    var loaded_spells = [];

    for(var spell of plugin_spell_list){
      try{
        if(spell.spell_ver){
          if(spell.type.source_addition){
            this.sources[spell.id] = this._plugin_require(path.join(spell.dir, spell.main));
            this.logger.log(`require to v1 plugin: ${spell.name}`);
          }else if(spell.type.follow){
            this.follow[spell.id] = this._plugin_require(path.join(spell.dir, spell.main));
            this.logger.log(`require to follow plugin: ${spell.name}`);
          }
        }else{
          this.sources[spell.id] = this._plugin_require(path.join(spell.dir, spell.main));
          this.logger.log(`require to basic plugin: ${spell.name}`);
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
    var result = "";

    for(var spell of this.spells){
      if(spell.spell_ver){
        if(!spell.type.source_addition || !spell.type.source_addition.regexp.test(url)) continue;

        result = spell.id;

        break;
      }else{
        if(!(spell.search_regexp && spell.search_regexp.test(url))) continue;

        result = spell.id;

        break;
      }
    }

    return result;
  }

  _find_exec(id){
    var source = null;

    for(var spell of this.spells){
      if(spell.id !== id) continue;

      if(spell.spell_ver){
        source = spell.type.source_addition.exec;
      }else{
        source = 'NONE';
      }

      break;
    }

    return source;
  }

  exec(plugin_id, url, save_dir, queue_id){
    var exec = this._find_exec(plugin_id);

    if(exec && exec != "NONE"){
      this.logger.log('v1 plugin exec.');
      return this.sources[plugin_id][exec].bind({Clay: this.api, QueueId: queue_id}, url, save_dir)();
    }else{
      this.logger.log('v0 plugin exec.');
      return this.sources[plugin_id].bind({Clay: this.api, QueueId: queue_id}, url, save_dir)();
    }
  }

  find_source(url){
    var source = {};

    for(var spell of this.spells){
      if(spell.spell_ver){
        if(!spell.type.source_addition || !spell.type.source_addition.regexp.test(url)) continue;

        var data = spell.type.source_addition;

        this._set_target_sns(data.target_text);

        source.id = spell.id;
        source.exec = data.exec;

        break;
      }else{
        if(!(spell.search_regexp && spell.search_regexp.test(url))) continue;

        this._set_target_sns(spell.type);

        source.id = spell.id;
        source.exec = 'NONE';

        break;
      }
    }

    this.logger.log(source.id);
    return source;
  }

  exec_plugin(url, save_dir){
    var source = this.find_source(url);

    if(!source.id) return;

    // source.idがあればsource.execがあることは(プラグイン側に問題がなければ)保証されている
    if(source.exec && source.exec != "NONE"){
      this.logger.log('v1 plugin exec.');
      this.sources[source.id][source.exec].bind({Clay: this.api}, url, save_dir)();
    }else{
      this.logger.log('v0 plugin exec.');
      this.sources[source.id].bind({Clay: this.api}, url, save_dir)();
    }
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
    try{
      var main_code = fs.readFileSync(main_path, 'utf-8');
    }catch(err){
      this.logger.log(err);
      throw err;
    }

    var parent = module.parent || undefined;

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
