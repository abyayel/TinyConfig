declare module "tiny-config" {
  export interface LoadConfigOptions {
    envPath?: string | string[];
    jsonPaths?: string | string[];
    yamlPaths?: string | string[];
    tomlPaths?: string | string[];
    xmlPaths?: string | string[];
    iniPaths?: string | string[];
    priority?: string[];
    validateSchema?: Record<string, any>;
  }

  export interface ValidationRule {
    required?: boolean;
    type?: "string" | "number" | "boolean" | "object" | "array";
    default?: any;
    enum?: any[];
    min?: number;
    max?: number;
  }

  export interface ValidationSchema {
    [key: string]: ValidationRule | ValidationSchema;
  }

  export function loadConfig(options?: LoadConfigOptions): Record<string, any>;
  export function tinyConfig(options?: LoadConfigOptions): Record<string, any>;
  export function validateWithSchema(
    config: any,
    schema: ValidationSchema
  ): any;
  export function loadEnvironmentConfig(env?: string): Record<string, any>;
  export function mergeWithStrategy(
    target: any,
    source: any,
    strategy?: string
  ): any;
  export function loadToml(filePaths: string | string[]): Record<string, any>;
  export function loadXml(filePaths: string | string[]): Record<string, any>;
  export function loadIni(filePaths: string | string[]): Record<string, any>;
}
