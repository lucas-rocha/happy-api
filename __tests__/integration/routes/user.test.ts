import AuthService from '@services/auth.service'
import request from 'supertest'
import DBconnection from '@database/connection'
import app from '@src/server'

beforeAll(async () => {
  await DBconnection()
})

describe('When creating a new user', () => {
  it('should create a new user with a encrypted password', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@mail.com',
      password: '1234'
    }
    const response = await request(app)
      .post('/users').send(newUser)

    expect(response.status).toBe(201)
    await expect(AuthService.hashPassword('1234')).resolves.toBeTruthy()
    expect(response.body).toEqual(
      expect.objectContaining({
        ...newUser,
        ...{ password: expect.any(String) }
      })
    )
  })

  it('should return 409 when the email already exits', async () => {
    const newUser = {
      name: 'Jhon',
      email: 'john@mail.com',
      password: '123456'
    }
    await request(app).post('/users').send(newUser)
    const response = await request(app).post('/users').send(newUser)

    expect(response.status).toBe(409)
    expect(response.body).toEqual({
      message: 'User already exits'
    })
  })
})
