const BaseRoute = require('./base/baseRoute')

class HeroRoutes extends BaseRoute {
    constructor(db){
        super()
        this.db = db
    }

    list(){
        return {
            path: '/herois',
            method: 'GET',
            handler: (request, headers) => {
                try{
                    const {skip, limit, nome} = request.query
                    // console.log(typeof skip)
                    let query = {}
                    if(nome) query.nome = nome

                    if(isNaN(skip)) throw new Error('Tipo do skip incorreto')
                    if(isNaN(limit)) throw new Error('Tipo do limit incorreto')


                    return this.db.read(query, parseInt(skip), parseInt(limit))
                }catch(error){
                    console.log('DEU RUIM', error)
                    return 'ERRO'
                }
            }
        }
    }

}

module.exports = HeroRoutes