import { Test, TestingModule } from "@nestjs/testing";
import { OdometerService } from "./odometer.service";

describe("OdometerService", () => {
  let service: OdometerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OdometerService],
    }).compile();

    service = module.get<OdometerService>(OdometerService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
