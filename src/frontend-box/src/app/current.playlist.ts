export interface CurrentPlaylist {
  total?: number
  items?: Item[]
}

export interface Item {
  track: {
    duration_ms?: number
    id?: string
    name?: string
    type?: string
    album?: {
      images?: Image[]
    }
  }
}

export interface Image {
  url?: string
}
