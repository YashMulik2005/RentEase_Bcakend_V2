const Rooms = require("../model/Rooms");
const mongoose = require("mongoose");

const createRoom = async (req, res) => {
  try {
    const { room_type, price, capacity, availability_status, images } =
      req.body;

    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized, owner not found" });
    }

    const room = new Rooms({
      owner_id: req.user.id,
      room_type,
      price,
      capacity,
      availability_status,
      images,
    });

    await room.save();
    res.status(201).json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// const createRoom = async (req, res) => {
//   try {
//     const {
//       owner_id,
//       room_number,
//       room_type,
//       price,
//       capacity,
//       description,
//       availability_status,
//       images,
//       titleImage,
//       options,
//     } = req.body;

//     if (!owner_id) {
//       return res.status(400).json({ message: "Owner ID is required" });
//     }

//     // Check if the owner exists
//     const ownerExists = await mongoose.model("Owner").findById(owner_id);
//     if (!ownerExists) {
//       return res.status(404).json({ message: "Owner not found" });
//     }

//     if (!titleImage) {
//       return res.status(400).json({ message: "Title image is required" });
//     }

//     // Convert price and extraCost to Decimal128
//     const formattedPrice = mongoose.Types.Decimal128.fromString(
//       price.toString()
//     );

//     const formattedOptions =
//       options && Array.isArray(options)
//         ? options.map((opt) => ({
//             name: opt.name,
//             value: opt.value,
//             extraCost: mongoose.Types.Decimal128.fromString(
//               (opt.extraCost || "0").toString()
//             ),
//           }))
//         : [];

//     const room = new Rooms({
//       owner_id,
//       room_number,
//       room_type,
//       price: formattedPrice,
//       capacity,
//       description,
//       availability_status,
//       images,
//       titleImage,
//       options: formattedOptions,
//     });

//     await room.save();
//     res.status(201).json({ message: "Room created successfully", room });
//   } catch (err) {
//     console.error("Error creating room:", err.message);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };

const getRooms = async (req, res) => {
  try {
    const rooms = await Rooms.find({}, "price description titleImage").populate(
      "owner_id",
      "hotelName apartment city state"
    );
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getRoomsByLocation = async (req, res) => {
  try {
    const { city, state } = req.params;
    if (!city || !state) {
      return res.status(400).json({ message: "City and state are required" });
    }

    const rooms = await Rooms.find({}, "price description titleImage").populate(
      "owner_id"
    );

    const filteredRooms = rooms
      .filter(
        (room) =>
          room.owner_id &&
          room.owner_id.city.toLowerCase() === city.toLowerCase() &&
          room.owner_id.state.toLowerCase() === state.toLowerCase()
      )
      .slice(0, 5);

    res.json(filteredRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getRandomRooms = async (req, res) => {
  try {
    const rooms = await Rooms.aggregate([
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: "users",
          localField: "owner_id",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          price: 1,
          description: 1,
          titleImage: 1,
          "owner._id": 1,
          "owner.name": 1,
          "owner.email": 1,
        },
      },
    ]);

    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const searchRooms = async (req, res) => {
  try {
    const { city, state, minPrice, maxPrice } = req.query;
    const rooms = await Rooms.find({}, "price description titleImage").populate(
      "owner_id"
    );

    let filteredRooms = rooms;
    if (city) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.owner_id &&
          room.owner_id.city.toLowerCase() === city.toLowerCase()
      );
    }
    if (state) {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.owner_id &&
          room.owner_id.state.toLowerCase() === state.toLowerCase()
      );
    }
    if (minPrice || maxPrice) {
      filteredRooms = filteredRooms.filter((room) => {
        const roomPrice = parseFloat(room.price.toString());
        return (
          (!minPrice || roomPrice >= parseFloat(minPrice)) &&
          (!maxPrice || roomPrice <= parseFloat(maxPrice))
        );
      });
    }
    res.json(filteredRooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await Rooms.findById(id).populate("owner_id");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createRoom,
  getRooms,
  getRoomsByLocation,
  getRandomRooms,
  searchRooms,
  getRoomById,
};
