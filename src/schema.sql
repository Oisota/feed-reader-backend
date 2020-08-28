drop table if exists items;

create table items (
	id integer primary key autoincrement,
	pubDate integer,
	title text,
	description text,
	`link` text,
	feedTitle text,
	feedLink text
);
