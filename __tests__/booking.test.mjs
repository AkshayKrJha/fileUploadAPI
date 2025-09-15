/**create few bookings and check for overlaps
 * first it should register some (say 4) vehicles successfully
 * vehicle 1 : {
      name: 'Truck',
      capacityKg: 5000,
      tyres: 6,
    };
    vehicle 2 : {
      name: 'Bus',
      capacityKg: 800,
      tyres: 4,
    };
    get their Ids
 * create 3 bookings:
    Booking 1 : {
    vehicleId: someRandomMongooseId,
    fromPincode: '560001',
    toPincode: '560002',
    startTime: '2025-10-10T10:00:00Z',
    customerId: "someId"}

 * should give 404

    Booking 2 : {
    vehicleId: IdOfVehicle1,
    fromPincode: '560003',
    toPincode: '560004',
    startTime: '2023-10-10T10:30:00Z',
    customerId: "someId"}

 * should give 201

    Booking 3: {
    vehicleId: IdOfVehicle2,
    fromPincode: '560005',
    toPincode: '560006',
    startTime: '2024-10-10T11:00:00Z',
    customerId: "someId"}

 * should give 409 as it overlaps with booking 2
    
 */

import { expect } from "chai";
import request from "supertest";
import app from "../index.js";
import { Booking } from "../models/Booking.mjs";
import { Vehicle } from "../models/Vehicle.mjs";
import { connection } from "./test-setup.mjs";

describe("POST /api/bookings", () => {
  let vehicle1Id, vehicle2Id, vehicle3Id, vehicle4Id;
  let customerId = "someId";

  before(async () => {
    if (connection && connection.dropDatabase) {
      await connection.dropDatabase();
    }
  });

  before(async () => {
    // Create 4 vehicles
    const vehicles = [
      { name: "Truck", capacityKg: 5000, tyres: 6 },
      { name: "Bus", capacityKg: 800, tyres: 4 },
      { name: "Van", capacityKg: 1200, tyres: 4 },
      { name: "Mini", capacityKg: 400, tyres: 4 },
    ];
    const created = await Vehicle.insertMany(vehicles);
    vehicle1Id = created[0]._id.toString();
    vehicle2Id = created[1]._id.toString();
    vehicle3Id = created[2]._id.toString();
    vehicle4Id = created[3]._id.toString();

  //   console.log(
  //     "Created vehicle IDs:",
  //     vehicle1Id,
  //     vehicle2Id,
  //     vehicle3Id,
  //     vehicle4Id
  //   );
  });

  after(async () => {
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
  });

  it("should return 404 for booking with non-existent vehicle", async () => {
    const res = await request(app).post("/api/bookings").send({
      vehicleId: "64b7f8e2f8e2f8e2f8e2f8e2", // random mongoose id
      fromPincode: "560001",
      toPincode: "560002",
      startTime: "2025-10-10T10:00:00Z",
      customerId,
    });
    expect(res.status).to.equal(404);
  });

  it("should create booking for vehicle 1 and return 201", async () => {
    try {
      const res = await request(app).post("/api/bookings/").send({
        vehicleId: vehicle1Id,
        fromPincode: "560003",
        toPincode: "560004",
        startTime: "2023-10-10T10:30:00Z",
        customerId,
      });
      // console.log("Body:", res.body);
      expect(res.status).to.equal(201);
      expect(res.body?.booking).to.have.property("vehicleId", vehicle1Id);
    } catch (err) {
      console.error("Test failed:", err.message);
      if (err.response) {
        console.error("Response body:", err.response.body);
      }
      throw err; // rethrow so Mocha marks the test as failed
    }
  });

  it('should return 409 because startTime lies in someone else booking window', async () => {
      // First, create a booking for vehicle 2 at a time that overlaps with vehicle 1
      await request(app)
          .post('/api/bookings')
          .send({
              vehicleId: vehicle2Id,
              fromPincode: '560005',
              toPincode: '560006',
              startTime: '2023-10-10T10:45:00Z', // overlaps with previous booking
              customerId
          })
          .expect(409);
  });

  it('should return 409 because window fully overlaps someone else window', async () => {
      const res = await request(app)
          .post('/api/bookings')
          .send({
              vehicleId: vehicle3Id,
              fromPincode: '560007',
              toPincode: '560010',
              startTime: '2023-10-10T09:00:00Z',
              customerId
          }).expect(409);
  });

  it('should return 409 because end time falls in booking window of someone', async () => {
      const res = await request(app)
          .post('/api/bookings')
          .send({
              vehicleId: vehicle4Id,
              fromPincode: '560011',
              toPincode: '560012',
              startTime: '2023-10-10T10:00:00Z',
              customerId
          }).expect(409);
  });

  it('should create successful booking as booking window does not overlap, with status 201', async () => {
      const res = await request(app)
          .post('/api/bookings')
          .send({
              vehicleId: vehicle4Id,
              fromPincode: '560012',
              toPincode: '560013',
              startTime: '2023-10-10T13:00:00Z',
              customerId
          })
          expect(res.status).to.equal(201);
  });
});
