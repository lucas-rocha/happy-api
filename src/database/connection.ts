import { createConnection } from 'typeorm'

const DBconnection = async () => {
  return await createConnection()
}

export default DBconnection
