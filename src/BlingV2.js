const axios = require('axios');
const dotenv = require('dotenv');
var xmlConverter = require('xml-js');
const tools = require('./tools');
dotenv.config();

const TRUSTED_ORDER_FIELDS = [
    'data',
    'data_saida',
    'data_prevista',
    'numero',
    'numero_loja',
    'loja',
    'nat_operacao',
    'vendedor',
    'cliente',
    'transporte',
    'itens',
    'idFormaPagamento',
    'parcelas',
    'vlr_frete',
    'vlr_desconto',
    'obs',
    'obs_internas',
    'numeroOrdemCompra',
    'outrasDespesas',
    'intermediador'
]

const TRUSTED_NF_FIELDS = [
    'data',
    'data_saida',
    'data_prevista',
    'numero',
    'numero_loja',
    'loja',
    'nat_operacao',
    'vendedor',
    'cliente',
    'transporte',
    'itens',
    'idFormaPagamento',
    'parcelas',
    'vlr_frete',
    'vlr_desconto',
    'obs',
    'obs_internas',
    'numeroOrdemCompra',
    'outrasDespesas',
    'intermediador',
    'pedido'
]

class BlingV2 {
    apiKey = null;
    baseUrl = process.env.API_BASEURL ? process.env.API_BASEURL : 'https://bling.com.br/Api/v2';
    httpClient = null;
    nextRequestHeaders = null;

    constructor(apiKey) {
        this.apiKey = apiKey;
        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }

    // PRODUTOS

    async getProducts(filters = null) {
        let url = `${this.baseUrl}/produtos/json`;
        if (typeof filters === 'object' && filters !== null) {
            url = tools.addQueryString(url, 'filters', tools.generateFiltersString(filters), true)
        }
        try {
            this.configureInterceptors()
            const produtos = []
            const { data } = await this.httpClient.get(url);
            const { retorno } = data;
            if (retorno.erros && retorno.erros.length) return {
                success: false,
                response: retorno.erros[0].erro
            };
            retorno.produtos.map(produto => produtos.push(produto.produto));
            return {
                success: true,
                response: produtos
            };
        } catch (e) {
            return parseError(e);
        }
    }

    async getProductByCode(code) {
        try {
            this.configureInterceptors()
            const { data } = await this.httpClient.get(`${this.baseUrl}/produto/${code}/json`);
            const { retorno } = data;
            if (retorno.erros && retorno.erros.length) return {
                success: false,
                response: retorno.erros[0].erro
            };
            return {
                success: true,
                response: retorno.produtos[0].produto
            };
        } catch (e) {
            return parseError(e);
        }
    }

    // PEDIDOS

    async getOrders(filters = null) {
        let url = `${this.baseUrl}/pedidos/json`;
        if (typeof filters === 'object' && filters !== null) {
            url = tools.addQueryString(url, 'filters', tools.generateFiltersString(filters), true)
        }
        try {
            this.configureInterceptors()
            const pedidos = []
            const { data } = await this.httpClient.get(url);
            const { retorno } = data
            if (retorno.erros && retorno.erros.length) return {
                success: false,
                response: retorno.erros[0].erro
            };
            retorno.pedidos.map(pedido => pedidos.push(pedido.pedido))
            return {
                success: true,
                response: pedidos
            };
        } catch (e) {
            return parseError(e);
        }
    }

    async getOrderByNumber(number) {
        try {
            this.configureInterceptors()
            const { data } = await this.httpClient.get(`${this.baseUrl}/pedidos/${number}/json`);
            const { retorno } = data;
            if (retorno.erros && retorno.erros.length) return {
                success: false,
                response: retorno.erros[0].erro
            };
            return {
                success: true,
                response: retorno.pedidos[0].pedido
            };
        } catch (e) {
            return parseError(e);
        }
    }

    async createOrder(payload) {
        if (!payload || typeof payload !== 'object') {
            return {
                success: false,
                response: {
                    cod: 0,
                    msg: 'Você deve informar os dados do pedido'
                }
            }
        }
        try {
            const xmlOptions = {compact: true, ignoreComment: true, spaces: 0};
            const trustedXml = xmlConverter.json2xml({pedido: tools.getTrustedObject(payload, TRUSTED_ORDER_FIELDS)}, xmlOptions);
            this.configureInterceptors()
            const { data } = await this.httpClient.post(`${this.baseUrl}/pedido/json?xml=${encodeURI(`<?xml version="1.0" encoding="UTF-8"?>${trustedXml}`)}`);
            const { retorno } = data;
            if (retorno.erros && retorno.erros.length) return {
                success: false,
                response: retorno.erros[0]
            };
            return {
                success: true,
                response: retorno.pedidos[0].pedido
            };
        } catch (e) {
            console.log(e.response ? e.request.data : e.message)
            return parseError(e);
        }
    }

    // NOTE FISCAL

    async createNf(payload) {
        if (!payload || typeof payload !== 'object') {
            return {
                success: false,
                response: {
                    cod: 0,
                    msg: 'Você deve informar os dados da NF'
                }
            }
        }
        try {
            const xmlOptions = {compact: true, ignoreComment: true, spaces: 0};
            const trustedXml = xmlConverter.json2xml({pedido: tools.getTrustedObject(payload, TRUSTED_NF_FIELDS)}, xmlOptions);
            this.configureInterceptors()
            const { data } = await this.httpClient.post(`${this.baseUrl}/notafiscal/json?xml=${encodeURI(`<?xml version="1.0" encoding="UTF-8"?>${trustedXml}`)}`);
            const { retorno } = data;
            if (retorno.erros && retorno.erros.length) return {
                success: false,
                response: retorno.erros[0]
            };
            return {
                success: true,
                response: retorno.notasfiscais[0].notaFiscal
            };
        } catch (e) {
            console.log(e.response ? e.request.data : e.message)
            return parseError(e);
        }
    }
    
    /**
     * Configura interceptors para adicionar token de autenticação
     */
    configureInterceptors(client, apiKey) {
        this.httpClient.interceptors.request.use(
            async config => {
                if (this.nextRequestHeaders) {
                    Object.entries(this.nextRequestHeaders).map(entry => {
                        config.headers.common[entry[0]] = entry[1];
                    });
                }
                config.headers.common['x-api-key'] = this.apiKey;
                return config;
            },
            error => {
                return Promise.reject(error);
            },
        );
        this.httpClient.interceptors.response.use(config => {
            this.nextRequestHeaders = null;
            return config;
        });
    }
}

module.exports = BlingV2

// PRIVATE


function parseError(e) {
    let error = {
        success: false,
        response: {
            cod: 0,
            msg: ''
        }
    }
    if (!e.response) {
        error.response.msg = e.message || e;
    } else {
        error.response.cod = 
            e.response.data
            && e.response.data.retorno
            && e.response.data.retorno.erros
            && e.response.data.retorno.erros.erro
            && e.response.data.retorno.erros.erro.cod
                ? e.response.data.retorno.erros.erro.cod
                : e.response.status;
        error.response.msg =
            e.response.data
            && e.response.data.retorno
            && e.response.data.retorno.erros
            && e.response.data.retorno.erros.erro
            && e.response.data.retorno.erros.erro.msg
                ? e.response.data.retorno.erros.erro.msg
                : e.response.data;
    }
    return error;
}