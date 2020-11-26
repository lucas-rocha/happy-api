import Image from '@models/Image'

export default {
  render(image: Image) {
    return {
      id: image.id,
      path: image.path,
      key: image.key
    }
  },
  renderMany(images: Image[]) {
    return images.map((image) => this.render(image))
  }
}
