import { type AppConfig } from '@/domain/app-config'
import * as vscode from 'vscode'

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
    const config: AppConfig = {
      apiKey: (await this._context.secrets.get('apiKey')) ?? '',
      defaultTemperature: 0.5,
    }

    const proxyConfig = vscode.workspace.getConfiguration('http.proxy')
    if ((proxyConfig.get('host') ?? '') !== '') {
      config.proxy = {
        host: proxyConfig.get('host') ?? '',
        port: proxyConfig.get('port') ?? '',
      }
    }
    return config
  }
}
