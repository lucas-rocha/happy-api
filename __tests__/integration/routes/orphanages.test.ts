import request from 'supertest'
import path from 'path'
import DBconnection from '@src/database/connection'
import app from '@src/app'

beforeAll(async () => {
  await DBconnection()
})

describe('When creating a new orphanage', () => {
  it('should create a new orphanage', async () => {
    const fileImage = path.resolve(__dirname, '..', 'testFiles', 'Koala.jpg')
    const data = {
      name: 'Orfanato',
      latitude: -121212,
      longitude: -558712,
      about: 'Um orfanato para crianças',
      instructions: 'Instruções sobre o orfanato',
      opening_hours: 'das 08h às 21h',
      open_on_weekends: true
    }

    const response = await request(app)
      .post('/orphanages')
      .set('Accept', 'application/json')
      .field('name', data.name)
      .field('latitude', data.latitude)
      .field('longitude', data.longitude)
      .field('about', data.about)
      .field('instructions', data.instructions)
      .field('opening_hours', data.opening_hours)
      .field('open_on_weekends', data.open_on_weekends)
      .attach('images', fileImage)

    expect(response.status).toBe(201)
  })
})
