/**
 * create 4 vehicles and 4 bookings
 */

import { expect } from "chai";
import request from "supertest";
import app from "../index.js";
import { Booking } from "../models/Booking.mjs";
import { Vehicle } from "../models/Vehicle.mjs";
import { connection } from "./test-setup.mjs";

describe("GET /api/vehicles/available", function () {
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
  });

  before(async () => {
    const bookings = [
      {
        vehicleId: vehicle1Id,
        fromPincode: "800001",
        toPincode: "800003",
        startTime: "2025-10-10T05:00:00Z",
      },
      {
        vehicleId: vehicle1Id,
        fromPincode: "800003",
        toPincode: "800028",
        startTime: "2025-10-10T09:00:00Z",
      },
      {
        vehicleId: vehicle2Id,
        fromPincode: "800005",
        toPincode: "800008",
        startTime: "2025-10-10T12:00:00Z",
      },
      {
        vehicleId: vehicle3Id,
        fromPincode: "800008",
        toPincode: "800009",
        startTime: "2025-10-10T16:00:00Z",
      },
      {
        vehicleId: vehicle4Id,
        fromPincode: "800009",
        toPincode: "800011",
        startTime: "2025-10-10T18:00:00Z",
      },
    ];
    // Function to create a single booking
    const createAndSaveBooking = async (bookingData) => {
      const newBooking = new Booking(bookingData);
      return await newBooking.save();
    };

    // Iterate through the bookings array and save each one
    const createdBookings = await Promise.all(
      bookings.map(createAndSaveBooking)
    );
    // const createdBookings = await Booking.insertMany(bookings);
  });

  after(async () => {
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
  });

  /**
   * input 1 : capacityRequired=1000, fromPinCode= 800004, toPinCode=800006, startTime="2025-10-10T09:30:00Z"
   * expected vehicle4Id (mini)
   * input 2 : capacityRequired=1000, fromPinCode= 800004, toPinCode=800007, startTime="2025-10-10T10:00:00Z"
   * other inputs
   */

  it("should return no vehicles", async () => {
    const res = await request(app).get("/api/vehicles/available").query({
      capacityRequired: 1500,
      fromPincode: "800001",
      toPincode: "800003",
      startTime: "2025-10-10T09:30:00Z",
    });
    expect(res.status).to.equal(200);
    expect(res.body.vehicles?.length).to.equal(0);
  });

  it("should return one vehicle", async () => {
    const res = await request(app).get("/api/vehicles/available").query({
      capacityRequired: 1000,
      fromPincode: "800001",
      toPincode: "800003",
      startTime: "2025-10-10T09:30:00Z",
    });
    expect(res.status).to.equal(200);
    expect(res.body.vehicles?.length).to.equal(1);
    // the vehicle should be van
    expect(res?.body?.vehicles?.[0]?.capacityKg).to.equal(1200);
  });

  it("should return two vehicles", async () => {
    const res = await request(app).get("/api/vehicles/available").query({
      capacityRequired: 1000,
      fromPincode: "800002",
      toPincode: "800003",
      startTime: "2025-10-10T10:30:00Z",
    });
    expect(res.status).to.equal(200);
    expect(res.body.vehicles?.length).to.equal(2);
    // vehicle capacity should be 1200 and 5000
    expect(res?.body?.vehicles?.map((v) => v.capacityKg).sort()).to.eql([
      1200, 5000,
    ]);
  });

  it("should return three vehicles", async () => {
    const res = await request(app).get("/api/vehicles/available").query({
      capacityRequired: 300,
      fromPincode: "800007",
      toPincode: "800106",
      startTime: "2025-10-10T06:00:00Z",
    });
    expect(res.status).to.equal(200);
    expect(res.body.vehicles?.length).to.equal(3);
    // vehicle capacity 400, 800, 1200
    expect(
      res?.body?.vehicles?.map((v) => v.capacityKg).sort((a, b) => a - b)
    ).to.eql([400, 800, 1200]);
  });

  it("should return four vehicles", async () => {
    const res = await request(app).get("/api/vehicles/available").query({
      capacityRequired: 300,
      fromPincode: "800008",
      toPincode: "800033",
      startTime: "2025-10-10T10:00:00Z",
    });
    expect(res.status).to.equal(200);
    expect(res.body.vehicles?.length).to.equal(4);
    expect(
      res?.body?.vehicles?.map((v) => v.capacityKg).sort((a, b) => a - b)
    ).to.eql([400, 800, 1200, 5000]);
  });
});
