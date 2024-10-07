import { ApiProperty } from '@nestjs/swagger';
import { Check } from 'src/modules/mikroorm/entities/Check';

export class RetrieveCheckDto {
  constructor(check: Check) {
    this.id = check.id;
    this.fancyId = check.fancyId;
    this.credentials = check.user?.credentials || '';
    this.phone = check.user.phone;
    this.checkPath = check.path;
    this.locale = check.user?.locale || '';
    this.createdAt = check.createdAt;
    this.statusId = check.status?.id;
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  fancyId: string;
  @ApiProperty()
  credentials: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  statusId: number;
  @ApiProperty()
  locale: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  checkPath: string;
}
