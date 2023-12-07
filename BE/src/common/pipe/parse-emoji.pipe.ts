import { Injectable, PipeTransform } from '@nestjs/common';
import { Emoji } from '../../group/emoji/domain/emoji';
import { InvalidEmojiException } from '../../group/emoji/exception/invalid-emoji.exception';

@Injectable()
export class ParseEmojiPipe implements PipeTransform {
  transform(value: any) {
    if (!this.isEmoji(value)) throw new InvalidEmojiException();
    return value;
  }

  private isEmoji(value: any) {
    if (!value) return false;
    if (typeof value !== 'string') return false;
    if (value === Emoji.SMILE) return true;
    if (value === Emoji.FIRE) return true;
    if (value === Emoji.LIKE) return true;
    return false;
  }
}
