import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from "typeorm";



@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({default:false})
  attendance_status!:boolean

  @Column({
    type: "date",
    nullable: true,
  })
  attendance_date!: Date | null;
  

  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

}
