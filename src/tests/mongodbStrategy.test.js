const assert = require('assert')
const MongoDB = require('./../db/strategies/mongodb/mongodb')
const HeroisSchema = require('./../db/strategies/mongodb/schemas/heroisSchema')
const Context = require('./../db/strategies/base/contextStrategy')

const MOCK_HEROI_CADASTRAR = {
    nome: 'Mulher Maravilha',
    poder: 'Laço'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: `Patolino-${Date.now()}`,
    poder: 'Magia'
}

let MOCK_HEROI_ID = ''

let context = {}
describe('MongoDB suite de testes', function () {

    this.beforeAll(async() => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroisSchema))
        const result = await context.create(MOCK_HEROI_ATUALIZAR)
        MOCK_HEROI_ID = result.id
        
    })

    it('verificar conexao', async ()=>{
        const result = await context.isConnected()
        const expected = 'Conectado'

        assert.deepEqual(result, expected)
    })

    it('cadastrar', async () => {
        const { nome, poder } = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () => {
        const [{nome,poder}] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome}, 5)
        assert.deepEqual({ nome, poder }, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar', async () => {
        const result = await context.update(MOCK_HEROI_ID, {
            nome: 'Pernalonga'
        })
        assert.deepEqual(result.modifiedCount, 1)
    })

    it('remover', async() => {
        const result = await context.delete(MOCK_HEROI_ID)
        assert.deepEqual(result.deletedCount, 1 )
    })
})