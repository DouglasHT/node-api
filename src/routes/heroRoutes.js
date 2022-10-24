const Joi = require('joi')
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
            config: {
                validate: {
                    failAction: (request, headers, error) => {
                        throw error
                    },
                    query: {
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(50)
                    }
                }
            },
            handler: (request, headers) => {
                try{
                    const {skip, limit, nome} = request.query

                    const query = { nome: {$regex: `.*${nome}`}}

                    // console.log(typeof skip)

                    return this.db.read(nome ? query : {}, parseInt(skip), parseInt(limit))
                }catch(error){
                    console.log('DEU RUIM', error)
                    return 'ERRO'
                }
            }
        }
    }

}

module.exports = HeroRoutes