-- 0237: digest diário do Radar na Central de avisos (resumo, sem spam).
--
-- agent_inbox_items.kind += 'radar_digest' (recria o CHECK de forma
-- auto-curativa, mesmo padrão da 0062). A rota
-- app/api/v1/cron/radar-digest grava UM item por org por dia, só quando há
-- o que dizer, e pula se já existir um aberto de hoje (re-tick manual não
-- duplica).
alter table agent_inbox_items drop constraint if exists agent_inbox_items_kind_check;
alter table agent_inbox_items add constraint agent_inbox_items_kind_check
  check (kind in ('qr_rescan','job_dead','event_dead','budget_exceeded','handoff',
                  'promotion_review','judge_unaligned','snooze_expired','radar_digest','other'));
