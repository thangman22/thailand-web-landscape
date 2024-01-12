export default async (data) => {
  return data.Results[0].Result.Paths[0].Technologies.map(d => {
    return {
      name: d.Name,
      type: d.Tag
    }
  })
}
