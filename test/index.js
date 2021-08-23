const BlingV2 = require('../src/BlingV2');

const TESTAPIKEY = '00c9a9e45fd4414566971ee6d7a6ffbbd93b3ce5f5b39c9c8b6ca3d7d87658581bdf4e1b'
const blingV2 = new BlingV2(TESTAPIKEY)

async function getProducts() {
    console.group('PRODUTOS')
    const products = await blingV2.getProducts()
    console.log(products)
    console.groupEnd()
}

async function getProductByCode() {
    console.group('PRODUTO')
    const product = await blingV2.getProductByCode('asddasads')
    console.log(product)
    console.groupEnd()
}

async function getOrders() {
    console.group('PEDIDOS')
    const orders = await blingV2.getOrders({
        dataEmissao: '2021-08-13'
    })
    console.log(orders)
    console.groupEnd()
}

async function getOrderByNumber() {
    console.group('PEDIDO')
    const order = await blingV2.getOrderByNumber(2)
    console.log(order)
    console.groupEnd()
}

async function createOrder() {
    console.group('CRIAR PEDIDO')
    const order = await blingV2.createOrder({
        cliente: {
            nome: 'Fulano de tal',
            tipoPessoa: 'F',
            endereco: 'Rua Visconde de São Gabriel',
            cpf_cnpj: '00000000000',
            ie: 3067663000,
            numero: 392,
            bairro: 'Cidade Alta',
            cep: '95.703-072',
            cidade: 'Bento Gonçalves',
            uf: 'RS',
            fone: 5488853376,
            email: 'teste@teste.com.br'
        },
        itens: [
            {
                item: {
                    codigo: '4',
                    descricao: 'asodn',
                    un: 'UN',
                    qtde: 1,
                    vlr_unit: 120
                }
            }
        ],
        parcelas: [
            {
                parcela: {
                    data: '23/08/2021',
                    vlr: 120,
                    obs: '1 de 1'
                }
            }
        ],
        vlr_frete: 2,
        vrl_desconto: 0,
    })
    console.log(order)
    console.groupEnd()
}

async function createNf() {
    console.group('CRIAR NF')
    const order = await blingV2.createNf({
        pedido: {
            tipo: 'S',
            finalidade: '1'
        },
        cliente: {
            nome: 'Fulano de tal',
            tipoPessoa: 'F',
            endereco: 'Rua Visconde de São Gabriel',
            cpf_cnpj: '00000000000',
            ie_rg: 3067663000,
            numero: 392,
            bairro: 'Cidade Alta',
            cep: '95.703-072',
            cidade: 'Bento Gonçalves',
            uf: 'RS',
            fone: 5488853376,
            email: 'teste@teste.com.br'
        },
        itens: [
            {
                item: {
                    codigo: '2',
                    descricao: 'asodn',
                    un: 'UN',
                    qtde: 1,
                    vlr_unit: 120
                }
            }
        ],
        parcelas: [
            {
                parcela: {
                    data: '23/08/2021',
                    vlr: 120,
                    obs: '1 de 1'
                }
            }
        ],
        vlr_frete: 2,
        vrl_desconto: 0,
    })
    console.log(order)
    console.groupEnd()
}
// getProducts()
// getOrders()
// getProductByCode()
// getOrderByNumber()
// createOrder()
createNf()