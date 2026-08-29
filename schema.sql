-- HYPEX CMS database
create table if not exists public.site_content (
  id bigint primary key generated always as identity,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "public can read site content"
on public.site_content for select
to anon, authenticated
using (true);

create policy "authenticated admins can update site content"
on public.site_content for update
to authenticated
using (auth.uid() is not null)
with check (auth.uid() is not null);

create policy "authenticated admins can insert site content"
on public.site_content for insert
to authenticated
with check (auth.uid() is not null);

insert into public.site_content (content)
select '{
"heroEyebrow":"HYPEX",
"heroTitle":"WHERE HYPE MEETS EXECUTION",
"heroSubtitle":"HYPEX — a next-generation crypto + metaverse + AI ecosystem powered by the HXP token.",
"marketCap":"—","holders":"—","transactions":"—","burned":"—",
"aboutTitle":"About HYPEX",
"aboutText":"HYPEX (HXP) merges blockchain, AI and the metaverse to create an immersive, community-driven digital universe.",
"vision":"To build a global digital ecosystem that connects creativity, finance, and technology — empowering individuals in the metaverse.",
"mission":"Bridge blockchain and everyday users through AI-powered, metaverse-integrated experiences that are fun, secure and community-led.",
"values":"Innovation\nTransparency\nEmpowerment\nSecurity",
"tokenomicsIntro":"Designed for sustainability and community ownership.",
"totalSupply":"1,000,000,000 HXP","circulating":"—","burnRate":"—",
"ecosystem":[
{"title":"HXP Token","text":"Utility token used for transactions, rewards, staking and in-metaverse interactions.","tags":"Utility,Staking"},
{"title":"HYPEX Metaverse","text":"Immersive virtual spaces for socializing, events, NFT trading and real economic activity.","tags":"NFTs,Events"},
{"title":"HYPEX AI","text":"AI-driven tools for analytics, trading signals, and intelligent avatars that adapt to users.","tags":"Analytics,Avatars"},
{"title":"HYPEX Wallet","text":"Secure multi-chain wallet with biometric access and AI-based fraud detection.","tags":"Multi-chain,Secure"}],
"roadmap":[
{"phase":"Phase 1","title":"Token Launch & Community Growth"},
{"phase":"Phase 2","title":"Exchange Listings & Partnerships"},
{"phase":"Phase 3","title":"Staking & DEX"},
{"phase":"Phase 4","title":"Full Ecosystem Expansion"}],
"telegram":"https://t.me/","twitter":"https://x.com/","contract":"HNPUC2V1STRDnrGFMi1hZ9ZYHVSABybnBeMXAq1Xjupx",
"footerText":"© 2026 HYPEX — Built for believers, powered by execution."
}'::jsonb
where not exists (select 1 from public.site_content);
