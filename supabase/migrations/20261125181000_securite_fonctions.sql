-- est_admin ne lit que le jeton de session : pas besoin de droits élevés.
alter function public.est_admin() security invoker;
-- La numérotation n'est appelée que par emettre_facture / emettre_devis.
revoke execute on function public.prochain_numero(text, date) from authenticated;
