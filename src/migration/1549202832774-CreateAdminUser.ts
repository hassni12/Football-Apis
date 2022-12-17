import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from '../entity/user.entity';

export class CreateAdminUser1547919837483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.name = "admin@example.com";
    user.password = "Password123#@!";
    user.hashPassword();
    user.role = "ADMIN";
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
