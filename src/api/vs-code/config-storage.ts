import { type AppConfig } from '@/domain/app-config'
import type vscode from 'vscode'

export interface ConfigStorageInterface {
  save: (appConfig: AppConfig) => Promise<void>
  load: () => Promise<AppConfig>
}

export class ConfigStorage implements ConfigStorageInterface {
  public constructor(private readonly _context: vscode.ExtensionContext) {}

  public async save(appConfig: AppConfig): Promise<void> {
    await this._context.secrets.store('apiKey', appConfig.apiKey)
  }

  public async load(): Promise<AppConfig> {
    return {
      apiKey: (await this._context.secrets.get('apiKey')) ?? '',
      defaultTemperature: 0.0,
    }
  }
}
