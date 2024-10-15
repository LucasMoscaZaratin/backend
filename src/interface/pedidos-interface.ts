export interface Pedido {
  user_cpf: string;
  total_compra: number;
  pizzas: PizzaPedido[];
}

export interface PizzaPedido {
  pizza_nome: string;
  pizza_tamanho: string;
  quantidade: number;
}

export interface PedidoResponse {
  pedido_id: number;
  user_cpf: string;
  total_compra: number;
  pizzas: PizzaDetalhes[];
}

export interface PizzaDetalhes {
  pizza_nome: string;
  pizza_tamanho: string;
  quantidade: number;
}
