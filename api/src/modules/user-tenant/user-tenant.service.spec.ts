import { Test, TestingModule } from "@nestjs/testing";
import { UsersTenantsService as UserTenantService } from "./users-tenants.service";

describe("UserTenantService", () => {
  let service: UserTenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTenantService],
    }).compile();

    service = module.get<UserTenantService>(UserTenantService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
