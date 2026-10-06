-- Función interna de Supabase (auto-RLS): no debe ser invocable vía /rest/v1/rpc
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

-- Índices que cubren las FK compuestas; reemplazan a los de una sola columna
create index transactions_account_user_idx on public.transactions (account_id, user_id);
create index transactions_category_user_idx on public.transactions (category_id, user_id);
drop index public.transactions_account_idx;
drop index public.transactions_category_idx;
