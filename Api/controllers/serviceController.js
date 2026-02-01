const Service = require('../models/Service.model');
const { uploadImageToSupabase } = require('./supabaseUpload');

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Only admins can create services" });
    }

    const { name, description, price, duration, category } = req.body;
    if (!name || !description || !price || !duration || !category) {
      return res.status(400).json({
        message: "name, description, price, duration, category are required",
      });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
    } else {
      return res.status(400).json({ message: "Image file is required" });
    }

    const service = await Service.create({
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      category,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Service Created Successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Only admins can update services" });
    }

    const { name, description, price, duration, isActive, category } = req.body;
    let updateData = {
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      isActive: isActive ?? true,
      category,
    };
    if (req.file) {
      updateData.image = await uploadImageToSupabase(req.file.buffer, req.file.originalname, req.file.mimetype);
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({
      message: "Service Updated Successfully",
      service: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: "Only admins can delete services" });
    }

    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
