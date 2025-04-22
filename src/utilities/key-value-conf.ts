type ValidColors =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'info'
  | 'success'
  | 'warning';

/**
 * KeyLabelConf is a configuration interface that defines the structure of key-label-color mappings.
 * @template T - The type of the key.
 */
export interface KeyLabelConf<T> {
  /**
   * The key associated with the label and color.
   */
  key: T;
  /**
   * The label associated with the key.
   */
  label: string;
  /**
   * The color associated with the key.
   * It can be one of the following values: 'default', 'primary', 'secondary', 'error', 'info', 'success', or 'warning'.
   */
  color: ValidColors;
}

/**
 * KeyLabel is a utility class that maps keys to their corresponding labels and colors.
 * It provides methods to retrieve the label and color for a given key.
 */
export class KeyLabel<T> {
  private configMap: Map<T, KeyLabelConf<T>>;

  constructor(configs: KeyLabelConf<T>[]) {
    this.configMap = new Map(configs.map((conf) => [conf.key, conf]));
  }

  /**
   * Retrieves the configuration for a given key.
   * @param key - The key for which to retrieve the configuration.
   * @returns The KeyLabelConf object associated with the key, or undefined if not found.
   */
  public getConfig(key: T): KeyLabelConf<T> | undefined {
    return this.configMap.get(key);
  }

  /**
   * Retrieves the label for a given key.
   * @param key - The key for which to retrieve the label.
   * @returns The label associated with the key, or undefined if not found.
   */
  public getLabel(key: T): string | undefined {
    return this.getConfig(key)?.label;
  }

  /**
   * Retrieves the color for a given key.
   * @param key - The key for which to retrieve the color.
   * @returns The color associated with the key, or undefined if not found.
   */
  public getColor(key: T): ValidColors | undefined {
    return this.getConfig(key)?.color;
  }
}

