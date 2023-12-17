export default async (data) => {
  const convertedData = {}
  convertedData.audits = {}
  const metrics = data.audits.metrics.details.items[0]
  const diagnostics = data.audits.diagnostics.details.items[0]

  for (const key in metrics) {
    metrics[key] = parseFloat(parseFloat(metrics[key] || 0).toFixed(2))
  }

  for (const key in diagnostics) {
    diagnostics[key] = parseFloat(parseFloat(diagnostics[key] || 0).toFixed(2))
  }

  convertedData.fullMetrics = metrics
  convertedData.fullDiagnostics = diagnostics
  convertedData.audits.accessibility = {}
  for (const audits of data.categories.accessibility.auditRefs.map(a => a.id)) {
    convertedData.audits.accessibility[audits] = {
      score: parseFloat(parseFloat(data.audits[audits].score || 0).toFixed(2)),
      numericValue: parseFloat(parseFloat(data.audits[audits].numericValue || 0).toFixed(2))
    }
  }

  convertedData.audits['best-practices'] = {}
  for (const audits of data.categories['best-practices'].auditRefs.map(a => a.id).filter(a => a.scoreDisplayMode !== 'manual')) {
    convertedData.audits['best-practices'][audits] = {
      score: parseFloat(parseFloat(data.audits[audits].score || 0).toFixed(2)),
      numericValue: parseFloat(parseFloat(data.audits[audits].numericValue || 0).toFixed(2))
    }
  }

  convertedData.audits.seo = {}
  for (const audits of data.categories.seo.auditRefs.map(a => a.id).filter(a => a.scoreDisplayMode !== 'manual')) {
    convertedData.audits.seo[audits] = {
      score: parseFloat(parseFloat(data.audits[audits].score || 0).toFixed(2)),
      numericValue: parseFloat(parseFloat(data.audits[audits].numericValue || 0).toFixed(2))
    }
  }

  convertedData.audits.pwa = {}
  for (const audits of data.categories.pwa.auditRefs.map(a => a.id).filter(a => a.scoreDisplayMode !== 'manual')) {
    convertedData.audits.pwa[audits] = {
      score: parseFloat(parseFloat(data.audits[audits].score || 0).toFixed(2)),
      numericValue: parseFloat(parseFloat(data.audits[audits].numericValue || 0).toFixed(2))
    }
  }

  convertedData.audits.performance = {}
  for (const audits of data.categories.performance.auditRefs.map(a => a.id).filter(a => a.scoreDisplayMode !== 'manual').filter(a => !['diagnostics', 'metrics', 'screenshot-thumbnails', 'final-screenshot'].includes(a))) {
    convertedData.audits.performance[audits] = {
      score: parseFloat(parseFloat(data.audits[audits].score || 0).toFixed(2)),
      numericValue: parseFloat(parseFloat(data.audits[audits].numericValue || 0).toFixed(2))
    }
  }

  convertedData.score = {
    pwa: Math.round(data.categories.pwa.score * 100),
    accessibility: Math.round(data.categories.accessibility.score * 100),
    seo: Math.round(data.categories.seo.score * 100),
    performance: Math.round(data.categories.performance.score * 100),
    'best-practices': Math.round(data.categories['best-practices'].score * 100)
  }

  convertedData.thirdParty = data.entities.filter(e => !e.isFirstParty).filter(e => !e.isUnrecognized).map(e => {
    return { name: e.name, category: e.category }
  })

  return convertedData
}
