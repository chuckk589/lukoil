import { InputFile } from 'grammy';
import { Message } from 'grammy/types';

class Cache {
  constructor() {
    this._cache = new Map();
  }
  private _cache: Map<string, any>;
  //TODO: remove hardcoded language
  private _assets: { [key: string]: string } = {
    oferta_ru: 'dist/public/assets/oferta_ru.pdf',
    oferta_kz: 'dist/public/assets/oferta_kz.pdf',
    city_ru: 'dist/public/assets/city_ru.png',
    city_kz: 'dist/public/assets/city_kz.png',
    lang_ru: 'dist/public/assets/lang_ru.png',
    lang_kz: 'dist/public/assets/lang_kz.png',
    start: 'dist/public/assets/start.png',
    phone: 'dist/public/assets/phone.png',
    about_ru: 'dist/public/assets/about_ru.png',
    about_kz: 'dist/public/assets/about_kz.png',
  };
  public resolveAsset(name: string): string | InputFile {
    if (this._cache.has(name)) return this._cache.get(name);
    if (name in this._assets) {
      return new InputFile(this._assets[name]);
    }
  }
  public resolveImage(localPath: string): string | InputFile {
    if (this._cache.has(localPath)) return this._cache.get(localPath);
    return new InputFile(`dist/public/${localPath}`);
  }
  public cacheAsset(name: string, msg: Message.PhotoMessage | Message.DocumentMessage | Message.VideoMessage): void {
    if (this._cache.has(name)) return;
    if ('photo' in msg) {
      this._cache.set(name, msg.photo[0].file_id);
    } else if ('document' in msg) {
      this._cache.set(name, msg.document.file_id);
    } else if ('video' in msg) {
      this._cache.set(name, msg.video.file_id);
    }
  }
}

export default new Cache();
