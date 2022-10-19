const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const Context = require('./../db/strategies/base/contextStrategy')
const HeroisSchema = require('../db/strategies/postgres/schemas/heroisSchema')

let context = {}
const MOCK_HEROI_CADASTRAR = { nome: 'Gaviao Negro', poder: 'Flechas'}
const MOCK_HEROI_ATUALIZAR = { nome: 'Batman', poder: 'Dinheiro'}



describe('Postgres Strategy', () => {

    before(async function(){
        const connection =  await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroisSchema)
        context = new Context(new Postgres(connection, model))
        await context.delete()
        await context.create(MOCK_HEROI_ATUALIZAR)
    })

    it('PostgresSQL Connection', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('cadastrar', async () =>{
        const result = await context.create(MOCK_HEROI_CADASTRAR)    
        delete result.id    
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('listar', async () =>{
        // const [posicao1, posicao2, posicao3] = ['esse e o 1', 'esse e o 2', 'esse e o 3']
        const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
        delete result.id        
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('atualizar', async () =>{
        const [itemAtualizar] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        const novoItem = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Mulher Maravilha'
        }
        const [result] = await context.update(itemAtualizar.id, novoItem)
        const [itemAtualizado] = await context.read({id: itemAtualizar.id})
        assert.deepEqual(result, 1 )
        assert.deepEqual(itemAtualizado.nome, novoItem.nome )

        /*
        No JS temos uma tecnica chamda rest/spread que é um metodo usado para mergear objetos ou  separa-lo
        {
            nome: 'Batman',
            poder: 'Dinheiro'
        }
        {
            dataNascimento: '1980-01-01'
        }
        {
            nome: 'Batman',
            poder: 'Dinheiro'
            dataNascimento: '1980-01-01'
        }
        */    

    })

    it('remover por id', async () =>{
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepEqual(result, 1)

    })

})