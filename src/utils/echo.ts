import { Message } from '../state/message/reducer'

export function createEcho(type: Message['type'], id: string): string {
  return `${type}-${id}`
}

export function parseEcho(echo: string): [Message['type'], string] {
  return echo.split('-') as [Message['type'], string]
}
