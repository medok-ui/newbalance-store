import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
})
export class PriceFormatPipe implements PipeTransform {
  private currencyPipe = new CurrencyPipe('ru-RU');

  transform(value: number | string | null | undefined): string {
    if (value == null) return '';
    const formatted = this.currencyPipe.transform(value, 'RUB', 'symbol', '1.0-0', 'ru-RU');
    return formatted ? formatted.replace(/(?<=\d)\s(?=\d)/g, '.') : '';
  }
}
