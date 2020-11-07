import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import Image from './Image'

@Entity('orphanages')
export default class Orphanage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  about: string;

  @Column()
  instructions: string;

  @Column()
  opening_hours: string;

  @Column()
  open_on_weekends: Boolean;

  @Column({ default: false })
  is_check: Boolean;

  @OneToMany(() => Image, (image) => image.orphanage, {
    cascade: ['insert', 'update']
  })

  @JoinColumn({ name: 'orphanage_id' })
  images: Image[]
}
