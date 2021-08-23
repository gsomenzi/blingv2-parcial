/**
 * Normaliza objetos em formatos diferentes para retornar JSON corretamente
 * @param object objeto qualquer
 * @returns JSON
 */
function normalizeJson(object) {
    if (!object) {
        return null;
    }
    return JSON.parse(JSON.stringify(object));
}

/**
 * Adiciona queryString ao final de uma URL
 * @param url URL base para o método
 * @param name Nome da query string
 * @param value Valor da query string
 * @returns Retorna a URL atualizada
 */
function addQueryString(url, name, value, wrapWithSlashes = false) {
    if (url.indexOf('?') > -1 && !/\?$/.test(url)) {
        url = `${url}&${name}=${value}`;
    } else {
        const queryString = wrapWithSlashes ? `"${name}=${value}"` : `${name}=${value}`
        
        url = `${url}?${queryString}`;
    }
    return url;
}

/**
 * Gera string de filtros
 * @param filtros Objeto com chave (nome do filtro) e valor (valor do filtro)
 * @returns Retorna a string com o filtro
 */
 function generateFiltersString(filters = null) {
    if (typeof filters !== 'object' ||  !filters) return null;
    let filtersString = ''
    Object.entries(filters).map(entry => {
        filtersString += `${entry[0]}[${entry[1]}]`
    })
    return filtersString || null;
}

/**
 * Filtra objeto informando os parâmetros desejados
 */
function getTrustedObject(object, trustedFields) {
    const trusted = {};
    Object.keys(object).map(key => {
        if (trustedFields.indexOf(key) > -1) {
            trusted[key] = object[key];
        }
    });
    return trusted;
}

module.exports = {
    normalizeJson,
    addQueryString,
    generateFiltersString,
    getTrustedObject
}