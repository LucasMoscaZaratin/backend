import type { FastifyInstance } from "fastify";
import { query } from "../db/db";
import type { Pedido, PedidoResponse, PizzaDetalhes, PizzaPedido } from "../interface/pedidos-interface";

const pedidosRoutes = async (app: FastifyInstance) => {
  app.post<{ Body: Pedido }>("/newOrder", async (request, reply) => {
    const { user_cpf, total_compra, pizzas } = request.body;

    try {
      const pizzaNomes = pizzas.map((pizza: PizzaPedido) => pizza.pizza_nome);

      const pedidoText = `
        INSERT INTO pedidos (user_cpf, pizza_nome, pizza_tamanho, quantidade, total_compra)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;

      const pedidoValues = [user_cpf, pizzaNomes, pizzas[0].pizza_tamanho, pizzas[0].quantidade, total_compra];

      const pedidoRes = await query(pedidoText, pedidoValues);

      reply.code(201).send({ message: "Pedido criado com sucesso", pedido_id: pedidoRes.rows[0].id });
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao criar o pedido" });
    }
  });

  app.get<{ Params: { user_cpf: string } }>("/:user_cpf", async (request, reply) => {
    const { user_cpf } = request.params;

    try {
      const pedidoText = `
        SELECT * FROM pedidos WHERE user_cpf = $1;
      `;
      const pedidoRes = await query(pedidoText, [user_cpf]);

      if (pedidoRes.rows.length === 0) {
        reply.code(404).send({ error: "Nenhum pedido encontrado para este CPF" });
        return;
      }

      const pedidosComPizzas: PedidoResponse[] = pedidoRes.rows.map(
        (pedido: {
          id: number;
          user_cpf: string;
          total_compra: number;
          pizza_nome: string[];
          pizza_tamanho: string;
          quantidade: number;
        }) => ({
          pedido_id: pedido.id,
          user_cpf: pedido.user_cpf,
          total_compra: pedido.total_compra,
          pizzas: pedido.pizza_nome.map((nome, index) => ({
            pizza_nome: nome,
            pizza_tamanho: pedido.pizza_tamanho,
            quantidade: pedido.quantidade,
          })),
        })
      );

      reply.send(pedidosComPizzas);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao buscar pedidos" });
    }
  });
  app.get<{ Params: { user_cpf: string } }>("/getAllOrder", async (request, reply) => {
    try {
      const pedidoText = `
        SELECT * FROM pedidos ;
      `;
      const pedidoRes = await query(pedidoText);

      if (pedidoRes.rows.length === 0) {
        reply.code(404).send({ error: "Nenhum pedido encontrado para este CPF" });
        return;
      }

      const pedidosComPizzas: PedidoResponse[] = pedidoRes.rows.map(
        (pedido: {
          id: number;
          user_cpf: string;
          total_compra: number;
          pizza_nome: string[];
          pizza_tamanho: string;
          quantidade: number;
        }) => ({
          pedido_id: pedido.id,
          user_cpf: pedido.user_cpf,
          total_compra: pedido.total_compra,
          pizzas: pedido.pizza_nome.map((nome, index) => ({
            pizza_nome: nome,
            pizza_tamanho: pedido.pizza_tamanho,
            quantidade: pedido.quantidade,
          })),
        })
      );

      reply.send(pedidosComPizzas);
    } catch (err) {
      console.log(err);
      reply.code(500).send({ error: "Erro ao buscar pedidos" });
    }
  });
};

export default pedidosRoutes;
