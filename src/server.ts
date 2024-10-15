import fastify from "fastify";
import cors from "@fastify/cors";
import clienteRoutes from "./routes/usuario";
import pizzaRoutes from "./routes/pizzas";
import enderecosRoutes from "./routes/enderecos";
import pedidosRoutes from "./routes/pedidos";
import loginRoutes from "./routes/login";

const app = fastify();
app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
});
app.register(clienteRoutes, { prefix: "/usuarios" });
app.register(pizzaRoutes, { prefix: "/pizzas" });
app.register(enderecosRoutes, { prefix: "/enderecos" });
app.register(pedidosRoutes, { prefix: "/pedidos" });
app.register(loginRoutes, { prefix: "/login" });

app.listen({ port: 3000 }).then(() => {
  console.log("Server running");
});
