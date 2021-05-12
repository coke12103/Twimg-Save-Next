const fs = require('fs');
const path = require('path');
const Module = require('module');

module.exports = class ClayCore{
  constructor(){
    this.sources = {};
    this.follow = {};
    this.spells = [];
  }

  load_plugins_folder(orig_folder_path){
    var folder_path = path.normalize(orig_folder_path);

    console.log(`load plugins path: ${folder_path}`);

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

      console.log(`find plugin info!: `, spell_path);

      try{
        var spell = JSON.parse(fs.readFileSync(spell_path));
        if(!spell) throw new Error('spell empty');
      }catch(err){
        console.warn(`parse or load failed!: ${spell_path}, ${err}`);
        continue;
      }

      spell.dir = item_path;

      if(spell.spell_ver){
        if(spell.type.source_addition) spell.type.source_addition.regexp = new RegExp(spell.type.source_addition.regexp, 'i');
      }else{
        if(spell.search_regexp) spell.search_regexp = new RegExp(spell.search_regexp, 'i');
        spell.spell_ver = '';
      }

      plugin_spell_list.push(spell);
      console.log(`find plugin!: ${spell.name}`);
    }

    var loaded_spells = [];

    for(var spell of plugin_spell_list){
      try{
        if(spell.spell_ver){
          if(spell.type.source_addition){
            this.sources[spell.id] = this.plugin_require(path.join(spell.dir, spell.main));
            console.log(`require to v1 plugin: ${spell.name}`);
          }else if(spell.type.follow){
            this.follow[spell.id] = this.plugin_require(path.join(spell.dir, spell.main));
            console.log(`require to follow plugin: ${spell.name}`);
          }
        }else{
          this.sources[spell.id] = this.plugin_require(path.join(spell.dir, spell.main));
          console.log(`require to basic plugin: ${spell.name}`);
        }

        loaded_spells.push(spell);
      }catch(err){
        console.warn(`require failed!: ${err}`);
      }
    }

    this.spells = this.spells.concat(loaded_spells);

    console.log(`loaded plugins!\n  count: ${this.spells.length}`);
    console.log(this.sources);
  }

  find_source(url){
    var source = {};

    for(var spell of this.spells){
      if(spell.spell_ver){
        if(!spell.type.source_addition || !spell.type.source_addition.regexp.test(url)) continue;

        var data = spell.type.source_addition;

        // set_sns_type(data.target_text);

        source.id = spell.id;
        source.exec = data.exec;

        break;
      }else{
        if(!(spell.search_regexp && spell.search_regexp.test(url))) continue;

        // set_sns_type(spell.type);

        source.id = spell.id;
        source.exec = 'NONE';

        break;
      }
    }

    console.log(source.id);
    return source;
  }

  exec_plugin(url, save_dir){
    var source = this.find_source(url);

    if(!source.id) return;

    // source.idがあればsource.execがあることは(プラグイン側に問題がなければ)保証されている
    if(source.exec && source.exec != "NONE"){
      console.log('v1 plugin exec.');
      this.sources[source.id][source.exec](url, save_dir);
    }else{
      console.log('v0 plugin exec.');
      this.sources[source.id](url, save_dir);
    }
  }

  plugin_require(main_path, filename = ''){
    try{
      var main_code = fs.readFileSync(main_path, 'utf-8');
    }catch(err){
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
}
