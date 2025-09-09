// File: __tests__/addVehicle.test.mjs

// Import necessary libraries using ES Module syntax
import request from 'supertest';
import { expect } from 'chai'; // The assertion library
import { Vehicle } from '../models/Vehicle.mjs'; // The Mongoose model
import app from '../index.js'; // The Express app

// --- Test Suite for the /api/vehicles Endpoint ---
describe('POST /api/vehicles', () => {
  // Test Case: Successful creation of a new vehicle
  it('should create a new vehicle and return a 201 status code', async () => {
    // Arrange: Define the request body
    const newVehicleData = {
      name: 'Truck',
      capacityKg: 5000,
      tyres: 6,
    };

    // Act: Use Supertest to make the POST request
    const response = await request(app)
      .post('/api/vehicles')
      .send(newVehicleData);

    // Assert 1: Verify the HTTP response
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message', 'Vehicle added successfully');
    expect(response.body).to.have.property('vehicle');
    expect(response.body.vehicle.name).to.equal('Truck');

    // Assert 2: Verify the document was actually saved in the database
    const savedVehicle = await Vehicle.findOne({ name: 'Truck' });
    expect(savedVehicle).to.not.be.null;
    expect(savedVehicle.capacityKg).to.equal(5000);
  });

  // Test Case: Handling of invalid input
  it('should return a 400 status code for invalid data', async () => {
    // Arrange: Define an incomplete request body
    const invalidData = {
      name: 'Bus',
      // Missing capacityKg and tyres
    };

    // Act: Make the POST request
    const response = await request(app)
      .post('/api/vehicles')
      .send(invalidData);

    // Assert 1: Verify the HTTP response
    expect(response.status).to.equal(400); // Assuming your route validates and sends a 400
    // Assert 2: Verify no document was saved in the database
    const vehicleCount = await Vehicle.countDocuments();
    expect(vehicleCount).to.equal(0);
  });
});
