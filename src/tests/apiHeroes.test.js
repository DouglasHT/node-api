const assert = require("assert");
const api = require("./../../api");
let app = {};
const MOCK_HEROIS_CADASTRAR = {
  nome: "Test 1",
  poder: "Testar",
};
const MOCK_HEROIS_INICIAL = {
  nome: "Test 1",
  poder: "Testar",
};
let MOCK_ID = "";

describe("suite de testes da Api Heroes", function () {
  this.beforeAll(async () => {
    app = await api;
    const result = await app.inject({
      method: "POST",
      url: `/herois`,
      payload: JSON.stringify(MOCK_HEROIS_INICIAL),
    });
    const dados = JSON.parse(result.payload);
    MOCK_ID = dados._id;
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

  it("atualizar PATCH - /herois/:id", async () => {
    const _id = MOCK_ID;
    const expected = {
      nome: "Test 1",
      poder: "Super Test",
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/herois/${_id}`,
      payload: JSON.stringify(expected),
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, "Heroi atualizado com sucesso!");
  });

  it("atualizar PATCH - /herois/:id - n??o deve atualizar com ID incorreto", async () => {
    const _id = `6363f415b9f071e398eb1e98`;
    const expected = {
      nome: "Test 1",
      poder: "Super Test",
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/herois/${_id}`,
      payload: JSON.stringify(expected),
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, "Nao foi possivel atualizar!");
  });

  it("remover DELETE - /herois/:id", async () => {
    const _id = MOCK_ID;
    const result = await app.inject({
      method: "DELETE",
      url: `/herois/${_id}`,
    });

    const statusCode = result.statusCode;
    const dados = JSON.parse(result.payload);

    assert.ok(statusCode === 200);
    assert.deepEqual(dados.message, "Heroi removido com sucesso!");
  });
});
