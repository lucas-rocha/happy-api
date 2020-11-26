import { Request, Response } from 'express'
import Orphanage from '@models/Orphanage'
import Image from '@models/Image'
import { getRepository } from 'typeorm'
import OrphanagesView from '@views/OrphanagesView'

export default {
  async index(req: Request, res: Response) {
    const orphanagesRepository = getRepository(Orphanage)
    const orphanages = await orphanagesRepository.find({
      where: {
        is_check: true
      },
      relations: ['images']
    })

    res.status(200).json(OrphanagesView.renderMany(orphanages))
  },
  async show(req: Request, res: Response) {
    const { id } = req.params
    const orphanagesRepository = getRepository(Orphanage)
    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ['images']
    })

    res.status(200).json(OrphanagesView.render(orphanage))
  },
  async findUnChecked(req: Request, res: Response) {
    const orphanagesRepository = getRepository(Orphanage)
    const orphanages = await orphanagesRepository.find({
      where: {
        is_check: false
      },
      relations: ['images']
    })

    res.status(200).json(OrphanagesView.renderMany(orphanages))
  },
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
  },
  async update(req: Request, res: Response) {
    const {
      id,
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      is_check,
      image_key
    } = req.body

    const orphanagesRepository = getRepository(Orphanage)
    const imagesRepository = getRepository(Image)

    if (image_key) {
      const images_key = Array.isArray(image_key)
        ? image_key
        : Array(image_key)

      images_key.forEach(async (image) => {
        await imagesRepository.delete({ key: image })
      })
    }

    const requestImages = req.files as Express.Multer.File[]
    if (requestImages) {
      requestImages.forEach(async (image) => {
        const img = imagesRepository.create({
          path: image.path,
          key: image.filename,
          orphanage: id
        })

        await imagesRepository.save(img)
      })
    }

    await orphanagesRepository.update(
      { id },
      {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours,
        open_on_weekends: open_on_weekends === 'true',
        is_check: is_check === 'true'
      }
    )

    return res.status(204).json({ message: 'Orphanage updated successfully.' })
  },
  async delete(req: Request, res: Response) {
    const { id } = req.params
    const orphanage_id = Number(id)

    const orphanagesRepository = getRepository(Orphanage)
    const orphanage = await orphanagesRepository.findOne(
      { id: orphanage_id },
      { relations: ['images'] }
    )

    if (!orphanage) {
      return res.status(400).json({ message: 'Orphanage not found.' })
    }

    await orphanagesRepository.delete({ id: orphanage_id })

    return res.status(200).json({ message: 'Orphanage deleted.' })
  }
}
