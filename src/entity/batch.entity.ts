import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Batch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  batch_name!: string;  
  
  @ManyToOne(() => User, user => user.batchs)
  @JoinColumn({ name: 'coach_id' })
  users!: User;
 
    
  @ManyToOne(() => User, user => user.batchs, {
    onDelete: 'CASCADE',
    onUpdate:'CASCADE',
    
})
  @JoinColumn({ name: 'player_id' })
  players!: User;
  // @ManyToOne(type =>  student => student.projects) student: Student;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;
}
