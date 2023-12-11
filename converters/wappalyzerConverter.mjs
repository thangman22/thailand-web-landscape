export default async (data) => {
  return data.technologies.filter(d => d.confidence === 100).map(d => {
    return {
      name: d.name,
      type: d.categories[0].slug
    }
  })
}
