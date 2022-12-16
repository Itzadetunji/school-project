const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const express = require("express");
const { Adapter } = require("adminjs-sql");
const { initDb } = require("./initDb");
const { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } = require("./consts");

async function bootstrap() {
	await initDb();
	const app = express();
	AdminJS.registerAdapter(Adapter);

	const database = await Adapter.init("mysql2", {
		host: DB_HOST,
		port: DB_PORT,
		user: DB_USER,
		password: DB_PASSWORD,
		database: DB_NAME,
	});

	const adminJs = new AdminJS({
		databases: [database],
		resources: database.tables(),
		rootPath: "/",
	});

	const router = AdminJSExpress.buildRouter(adminJs);
	app.use(adminJs.options.rootPath, router);
	app.listen(33300, () =>
		console.log("adminjs-sql example app is under http://localhost:33300")
	);
}

bootstrap();
