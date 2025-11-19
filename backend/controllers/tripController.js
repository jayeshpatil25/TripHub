const Trip = require('../models/Trip');

// Create trip with destination coordinates
const createTrip = async (req, res) => {
  const { name, destination, startDate, endDate, destinationCoordinates } = req.body;

  try {
    const trip = await Trip.create({
      name,
      destination,
      destinationCoordinates, //  save coords
      startDate,
      endDate,
      createdBy: req.userId,
      members: [req.userId],
    });

    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getUserTrips = async (req,res) => {
    try
    {
        const trips = await Trip.find({members: req.userId});
        res.json(trips);
    }
    catch(err)
    {
        res.status(500).json({ msg: err.message});
    }
};

// controllers/tripController.js
const joinTrip = async (req, res) => {
  const tripId = req.params.id;  
  const userId = req.userId;

  console.log("Join Trip Request", { tripId, userId });

  try {
    console.log("Finding trip with ID:", tripId);
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ msg: 'Trip not found' });
    }

    if (trip.members.includes(userId)) {
      return res.status(400).json({ msg: 'Already joined' });
    }

    trip.members.push(userId);
    await trip.save();

    res.status(200).json({ msg: 'Successfully joined the trip' });
  } catch (err) {
    console.error("Join Trip Error:", err);
    res.status(500).json({ msg: 'Error joining trip' });
  }
};

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
  .populate({
    path: 'members',
    select: 'name email profilePic'
  })
  .populate({
    path: 'createdBy',
    select: 'name email profilePic'
  });
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


const addTodo = async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;

  try {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const newTodo = { task, done: false };
    trip.todos.push(newTodo);
    await trip.save();

    // Send back the newly added todo
    const addedTodo = trip.todos[trip.todos.length - 1];
    res.status(201).json(addedTodo); // this must return the todo
  } catch (err) {
    console.error("Failed to add todo:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleTodo = async (req, res) => {
  const { id: tripId, todoId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const todo = trip.todos.id(todoId); // Access by subdocument ID
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.done = !todo.done;
    await trip.save();

    res.status(200).json(todo);
  } catch (err) {
    console.error('Error toggling todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
const deleteTodo = async (req, res) => {
  const { id: tripId, todoId } = req.params;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const todo = trip.todos.id(todoId);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    todo.deleteOne(); // or todo.remove() if using Mongoose <6
    await trip.save();

    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



const addBudget = async (req,res) => {
    const {description, amount} = req.body;
    const trip = await Trip.findById(req.params.id);
    trip.budget.push({description, amount});
    await trip.save();  
    res.json(trip.budget);
};

const deleteBudget = async (req,res) => {
    const trip = await Trip.findById(req.params.id);
    trip.budget = trip.budget.filter(b => b._id.toString() !== req.params.budgetId);
    await trip.save();
    res.json(trip.budget);
};

// Add itinerary item
const addItinerary = async (req, res) => {
  const {
    day,
    date,
    timeOfDay,
    exactTime,
    activity,
    location,
    accommodation,
    transportation,
    notes
  } = req.body;

  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ msg: "Trip not found" });

  trip.itinerary.push({
    day,
    date,
    timeOfDay,
    exactTime,
    activity,
    location,
    accommodation,
    transportation,
    notes
  });

  await trip.save();
  res.json(trip.itinerary);
};


const deleteItinerary = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  trip.itinerary = trip.itinerary.filter(
    (item) => item._id.toString() !== req.params.itineraryId
  );
  await trip.save();
  res.json(trip.itinerary);
};


const addComment = async (req,res) => {
    const {comment} = req.body;
    const trip = await Trip.findById(req.params.id);
    trip.comments.push({user: req.userId, comment});
    await trip.save();
    res.json(trip.comments);
};

const deleteComment = async (req,res) => {
    const trip =  await Trip.findById(req.params.id);
    trip.comments = trip.comments.filter(c => !(c._id.toString() === req.params.commentId && c.user.toString() === req.userId));
    await trip.save();
    res.json(trip.comments);
};

// GET messages for a trip
const getMessages = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('messages.sender', 'name');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip.messages || []);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST a new message to a trip
const addMessage = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const newMessage = {
      sender: userId,
      content,
      timestamp: new Date(),
    };

    trip.messages.push(newMessage);
    await trip.save();

    const populatedTrip = await Trip.findById(req.params.id).populate('messages.sender', 'name');
    const populatedMessage = populatedTrip.messages.pop(); // get last pushed message

    res.status(201).json(populatedMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new custom pin
// Add a new custom pin
// Add a new custom pin
const addSavedPin = async (req, res) => {
  const { id } = req.params;
  const { lat, lng, label } = req.body;

  try {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });

    const newPin = { 
      lat, 
      lng, 
      label,
      addedBy: req.user.id,
      addedAt: new Date()
    };

    trip.savedPins.push(newPin);
    await trip.save();

    // Return the entire pins array
    res.status(201).json(trip.savedPins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all saved pins
const getSavedPins = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });

    res.json(trip.savedPins || []);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete a pin by its ID
const deletePin = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ msg: "Trip not found" });

  trip.savedPins = trip.savedPins.filter(pin => pin._id.toString() !== req.params.pinId);
  await trip.save();
  res.json(trip.savedPins);
};
// Add a saved place to visit
const addPlaceToVisit = async (req, res) => {
  const { name, lat, lng, description } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ msg: "Trip not found" });

    const place = { name, lat, lng, description };
    trip.placesToVisit.push(place);
    await trip.save();
    res.status(201).json(trip.placesToVisit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to add place" });
  }
};

// Delete saved place
const deletePlaceToVisit = async (req, res) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return res.status(404).json({ msg: "Trip not found" });

  trip.placesToVisit = trip.placesToVisit.filter(
    (place) => place._id.toString() !== req.params.placeId
  );
  await trip.save();
  res.json(trip.placesToVisit);
};

const deleteTrip = async (req, res) => {
  const tripId = req.params.id;
  try {
    const trip = await Trip.findByIdAndDelete(tripId);
    if (!trip) return res.status(404).json({ msg: 'Trip not found' });

    res.status(200).json({ msg: 'Trip deleted successfully' });
  } catch (err) {
    console.error('Error deleting trip:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { createTrip, getUserTrips, joinTrip, addTodo, toggleTodo, deleteTodo, addBudget, deleteBudget, addItinerary, deleteItinerary, addComment,getMessages,
  addMessage, deleteComment, getTripById, getSavedPins, deletePin, addPlaceToVisit, deletePlaceToVisit ,addSavedPin, deleteTrip};