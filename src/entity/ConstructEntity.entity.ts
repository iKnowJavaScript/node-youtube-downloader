import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity } from "typeorm";

export abstract class ConstructEntity extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "boolean", default: true, select: false })
  active: boolean;

  @Column({ default: false, select: false })
  deleted: boolean;

  @CreateDateColumn({ update: false })
  create_date: Date;
}
