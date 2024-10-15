import type { FastifyInstance } from "fastify";
import { query } from "../db/db";
import type { Login } from "../interface/login-interface";

const loginRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: Login }>("/createLogin", async (request, reply) => {
    const { email, senha } = request.body;

    try {
      const checkUserQuery = `
      SELECT * FROM login WHERE email = $1
      `;
      const existingUser = await query(checkUserQuery, [email]);

      if (existingUser.rows.length > 0) {
        app.log.warn(`Email já está em uso: ${email}`);
        return reply.code(400).send({ error: "Nome de usuário já está em uso" });
      }

      const sql = `
      INSERT INTO login (email, senha) VALUES ($1, $2) RETURNING id, email
      `;
      const values = [email, senha];

      const result = await query(sql, values);

      reply.code(201).send({ message: "Usuário criado com sucesso", user: result.rows[0] });
    } catch (error) {
      console.log(error);
      app.log.error("Erro ao criar usuário: ", error);
      reply.code(500).send({ error: "Erro ao registrar usuário" });
    }
  });

  app.get("/users", async (request, reply) => {
    try {
      const sql = `
      SELECT * FROM login
      `;
      const result = await query(sql);

      reply.code(200).send(result.rows);
    } catch (error) {
      app.log.error(error);
      reply.code(500).send({ error: "Erro ao buscar usuários" });
    }
  });

  app.post<{ Body: Login }>("/entrar", async (request, reply) => {
    const { email, senha } = request.body;

    try {
      const checkUserQuery = `
      SELECT * FROM login WHERE email = $1
      `;
      const result = await query(checkUserQuery, [email]);

      if (result.rows.length === 0) {
        return reply.code(401).send({ error: "Nome de usuário ou senha incorretos" });
      }

      const user = result.rows[0];

      if (senha !== user.senha) {
        return reply.code(401).send({ error: "Nome de usuário ou senha incorretos" });
      }

      reply.code(200).send({ message: "Login bem-sucedido", user: { id: user.id, email: user.email } });
    } catch (err) {
      app.log.error("Erro ao realizar login: ", err);
      console.log(err);
      reply.code(500).send({ error: "Erro ao realizar login" });
    }
  });
};

export default loginRoutes;
