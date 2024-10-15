import type { FastifyInstance } from "fastify";
import { query } from "../db/db";
import type { Params, Endereco } from "../interface/endereco-interface";

const enderecosRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: Endereco }>("/create", async (request, reply) => {
    const { user_cpf, rua, numero, bairro, cep, cidade, estado } = request.body;

    const text = `
            INSERT INTO endereco ( user_cpf, rua, numero, bairro, cep, cidade, estado)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
    const values = [user_cpf, rua, numero, bairro, cep, cidade, estado];
    try {
      const res = await query(text, values);
      reply.code(200).send(res.rows[0]);
    } catch (err) {
      app.log.error(err);
      console.log(err);
      reply.code(500).send({ error: "Erro ao criar o usuário" });
    }
  });
  app.put<{ Params: Params; Body: Partial<Endereco> }>("/editEndereco/:user_cpf", async (request, reply) => {
    const { user_cpf } = request.params;
    const body = request.body;

    const text = `
      UPDATE endereco
      SET rua = $1, numero = $2, bairro = $3, cep = $4, cidade = $5, estado = $6
      WHERE user_cpf = $7
      RETURNING *
    `;

    const values = [body.rua, body.numero, body.bairro, body.cep, body.cidade, body.estado, user_cpf];
    try {
      const res = await query(text, values);
      if (res.rows.length > 0) {
        reply.send(res.rows[0]);
      } else {
        reply.code(404).send({ error: "Usuário não encontrado" });
      }
    } catch (err) {
      reply.code(500).send({ error: "Erro ao atualizar usuário" });
    }
  });

  app.get<{ Params: Params }>("/:user_cpf", async (request, reply) => {
    const { user_cpf } = request.params;
    const text = `
    SELECT * FROM endereco WHERE user_cpf = $1
    `;

    try {
      const res = await query(text, [user_cpf]);
      if (res.rows.length > 0) {
        reply.send(res.rows[0]);
      } else {
        reply.code(404).send({ error: "Usuário não encontrado" });
      }
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao buscar o usuário" });
    }
  });
};

export default enderecosRoutes;
