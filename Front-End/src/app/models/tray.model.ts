/*
 * This is tray model
 */
export class Tray {
  id: number
  trayLayoutId: string
  x?: number
  y?: number
  h?: number
  w?: number
  color?: string
  quantity?: number
  rack_fk?: number
  name: string
  searchable?: boolean
  img?: string
  cssClass = ''
}
