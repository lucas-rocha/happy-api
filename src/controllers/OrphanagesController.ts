import { Request, Response } from 'express'
import Orphanage from '@models/Orphanage'
import { getRepository } from 'typeorm'

export default {
  async create(req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body
    const orphanagesRepository = getRepository(Orphanage)

    const requestImages = req.files as Express.Multer.File[]
    const images = requestImages.map((image) => {
      return { path: image.path, key: image.filename }
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    try {
      const orphanage = orphanagesRepository.create(data)
      await orphanagesRepository.save(orphanage)
      return res.status(201).json({ orphanage })
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  }
}
