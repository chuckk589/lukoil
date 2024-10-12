import { Check, utmSource } from 'src/modules/mikroorm/entities/Check';

export class RetrieveCheckDto {
  constructor(check: Check) {
    this.id = check.id;
    this.fancyId = check.fancyId;
    this.credentials = check.user?.credentials || '';
    this.phone = check.user.phone;
    this.locale = check.user?.locale || '';
    this.createdAt = check.createdAt;
    this.code = check.code.value;
    this.utmSource = check.utmSource;
  }
  id: number;
  fancyId: string;
  credentials: string;
  phone: string;
  locale: string;
  createdAt: Date;
  code: string;
  utmSource: utmSource;
}
