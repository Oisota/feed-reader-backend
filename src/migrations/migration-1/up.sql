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
	url text,
	userId integer,
	foreign key (userId) references user(id),
	unique (userId, url)
);

create table post (
	id integer primary key autoincrement,
	userId integer,
	pubDate integer,
	title text,
	description text,
	url text,
	feedTitle text,
	feedUrl text,
	saved integer default 0,
	unique (userId, url),
	foreign key (userId) references user(id)
);

