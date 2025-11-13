import { Global, Module } from "@nestjs/common";
import { PostgresClient } from "./postgres.client";
import { PgVectorRepository } from "./pgvector.repository";

@Global()
@Module({
    providers: [PostgresClient, PgVectorRepository],
    exports: [PostgresClient, PgVectorRepository]
})
export class DatabaseModule { }