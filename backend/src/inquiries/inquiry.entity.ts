import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity("inquiries")
export class Inquiry {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 20, default: "general" })
  type!: string;

  @Column({ type: "varchar", nullable: true })
  tripSlug?: string | null;

  @Column({ type: "varchar", nullable: true })
  tripTitle?: string | null;

  @Column({ type: "varchar", nullable: true })
  departureLabel?: string | null;

  @Column({ type: "varchar" })
  name!: string;

  @Index()
  @Column({ type: "varchar" })
  email!: string;

  @Column({ type: "varchar", nullable: true })
  phone?: string | null;

  @Column({ type: "int", nullable: true })
  groupSize?: number | null;

  @Column({ type: "varchar", nullable: true })
  preferredDates?: string | null;

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "varchar", length: 20, default: "new" })
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
