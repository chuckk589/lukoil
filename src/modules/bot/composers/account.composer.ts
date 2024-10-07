import { BaseComposer } from '../bot.types';
import { ComposerController } from '../common/decorators';
import { GlobalService } from '../services/global.service';

@ComposerController
export class AccountComposer extends BaseComposer {
  constructor(private readonly globalService: GlobalService) {
    super();
  }
}
