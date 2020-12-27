drop table if exists userRole;
drop table if exists role;
drop table if exists accountStatus;
drop table if exists user;
drop table if exists post;
drop table if exists feed;

create table role (
	id integer primary key autoincrement,
	name text not null
);

insert into role (name) values ('user');
insert into role (name) values ('admin');

create table userRole (
	userId integer not null,
	roleId integer not null,
	foreign key (userId) references user(id),
	foreign key (roleId) references role(id),
	primary key (userId, roleId)
);

create table accountStatus (
	id integer primary key autoincrement,
	name text not null,
	canLogin integer not null,
	unique (name)
);

insert into accountStatus (name, canLogin) values ('verified', 1);
insert into accountStatus (name, canLogin) values ('registered', 0);

create table user (
	id integer primary key autoincrement,
	email text not null,
	hash text not null,
	statusId integer not null,
	foreign key (statusId) references accountStatus(id),
	unique (email)
);

create table feed (
	id integer primary key autoincrement,
	url text not null,
	userId integer not null,
	foreign key (userId) references user(id),
	unique (userId, url)
);

create table post (
	id integer primary key autoincrement,
	userId integer not null,
	pubDate integer not null,
	title text not null,
	description text not null,
	url text not null,
	feedTitle text not null,
	feedUrl text not null,
	saved integer not null default 0,
	unique (userId, url),
	foreign key (userId) references user(id)
);

