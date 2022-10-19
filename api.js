// npm install hapi

const Hapi = require('hapi')
const Context = require('./src/db/strategies/base/contextStrategy')
const MongoDb = require('./src/db/strategies/mongodb/mongodb')
const HeroisSchema = require('./src/db/strategies/mongodb/schemas/heroisSchema')
const HeroRoutes = require('./src/routes/heroRoutes')

const app = new Hapi.Server({
    port: 5000
})


function mapRoutes(instance, methods){
    return methods.map(method => instance[method]())

}

async function main(){
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroisSchema))

    app.route([
        ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())
    ])

    await app.start()
    console.log('Servidor rodando na porta ', app.info.port)

    return app

}

module.exports = main()