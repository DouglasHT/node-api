const assert = require("assert");
const api = require("./../../api");
let app = {};
const MOCK_HEROIS_CADASTRAR = {
  nome: "Test 1",
  poder: "Testar",
};

describe("suite de testes da Api Heroes", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it("listar herois", async () => {
    const result = await app.inject({
      method: "GET",
      url: "/herois?skip=0&limit=10",
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.deepEqual(statusCode, 200);
    assert.ok(Array.isArray(dados));
  });

  it("listar /herois - deve retornar um erro com limit incorreto", async () => {
    const TAMANHO_LIMITE = "AEEEE";
    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=${TAMANHO_LIMITE}`,
    });

    const errorResult = {
      statusCode: 400,
      error: "Bad Request",
      message: 'child "limit" fails because ["limit" must be a number]',
      validation: {
        source: "query",
        keys: ["limit"],
      },
    };

    assert.deepEqual(result.statusCode, 400);
    assert.ok(result.payload, JSON.stringify(errorResult));
  });

  it("listar  GET - /herois - deve listar um item", async () => {
    const NOME = "Clone-3";
    const result = await app.inject({
      method: "GET",
      url: `/herois?skip=0&limit=100&nome=${NOME}`,
    });

    const dados = JSON.parse(result.payload);
    const statusCode = result.statusCode;
    assert.deepEqual(statusCode, 200);
    assert.ok(dados[0].nome, NOME);
  });

  it("cadastrar POST - /herois", async () => {
    const result = await app.inject({
      method: "POST",
      url: `/herois`,
      payload: MOCK_HEROIS_CADASTRAR,
    });

    const statusCode = result.statusCode;
    const { message, _id } = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.notStrictEqual(_id, undefined);
    assert.deepEqual(message, "Heroi cadastrado com sucesso!");
  });
});
