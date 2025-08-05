import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserRegisteredEvent } from './user-registered.event';
import { EmailService } from '../../../notification/email.service';

@EventsHandler(UserRegisteredEvent)
export class SendConfirmationEmailHandler
  implements IEventHandler<UserRegisteredEvent>
{
  constructor(private mailService: EmailService) {}

  handle(event: UserRegisteredEvent) {
    this.mailService.sendConfirmationEmail(event.email, event.code);
  }
}
