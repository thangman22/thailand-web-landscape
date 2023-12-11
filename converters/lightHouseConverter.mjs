export default async (data) => {
    const convertedData = {};
    convertedData.audits = {};
    convertedData.fullMetrics = data.audits['metrics'].details.items[0]
    convertedData.fullDiagnostics = data.audits['diagnostics'].details.items[0]
    convertedData.audits.accessibility = {};
    for(const audits of data.categories.accessibility.auditRefs.map(a => a.id)) {
        convertedData.audits.accessibility[audits] = data.audits[audits].score
    }

    convertedData.audits['best-practices'] = {};
    for(const audits of data.categories['best-practices'].auditRefs.map(a => a.id)) {
        convertedData.audits['best-practices'][audits] = data.audits[audits].score
    }

    convertedData.audits.seo = {};
    for(const audits of data.categories.seo.auditRefs.map(a => a.id)) {
        convertedData.audits.seo[audits] = data.audits[audits].score
    }

    convertedData.audits.pwa = {};
    for(const audits of data.categories.pwa.auditRefs.map(a => a.id)) {
        convertedData.audits.pwa[audits] = data.audits[audits].score
    }

    convertedData.audits.performance = {};
    for(const audits of data.categories.performance.auditRefs.map(a => a.id).filter(a => !['diagnostics','metrics','screenshot-thumbnails','final-screenshot'].includes(a))) {
        if(data.audits[audits].score > 0 || data.audits[audits].numericValue > 0) {
            convertedData.audits.performance[audits] = {
                score: data.audits[audits].score,
                numericValue: data.audits[audits].numericValue
            }
        }
    }

    convertedData.score = {
        pwa: Math.round(data.categories.pwa.score * 100),
        accessibility: Math.round(data.categories.accessibility.score * 100),
        seo: Math.round(data.categories.seo.score * 100),
        pwa: Math.round(data.categories.pwa.score * 100),
        performance: Math.round(data.categories.performance.score * 100),
        'best-practices': Math.round(data.categories['best-practices'].score * 100)
    };

    convertedData.thirdParty = data.entities.filter(e => !e.isFirstParty).filter(e => !e.isUnrecognized).map(e => {
        return { name : e.name, category: e.category }
    });
    
    return convertedData;
}