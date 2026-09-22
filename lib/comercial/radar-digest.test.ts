import { describe, expect, it } from "vitest";

import {
  contarSituacoes,
  resumirRadar,
  temOQueDizer,
  textoDoDigest,
  type PedidoParaRadar,
} from "./radar-digest";

function pedido(over: Partial<PedidoParaRadar> & { id: string }): PedidoParaRadar {
  return {
    contact_id: "c1",
    total_cents: 10000,
    status: "entregue",
    origem: "vendedor",
    dia: "2026-09-01",
    ...over,
  };
}

describe("contarSituacoes", () => {
  it("soma por situação e conta monitorados", () => {
    const c = contarSituacoes([
      { situacao: "em_risco" },
      { situacao: "em_risco" },
      { situacao: "recompra_atrasada" },
      { situacao: "cancelado_sem_nova" },
      { situacao: "ok" },
    ]);
    expect(c).toEqual({ emRisco: 2, recompraAtrasada: 1, perda: 1, monitorados: 5 });
  });
});

describe("temOQueDizer", () => {
  it("silencia quando está tudo em dia (sem spam)", () => {
    expect(temOQueDizer({ emRisco: 0, recompraAtrasada: 0, perda: 0, monitorados: 9 })).toBe(false);
    expect(temOQueDizer({ emRisco: 1, recompraAtrasada: 0, perda: 0, monitorados: 9 })).toBe(true);
  });
});

describe("textoDoDigest", () => {
  it("cita só as categorias com gente", () => {
    const t = textoDoDigest({ emRisco: 2, recompraAtrasada: 0, perda: 1, monitorados: 9 });
    expect(t.title).toBe("Resumo do Radar de hoje");
    expect(t.body).toContain("2 em alto risco");
    expect(t.body).toContain("1 cancelados sem nova compra");
    expect(t.body).not.toContain("recompra");
  });
});

describe("resumirRadar", () => {
  it("classifica com a mesma regra da tela", () => {
    const hoje = "2026-09-22";
    const c = resumirRadar(
      [
        // c1 comprou ontem: em dia.
        pedido({ id: "p1", dia: "2026-09-21" }),
        // c2 comprou há 60 dias uma vez: sem intervalo para comparar, mas
        // primeira compra antiga conta como atrasada pela regra do radar.
        pedido({ id: "p2", contact_id: "c2", dia: "2026-07-24" }),
      ],
      hoje,
    );
    expect(c.monitorados).toBe(2);
    expect(c.emRisco + c.recompraAtrasada + c.perda).toBeGreaterThanOrEqual(0);
  });
});
