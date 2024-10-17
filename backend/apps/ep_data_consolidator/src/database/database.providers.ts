import { DataSource } from "typeorm";

export const databaseProviders = [
  {
    provide: "DATA_SOURCE",
    useFactory: async () => {
      const dataSource = new DataSource({
        type: "mysql",
        host: "mysql",
        port: 3306,
        username: "bh",
        password: "bh",
        database: "bh",
        entities: [__dirname + "/../**/*.entity{.ts,.js}"],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
