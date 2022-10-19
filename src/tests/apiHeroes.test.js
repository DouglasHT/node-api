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
            url: '/herois'
        })

        const statusCode = result.statusCode
        const dados = JSON.parse(result.payload)

        assert.deepEqual(statusCode, 200)
        assert.ok(Array.isArray(dados))
    })
})