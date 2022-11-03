const Joi = require("joi");
const BaseRoute = require("./base/baseRoute");
const failAction = (request, headers, error) => {
  throw error;
};
class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: "/herois",
      method: "GET",
      config: {
        validate: {
          failAction: (request, headers, error) => {
            throw error;
          },
          query: {
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
            nome: Joi.string().min(3).max(50),
          },
        },
      },
      handler: (request, headers) => {
        try {
          const { skip, limit, nome } = request.query;

          const query = { nome: { $regex: `.*${nome}` } };

          // console.log(typeof skip)

          return this.db.read(
            nome ? query : {},
            parseInt(skip),
            parseInt(limit)
          );
        } catch (error) {
          console.log("DEU RUIM", error);
          return "ERRO";
        }
      },
    };
  }

  create() {
    return {
      path: "/herois",
      method: "POST",
      config: {
        validate: {
          failAction,
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(10),
          },
        },
      },
      handler: async (request) => {
        try {
          const { nome, poder } = request.payload;
          const result = await this.db.create({ nome, poder });
          return { message: "Heroi cadastrado com sucesso!", _id: result._id };
        } catch (error) {
          console.log("FAIL", error);
          return "Internal Error!";
        }
      },
    };
  }

  update() {
    return {
      path: "/herois/{id}",
      method: "PATCH",
      config: {
        validate: {
          params: {
            id: Joi.string().required(),
          },
          payload: {
            nome: Joi.string().required().min(3).max(100),
            poder: Joi.string().required().min(2).max(100),
          },
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const { payload } = request;
          const dadosString = JSON.stringify(payload);
          const dados = JSON.parse(dadosString);

          const result = await this.db.update(id, dados);

          if (result.modifiedCount !== 1)
            return {
              message: "Nao foi possivel atualizar!",
            };

          return { message: "Heroi atualizado com sucesso!" };
        } catch (error) {
          console.log("FAIL", error);
          return "Internal Error!";
        }
      },
    };
  }
}

module.exports = HeroRoutes;
