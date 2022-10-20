const assert = require('assert')
const api = require('./../../api')
let app = {}

describe.only('suite de testes da Api Heroes', function (){
    this.beforeAll( async ()=>{
        app = await api
    })

    it('listar herois', async () =>{
        const result = await app.inject({
            method: 'GET',
            url: '/herois?skip=0&limit=10'
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })

    it('listar /herois - deve listar um item', async()=>{
        const NOME = 'Clone-3'
        const result = await app.inject({
            method: 'GET',
            url: `/herois?skip=0&limit=100&nome=${NOME}`
        })

        const dados = JSON.parse(result.payload)
        const statusCode = result.statusCode
        assert.deepEqual(statusCode, 200)
        assert.ok(dados[0].nome, NOME)
    })
})