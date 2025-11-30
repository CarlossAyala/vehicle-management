import { Test, TestingModule } from "@nestjs/testing";
import { OdometerController } from "./odometer.controller";
import { OdometerService } from "./odometer.service";

describe("OdometerController", () => {
  let controller: OdometerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OdometerController],
      providers: [OdometerService],
    }).compile();

    controller = module.get<OdometerController>(OdometerController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
