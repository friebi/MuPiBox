// This file contains dummy data that should only be used in
// test files (*.spec.ts).

import type { Artist } from './artist'
import type { Media } from './media'
import { Monitor } from './monitor'
import { SonosApiConfig } from './sonos-api'

export const createFixture = <T>(data: T): ((additional_data?: Partial<T>) => T) => {
  return (additional_data) => {
    return { ...data, ...additional_data }
  }
}

export const createConfig = createFixture<SonosApiConfig>({
  server: 'localhost',
  ip: 'localhost',
  port: '8200',
  rooms: [],
  hat_active: false,
})

export const createMonitor = createFixture<Monitor>({
  monitor: 'On',
})

export const createMedia = createFixture<Media>({
  type: '',
  category: 'audiobook',
})

export const createArtist = createFixture<Artist>({
  name: 'Baw Batrol',
  albumCount: '1',
  cover: '',
  coverMedia: createMedia(),
})
