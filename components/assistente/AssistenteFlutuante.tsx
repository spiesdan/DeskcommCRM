"use client";

import { useCallback, useEffect, useState } from "react";
import { AssistenteAvatar } from "./AssistenteAvatar";
import { AssistenteChat } from "./AssistenteChat";

/**
 * Orquestra avatar + chat no canto inferior direito da ÁREA LOGADA.
 *
 * Montado no `AppShell` (só `/app/*`), então login, onboarding e landing
 * nunca o veem. `Esc` fecha o chat; o estado vive aqui para o avatar reagir
 * visualmente (boca aberta) enquanto o chat está aberto.
 */
export function AssistenteFlutuante() {
  const [aberto, setAberto] = useState(false);
  const alternar = useCallback(() => setAberto((v) => !v), []);
  const fechar = useCallback(() => setAberto(false), []);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
  }, [aberto, fechar]);

  // `bottom-24 md:bottom-5`: o dock mobile é fixo e cobriria o avatar.
  return (
    <div
      className="fixed right-5 bottom-24 z-40 flex flex-col items-end gap-3 md:bottom-5 print:hidden"
      data-assistente="flutuante"
    >
      <AssistenteChat aberto={aberto} onFechar={fechar} />
      <AssistenteAvatar aberto={aberto} onToggle={alternar} />
    </div>
  );
}
