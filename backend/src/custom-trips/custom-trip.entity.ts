import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("custom_trip_requests")
export class CustomTripRequest {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Index()
  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  phone?: string | null;

  @Column({ type: "varchar", nullable: true })
  interests?: string | null;

  @Column({ type: "varchar", nullable: true })
  preferredDates?: string | null;

  @Column({ type: "int", nullable: true })
  groupSize?: number | null;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "varchar", length: 20, default: "new" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
