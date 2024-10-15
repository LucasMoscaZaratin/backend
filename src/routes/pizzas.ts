import type { FastifyInstance } from "fastify";
import { query } from "../db/db";
import type { Params, Pizza } from "../interface/pizza-interface";

const pizzaRoutes = async (app: FastifyInstance) => {
  app.get<{ Params: Params }>("/getPizzas/:id", async (request, reply) => {
    const { id } = request.params;
    try {
      const text = "SELECT * FROM pizzas WHERE id = $1 ";
      const res = await query(text, [id]);
      reply.send(res.rows);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao buscar as pizzas" });
    }
  });
  app.post<{ Body: Pizza }>("/newPizza", async (request, reply) => {
    const { nome, descricao, pizza_pequena, pizza_media, pizza_grande } = request.body;

    try {
      const text = `
        INSERT INTO pizzas (nome, descricao, pizza_pequena, pizza_media, pizza_grande)
        VALUES  ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const values = [nome, descricao, pizza_pequena, pizza_media, pizza_grande];
      const res = await query(text, values);
      reply.code(201).send(res.rows[0]);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao criar pizza" });
    }
  });
  app.put<{ Params: { id: string }; Body: Pizza }>("/:id", async (request, reply) => {
    const { id } = request.params;
    const { nome, descricao, pizza_pequena, pizza_media, pizza_grande } = request.body;

    try {
      const text = `
        UPDATE pizzas
        SET nome = $1, descricao = $2, pizza_pequena = $3, pizza_media = $4, pizza_grande = $5
        WHERE id = $6
        RETURNING *;
      `;
      const values = [nome, descricao, pizza_pequena, pizza_media, pizza_grande, id];
      const res = await query(text, values);

      if (res.rowCount === 0) {
        reply.code(404).send({ error: "Pizza não encontrada" });
        return;
      }
      reply.code(200).send(res.rows[0]);
    } catch (err) {
      reply.code(500).send({ error: "Erro ao criar a pizza" });
    }
  });
};

export default pizzaRoutes;
