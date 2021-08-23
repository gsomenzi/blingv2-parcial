# blingv2-parcial - módulo de integracão parcial NÃO OFICIAL com a API V2 do Bling

## Instalacão

```shellscript
    yarn add @gsomenzi/blingv2-parcial
```

## Uso da integracão

### Instância da classe

```node
const BlingV2 = require('BlingV2');
const blingV2 = new BlingV2('SUA_API_KEY');

// EXEMPLO BUSCANDO PRODUTOS
const products = await blingV2.getProducts();
console.log(products);

```
### Pedidos

Buscar pedidos
- getOrders() ou getOrders(filters: object)

Os filtros são opcionais e devem ser passados no formato {chave: valor, chave: valor}.

```node
// Busca pedidos sem filtros
const orders = await blingV2.getOrders();
console.log(orders);

// Busca pedidos com filtro de data de emissão
const filters = {dataEmissao: '2021-08-12'}
const orders = await blingV2.getOrders(filters);
console.log(orders);
```

Filtros disponíveis:
  - dataEmissao: date (dd/mm/YYYY);
  - dataAlteracao: date (dd/mm/YYYY HH:ii:ss);
  - dataPrevista: date (dd/mm/YYYY);
  - idSituacao: integer (segundo API de situações)	;
  - idContato: integer.
  - 
Leia mais sobre [esta API](https://ajuda.bling.com.br/hc/pt-br/articles/360046424094-GET-pedidos).

- getOrderByNumber(number)

Busca um pedido pelo número.

### Produtos

Buscar produtos
- getProducts() ou getProducts(filters: object)

Os filtros são opcionais e devem ser passados no formato {chave: valor, chave: valor}.

```node
// Busca produtos sem filtros
const products = await blingV2.getProducts();
console.log(products);

// Busca produtos com filtro de data de inclusão
const filters = {dataInclusao: '2021-08-12'}
const products = await blingV2.getProducts(filters);
console.log(products);
```

Filtros disponíveis:
  - dataInclusao: date (dd/mm/YYYY) ou datetime (dd/mm/YYYY H:i:s);
  - dataAlteracao: date (dd/mm/YYYY) ou datetime (dd/mm/YYYY H:i:s);
  - dataAlteracaoLoja: date (dd/mm/YYYY) ou datetime (dd/mm/YYYY H:i:s);
  - dataInclusaoLoja: date (dd/mm/YYYY) ou datetime (dd/mm/YYYY H:i:s);
  - tipo: string(1);
  - situacao: string(1).
  - 
Leia mais sobre [esta API](https://ajuda.bling.com.br/hc/pt-br/articles/360046422714-GET-produtos).

- getProductByCode(code)

Busca um produto pelo código/sku.

- createOrder(data)

Cria um pedido a partir dos dados informados.

```node
// Cria um pedido informando dados do cliente, itens e parcelas
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
```

Leia mais sobre [esta API](https://ajuda.bling.com.br/hc/pt-br/articles/360047064693-POST-pedido).

- createNf(data)

Cria uma NF a partir dos dados informados.

```node
// Cria uma NF informando dados do cliente, itens e parcelas
const order = await blingV2.createOrder({
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
```

Leia mais sobre [esta API](https://ajuda.bling.com.br/hc/pt-br/articles/360047015633-POST-notafiscal).