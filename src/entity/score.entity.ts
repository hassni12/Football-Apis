import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from "typeorm";
// import * as bcrypt from "bcryptjs";
import { Length, IsInt, Min, Max, IsNotEmpty } from "class-validator";
import { User } from "./user.entity";
// User
@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  pac!: number;

  @Column({
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  sho!: number;

  @Column({
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  das!: number;

  @Column({
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  dri!: number;

  @Column({
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  def!: number;

  @Column({
    default: 0,
  })
  @IsInt()
  @Min(0)
  @Max(100)
  phy!: number;

  @ManyToOne((type) => User, (user) => user.scores, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "player_score_id" })
  user!: User;

  //  @OneToOne(() => User, (user) => user.profile) // specify inverse side as a second parameter
  //  user: User
  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;
}
