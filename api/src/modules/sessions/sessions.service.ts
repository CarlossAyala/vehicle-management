import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async create(sessionData: Partial<Session>): Promise<Session> {
    const session = this.sessionRepository.create(sessionData);
    return this.sessionRepository.save(session);
  }

  async findById(id: Session["id"]): Promise<Session | null> {
    return this.sessionRepository.findOneBy({ id });
  }

  async remove(id: Session["id"]): Promise<void> {
    await this.sessionRepository.delete(id);
  }
}
