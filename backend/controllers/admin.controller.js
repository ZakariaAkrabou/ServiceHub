import User from "../models/user.model.js";

export const allUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateProviderStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const allowedStatuses = ["pending", "approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const provider = await User.findById(userId);
    if (!provider || provider.role !== "service_provider") {
      return res.status(404).json({ message: "Provider not found" });
    }
    provider.status = status;

    await provider.save();

    res.status(200).json({ message: `Provider status updated to ${status}` });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req,res) => {
  
  try{
    const userId = req.params.userId;

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "User deleted successfully" });

  }

  catch(error){
    return res.status(500).json({ message: "Server error" });
  }
}