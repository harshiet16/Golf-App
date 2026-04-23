
drop table if exists winners cascade;
drop table if exists draws cascade;
drop table if exists scores cascade;
drop table if exists users cascade;
drop table if exists charities cascade;

create table charities (
  id uuid default gen_random_uuid() primary key,
  name varchar(255) not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table users (
  id uuid default gen_random_uuid() primary key,
  name varchar(255) not null,
  email varchar(255) unique not null,
  password_hash text not null,
  role varchar(50) default 'user' check (role in ('user', 'admin')),
  subscription_status varchar(50) default 'expired' check (subscription_status in ('active', 'expired', 'cancelled')),
  charity_id uuid references charities(id) on delete set null,
  charity_percentage decimal(5,2) default 10.00 check (charity_percentage >= 10.00 and charity_percentage <= 100.00),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  score int not null check (score >= 1 and score <= 45),
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date) 
);

create table draws (
  id uuid default gen_random_uuid() primary key,
  month text not null, 
  numbers int[] not null, 
  type varchar(50) default 'random' check (type in ('random', 'algorithmic')),
  status varchar(50) default 'pending' check (status in ('pending', 'completed')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table winners (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  draw_id uuid references draws(id) on delete cascade not null,
  match_type int not null check (match_type in (3, 4, 5)),
  prize decimal(10,2) default 0.00,
  status varchar(50) default 'pending' check (status in ('pending', 'paid')),
  proof_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into charities (name, description, image_url) values 
('Global Clean Water', 'Providing clean drinking water to remote villages.', 'https://images.unsplash.com/photo-1517400508491-9de2b06ee29f?q=80&w=600&auto=format&fit=crop'),
('Education for All', 'Building schools and providing supplies in developing nations.', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop'),
('Wildlife Conservation', 'Protecting endangered species and their habitats.', 'https://images.unsplash.com/photo-1510103233157-1bf16ba645d9?q=80&w=600&auto=format&fit=crop');
