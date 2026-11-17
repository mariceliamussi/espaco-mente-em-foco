create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

-- First user to sign up becomes admin
create or replace function public.handle_new_user_role()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_role after insert on auth.users
for each row execute function public.handle_new_user_role();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- Services
create table public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  duration_minutes int not null default 50,
  price numeric(10,2) not null default 0,
  modality text not null default 'Online e presencial',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;
grant all on public.services to service_role;
alter table public.services enable row level security;
create policy "Public reads active services" on public.services for select to anon, authenticated using (active or public.has_role(auth.uid(), 'admin'));
create policy "Admin manages services" on public.services for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();

-- Posts
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.posts to anon, authenticated;
grant insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
alter table public.posts enable row level security;
create policy "Public reads published posts" on public.posts for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admin manages posts" on public.posts for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

-- Appointments
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null default '',
  service_id uuid references public.services(id) on delete set null,
  preferred_date date not null,
  preferred_time text not null,
  modality text not null default 'Online',
  message text not null default '',
  status text not null default 'pendente',
  created_at timestamptz not null default now()
);
grant insert on public.appointments to anon, authenticated;
grant select, update, delete on public.appointments to authenticated;
grant all on public.appointments to service_role;
alter table public.appointments enable row level security;
create policy "Anyone can request appointment" on public.appointments for insert to anon, authenticated with check (status = 'pendente' and length(name) between 1 and 200 and length(email) between 3 and 255 and length(message) <= 2000);
create policy "Admin reads appointments" on public.appointments for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates appointments" on public.appointments for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes appointments" on public.appointments for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "Anyone can send message" on public.contact_messages for insert to anon, authenticated with check (read = false and length(name) between 1 and 200 and length(email) between 3 and 255 and length(message) between 1 and 3000);
create policy "Admin reads messages" on public.contact_messages for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin updates messages" on public.contact_messages for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admin deletes messages" on public.contact_messages for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Patients
create table public.patients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  birth_date date,
  notes text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.patients to authenticated;
grant all on public.patients to service_role;
alter table public.patients enable row level security;
create policy "Admin manages patients" on public.patients for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create trigger patients_touch before update on public.patients for each row execute function public.touch_updated_at();

create table public.patient_notes (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  session_date date not null default current_date,
  content text not null,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.patient_notes to authenticated;
grant all on public.patient_notes to service_role;
alter table public.patient_notes enable row level security;
create policy "Admin manages notes" on public.patient_notes for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- Seed
insert into public.services (title, description, duration_minutes, price, modality, sort_order) values
('Psicoterapia individual', 'Sessões semanais para adultos que buscam autoconhecimento, alívio da ansiedade e mais equilíbrio emocional.', 50, 180, 'Online e presencial', 1),
('Terapia de casal', 'Um espaço seguro para melhorar a comunicação, resolver conflitos e fortalecer o vínculo.', 80, 260, 'Online e presencial', 2),
('Orientação para adolescentes', 'Acolhimento para jovens de 13 a 17 anos e orientação para os pais.', 50, 170, 'Presencial', 3),
('Primeira conversa', 'Encontro inicial para entender sua demanda e tirar dúvidas sobre o processo terapêutico.', 30, 0, 'Online', 4);

insert into public.posts (slug, title, excerpt, content, published, published_at) values
('ansiedade-no-dia-a-dia', 'Ansiedade no dia a dia: como reconhecer os sinais', 'Pequenos sinais do corpo e da mente que merecem sua atenção — e o que fazer com eles.', E'A ansiedade é uma resposta natural do corpo, mas quando se torna constante ela começa a ocupar espaço demais.\n\nAlguns sinais comuns: dificuldade para dormir, pensamentos acelerados, tensão muscular e irritabilidade.\n\nPraticar a respiração lenta, organizar a rotina e conversar com alguém de confiança ajudam. Se os sintomas persistirem, buscar acompanhamento psicológico é um passo de cuidado, não de fraqueza.', true, now() - interval '3 days'),
('autocuidado-real', 'Autocuidado de verdade vai além do banho de espuma', 'Autocuidado também é dizer não, descansar sem culpa e respeitar seus limites.', E'Muitas vezes o autocuidado é vendido como algo estético. Mas cuidar de si é, antes de tudo, escutar suas necessidades.\n\nIsso inclui estabelecer limites, dormir bem, pedir ajuda e se permitir sentir.\n\nComece pequeno: escolha uma atitude por semana que seja só sua.', true, now() - interval '10 days'),
('quando-procurar-terapia', 'Quando procurar terapia?', 'Não é preciso estar em crise para começar. Entenda quando a terapia pode ajudar.', E'Terapia não é só para momentos difíceis. Ela é um espaço para se conhecer melhor, entender padrões e fazer escolhas mais conscientes.\n\nSe você sente que algo se repete na sua vida, que está sobrecarregado ou simplesmente quer crescer, a terapia pode ser um ótimo caminho.', true, now() - interval '20 days');