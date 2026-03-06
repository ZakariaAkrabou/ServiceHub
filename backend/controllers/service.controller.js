import Service from '../models/service.model.js';

export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('provider_id', 'first_name last_name email');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const newService = new Service({
      provider_id: req.user.userId,
      ...req.body,
    });
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('provider_id', 'first_name last_name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};