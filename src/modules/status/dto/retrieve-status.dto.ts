export class RetrieveStatusDto {
  constructor(payload: { id?: number; name: string; description: string }) {
    // this.title = 'translation' in payload ? payload.translation.getLocalizedLabel(Locale.RU) : payload.label;
    // this.comment = 'comment' in payload ? payload.comment?.getLocalizedLabel(Locale.RU) : null;
    // this.value = 'id' in payload ? payload.id.toString() : payload.value;
    this.id = payload.id;
    this.name = payload.name;
    this.description = payload.description;
  }
  // title: string;
  // value: string;
  // comment?: string;
  id: number;
  name: string;
  description: string;
}
