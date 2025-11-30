import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findOne(id: User["id"]): Promise<User> {
    return this.findByIdOrFail(id);
  }

  async findById(id: User["id"]): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  async findByIdOrFail(id: User["id"]): Promise<User> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async findByEmail(email: User["email"]): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }
}
