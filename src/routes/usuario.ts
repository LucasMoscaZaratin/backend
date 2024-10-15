import type { FastifyInstance } from "fastify";
import { query } from "../db/db";
import type { Params, Usuario } from "../interface/usuario-interface";

const clienteRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: Usuario }>("/createCliente", async (request, reply) => {
    const { name, cpf, phone_number } = request.body;

    const text = `
            INSERT INTO usuario (name, cpf, phone_number)
            VALUES ($1, $2, $3)
            RETURNING *
        `;
    const values = [name, cpf, phone_number];
    try {
      const res = await query(text, values);
      reply.code(200).send(res.rows[0]);
    } catch (err) {
      app.log.error(err);
      reply.code(500).send({ error: "Erro ao criar o usuário" });
    }
  });
  app.put<{ Params: Params; Body: Partial<Usuario> }>("/editUser/:cpf", async (request, reply) => {
    const { cpf } = request.params;
    const body = request.body;

    const text = `
      UPDATE usuario
      SET name = $1, phone_number = $2
      WHERE cpf = $3
      RETURNING *
    `;

    const values = [body.name, body.phone_number, cpf];
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

  app.get<{ Params: Params }>("/:cpf", async (request, reply) => {
    const { cpf } = request.params;
    const text = `
    SELECT name FROM usuario WHERE cpf = $1 
    `;

    try {
      const res = await query(text, [cpf]);
      if (res.rows.length > 0) {
        reply.send(res.rows[0]);
      } else {
        reply.code(404).send({ error: "Usuário não encontrado" });
      }
    } catch (err) {
      reply.code(500).send({ error: "Erro ao buscar o usuário" });
    }
  });
  app.get("/allClientes", async (request, reply) => {
    const text = `
    SELECT * FROM usuario `;

    try {
      const res = await query(text);
      if (res.rows.length > 0) {
        reply.send(res.rows);
      } else {
        reply.code(404).send({ error: "Sem usuários" });
      }
    } catch (err) {
      reply.code(500).send({ error: "Erro ao buscar usuários" });
    }
  });
};

export default clienteRoutes;
