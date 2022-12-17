import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,JoinColumn
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Length, IsEmail, IsNotEmpty } from "class-validator";
import { Batch } from './batch.entity';
import { Payment } from './payment.entity';
import { Score } from './score.entity';
// Score
// Payment
// Batch
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  })
  avatar!: string;

  @Column({
    unique: true,
    nullable: false,
  })
  @IsEmail()
  email!: string;
  
  @Column({
    // unique: true,
    nullable: false,
  })
  nic!:string;
   
  @Column({ nullable: false })
  password!: string;

  @Column({ default: "USER" })
  @IsNotEmpty()
  role!: string;

  @Column({
    type: "date",
    nullable: true,
  })
  date_of_birth!: Date | null;

  @Column({
    default: false,
  })
  approve_status!: Boolean;
  
  @OneToMany(()  => Batch, batch => batch.users, {
    cascade: true,
    eager: true
}) 
  batchs!: Batch[]; 
  
  @OneToMany(()  => Batch, batch => batch.players, {
    cascade: true,
    eager: true
}) 
  player_batch!: Batch[]; 

  @OneToMany((type) => Payment, (payment) => payment.user, {
    cascade: true,
    eager: true
})
  payments!: Payment[]

  @OneToMany(type => Score,score=>score.user, {
    cascade: true,
    eager: true
}) 
   scores!: Score[];


  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

  // @Column()
  // token!: string[]

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
