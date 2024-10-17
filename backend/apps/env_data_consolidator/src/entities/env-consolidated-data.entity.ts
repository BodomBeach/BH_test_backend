import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("env_consolidated_data")
export class EnvConsolidatedData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: string;

  @Column({ type: "bigint" })
  timestamp: number;

  @Column({ type: "float" })
  averageFillingSpeed: number;
}
