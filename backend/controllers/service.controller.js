import Service from '../models/service.model.js';

export const getAllServices = async (req, res) => {
  try {
    
    const services = await Service.find({ provider_id: req.user.userId })
      .populate('provider_id', 'first_name last_name email');
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    
    let imageUrl = "";
    if (req.file && req.file.cloudinaryUrl) {
      imageUrl = req.file.cloudinaryUrl;
    }

    const newService = new Service({
      provider_id: req.user.userId,
      ...req.body,
      image: imageUrl, 
    });
    const savedService = await newService.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider_id', 'first_name last_name email');
    if (!service) return res.status(404).json({ message: 'Service not found' });

  
    if (service.provider_id._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.file && req.file.cloudinaryUrl) {
      req.body.image = req.file.cloudinaryUrl;
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedService);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await service.deleteOne();

    res.status(200).json({
      message: "Service deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};