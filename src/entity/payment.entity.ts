import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Length, IsEmail, IsNotEmpty } from "class-validator";
import { User } from './user.entity';
// User
@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: "Tranfer traction is not successful.",
  })
  message!: string;

  @Column({ nullable: false,default:"not paid yet" })
  reference!: string;

  @Column({
    nullable: false,
    default:"not paid yet"
  })
  from!: string;

  @Column({
    nullable: false,
    default:"not paid yet"
  })
  to!: string;

  @Column({ default: 0, nullable: false })
  total_price!: number;

  @Column({
    default: false,
  })
  isPaid!: Boolean;

  // @Column({ type: "date",default:"not paid yet" })
  // paidAt!: string;

  @Column({
    default: false,
  })
  isApproved!: Boolean;

  
  // @Column({ type: "date" })
  // approvedAt!: string;

  @ManyToOne((type) => User, (user) => user.payments, {
    onDelete: 'CASCADE',
    onUpdate:'CASCADE',
    
})
  @JoinColumn({ name: 'player_id' })
  user!: User

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;
}
