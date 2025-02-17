const Rooms = require("../model/Rooms");

// const createRoom = async (req, res) => {
//   try {
//     const { room_type, price, capacity, availability_status, images } =
//       req.body;

//     if (!req.user || !req.user.id) {
//       return res
//         .status(401)
//         .json({ message: "Not authorized, owner not found" });
//     }

//     const room = new Rooms({
//       owner_id: req.user.id,
//       room_type,
//       price,
//       capacity,
//       availability_status,
//       images,
//     });

//     await room.save();
//     res.status(201).json(room);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server error");
//   }
// };

const createRoom = async (req, res) => {
  try {
    const {
      owner_id,
      room_number,
      room_type,
      price,
      capacity,
      description,
      availability_status,
      images,
      titleImage,
      options,
    } = req.body;

    if (!owner_id) {
      return res.status(400).json({ message: "Owner ID is required" });
    }

    if (!titleImage) {
      return res.status(400).json({ message: "Title image is required" });
    }

    // Convert price and extraCost to Decimal128
    const formattedPrice = mongoose.Types.Decimal128.fromString(
      price.toString()
    );

    const formattedOptions =
      options && Array.isArray(options)
        ? options.map((opt) => ({
            name: opt.name,
            value: opt.value,
            extraCost: mongoose.Types.Decimal128.fromString(
              (opt.extraCost || "0").toString()
            ),
          }))
        : [];

    const room = new Rooms({
      owner_id,
      room_number,
      room_type,
      price: formattedPrice,
      capacity,
      description,
      availability_status,
      images,
      titleImage,
      options: formattedOptions,
    });

    await room.save();
    res.status(201).json({ message: "Room created successfully", room });
  } catch (err) {
    console.error("Error creating room:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = createRoom;

const getRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find().populate("owner_id", "name email");
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = { createRoom, getRooms };
