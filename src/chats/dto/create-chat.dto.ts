/* tf_m1-m2-m3/src/chats/dto/create-chat.dto.ts */
import { IsInt } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  MatchFK: number;
}
