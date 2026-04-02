import { jest } from '@jest/globals';

class MockService {
  constructor(data) {
    Object.assign(this, data);
  }
  save() {}
}
MockService.find = jest.fn();
MockService.findById = jest.fn();

jest.unstable_mockModule('../models/service.model.js', () => ({
  default: MockService,
}));

const { default: Service } = await import('../models/service.model.js');
const {
  getAllServices,
  createService,
  getServiceById,
} = await import('../controllers/service.controller.js');

const mockReq = (overrides = {}) => ({
  user: { userId: 'user123' },
  params: {},
  body: {},
  file: null,
  ...overrides,
});

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getAllServices', () => {

  it('should return 200 with the list of services for the provider', async () => {
    const fakeServices = [
      { _id: 's1', name: 'Haircut', provider_id: 'user123' },
      { _id: 's2', name: 'Massage', provider_id: 'user123' },
    ];

    Service.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeServices),
    });

    const req = mockReq();
    const res = mockRes();

    await getAllServices(req, res);

    expect(Service.find).toHaveBeenCalledWith({ provider_id: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeServices);
  });

  it('should return 500 if a database error occurs', async () => {
    Service.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('DB Error')),
    });

    const req = mockReq();
    const res = mockRes();

    await getAllServices(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB Error' });
  });
});

describe('createService', () => {

  it('should create a service and return 201 without an image', async () => {
    const savedService = {
      _id: 'service_new',
      name: 'Plumbing',
      price: 150,
      provider_id: 'user123',
      image: '',
    };

    Service.prototype.save = jest.fn().mockResolvedValue(savedService);

    const req = mockReq({
      body: { name: 'Plumbing', price: 150, category: 'Home', description: 'Fix pipes' },
      file: null,
    });
    const res = mockRes();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(Service.prototype.save).toHaveBeenCalled();
  });

  it('should include imageUrl when a cloudinary file is provided', async () => {
    const savedService = { _id: 's3', image: 'https://cloudinary.com/img.jpg' };

    Service.prototype.save = jest.fn().mockResolvedValue(savedService);

    const req = mockReq({
      body: { name: 'Photography', price: 200, category: 'Art', description: 'Pro photos' },
      file: { cloudinaryUrl: 'https://cloudinary.com/img.jpg' },
    });
    const res = mockRes();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedService);
  });

  it('should return 400 if saving the service fails', async () => {
    Service.prototype.save = jest.fn().mockRejectedValue(new Error('Validation error'));

    const req = mockReq({ body: { name: '' } });
    const res = mockRes();

    await createService(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
  });
});

describe('getServiceById', () => {

  it('should return 200 if the service belongs to the logged-in provider', async () => {
    const fakeService = {
      _id: 'service123',
      name: 'Electrical',
      provider_id: {
        _id: { toString: () => 'user123' },
      },
    };

    Service.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeService),
    });

    const req = mockReq({
      params: { id: 'service123' },
      user: { userId: 'user123' },
    });
    const res = mockRes();

    await getServiceById(req, res);

    expect(Service.findById).toHaveBeenCalledWith('service123');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeService);
  });

  it('should return 403 if the service belongs to a different provider', async () => {
    const fakeService = {
      _id: 'service123',
      provider_id: {
        _id: { toString: () => 'otherUser999' },
      },
    };

    Service.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(fakeService),
    });

    const req = mockReq({
      params: { id: 'service123' },
      user: { userId: 'user123' },
    });
    const res = mockRes();

    await getServiceById(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
  });

  it('should return 404 if the service does not exist', async () => {
    Service.findById.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const req = mockReq({ params: { id: 'nonExistentId' } });
    const res = mockRes();

    await getServiceById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Service not found' });
  });

  it('should return 500 if an unexpected server error occurs', async () => {
    Service.findById.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error('Server crash')),
    });

    const req = mockReq({ params: { id: 'service123' } });
    const res = mockRes();

    await getServiceById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});