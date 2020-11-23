drop table if exists user;
drop table if exists post;
drop table if exists feed;

create table user (
	id integer primary key autoincrement,
	email text unique,
	hash text 
);

create table feed (
	id integer primary key autoincrement,
	url text unique
);

create table post (
	id integer primary key autoincrement,
	pubDate integer,
	title text,
	description text,
	link text,
	feedTitle text,
	feedLink text,
	saved integer default 0
);

