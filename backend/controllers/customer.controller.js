import Service from '../models/service.model.js';
import Booking from '../models/booking.model.js';

export const searchServices = async (req, res) => {
  try {
    const { category, location, rating } = req.query;
    const filter = {};

    if (category) filter.category = { $regex: category, $options: 'i' };
    if (location)  filter.location  = { $regex: location,  $options: 'i' };
    if (rating)    filter.rating    = { $gte: parseFloat(rating) };

    const services = await Service.find(filter).populate('provider_id', 'name email');
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const createBooking = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { service_id, booking_time } = req.body;

    const service = await Service.findById(service_id);
    if (!service)
      return res.status(404).json({ success: false, message: 'Service introuvable.' });

    if (new Date(booking_time) < new Date())
      return res.status(400).json({ success: false, message: 'La date doit être dans le futur.' });

    const conflict = await Booking.findOne({
      service_id,
      booking_time: new Date(booking_time),
      status: { $in: ['pending', 'confirmed'] },
    });
    if (conflict)
      return res.status(409).json({ success: false, message: 'Ce créneau est déjà réservé.' });

    const booking = await Booking.create({
      customer_id: userId, 
      service_id,
      booking_time: new Date(booking_time),
    });

    res.status(201).json({ success: true, message: 'Réservation créée.', data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getBookings = async (req, res) => {
  try {
    const userId = req.user.userId; 

    let bookings;

    if (req.user.role === 'customer') {
      bookings = await Booking.find({ customer_id: userId })
        .populate('service_id', 'title description price')
        .sort({ booking_time: -1 });

    } else if (req.user.role === 'provider') {
      const myServices = await Service.find({ provider_id: userId }).select('_id');
      const serviceIds = myServices.map((s) => s._id);
      bookings = await Booking.find({ service_id: { $in: serviceIds } })
        .populate('customer_id', 'name email')
        .populate('service_id', 'title price')
        .sort({ booking_time: -1 });

    } else {
      return res.status(403).json({ success: false, message: 'Accès non autorisé.' });
    }

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: `Statut invalide. Valeurs : ${validStatuses.join(', ')}` });

    const booking = await Booking.findById(id);
    if (!booking)
      return res.status(404).json({ success: false, message: 'Réservation introuvable.' });

    if (req.user.role === 'customer') {
      if (status !== 'cancelled')
        return res.status(403).json({ success: false, message: 'Un client peut uniquement annuler.' });
      if (String(booking.customer_id) !== String(userId))
        return res.status(403).json({ success: false, message: 'Accès refusé.' });
    }

    if (req.user.role === 'provider') {
      const service = await Service.findById(booking.service_id);
      if (!service || String(service.provider_id) !== String(userId))
        return res.status(403).json({ success: false, message: 'Accès refusé.' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: `Statut mis à jour : ${status}`, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};