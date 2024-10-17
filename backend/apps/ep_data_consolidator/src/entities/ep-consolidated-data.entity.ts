import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("ep_consolidated_data")
export class EPConsolidatedData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceId: string;

  @Column({ type: "bigint" })
  timestamp: number;

  @Column({ type: "float" })
  averageEnergy: number;
}
