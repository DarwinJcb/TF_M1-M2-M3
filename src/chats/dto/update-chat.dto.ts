/* tf_m1-m2-m3/src/chats/dto/update-chat.dto.ts: */
import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from './create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {}
