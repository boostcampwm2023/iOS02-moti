import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';

export class CamelSnakeNameStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  tableName(targetName: string, userSpecifiedName: string): string {
    return userSpecifiedName ? userSpecifiedName : this.snakeCase(targetName);
  }

  columnName(
    propertyName: string,
    customName: string,
    embeddedPrefixes: string[],
  ): string {
    if (customName) return embeddedPrefixes.concat(customName).join('_');
    return this.snakeCase(embeddedPrefixes.concat(propertyName).join('_'));
  }

  relationName(propertyName: string): string {
    return this.snakeCase(propertyName);
  }

  private snakeCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }
}
