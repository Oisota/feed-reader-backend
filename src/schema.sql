drop table if exists items;
drop table if exists subscriptions;

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

