import { User } from 'src/modules/mikroorm/entities/User';

export class RetrieveUserDto {
  constructor(user: User) {
    this.id = user.id.toString();
    this.chatId = user.chatId;
    this.username = user.username;
    this.credentials = user.credentials;
    this.locale = user.locale;
    this.role = user.role;
    this.phone = user.phone;
    this.createdAt = user.createdAt.toLocaleString();
    this.city = user.city?.id.toString() || '';
    this.registered = user.registered;
  }
  id: string;
  chatId: string;
  username: string;
  credentials: string;
  locale: string;
  role: string;
  phone: string;
  registered: boolean;
  promo: string;
  city: string;
  createdAt: string;
}
