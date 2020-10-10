drop table if exists user;
drop table if exists items;
drop table if exists subscriptions;

create table user (
	id integer primary key autoincrement,
	email text unique,
	hash text 
);

create table subscriptions (
	id integer primary key autoincrement,
	url text unique
);

create table items (
	id integer primary key autoincrement,
	pubDate integer,
	title text,
	description text,
	link text,
	feedTitle text,
	feedLink text,
	saved integer default 0
);

