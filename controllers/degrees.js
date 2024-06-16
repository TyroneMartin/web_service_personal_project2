const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');

// Fetch all degrees
const getAlldegrees = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('degrees').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a degree
const deleteDegree = async (req, res) => {
  try {
    const degreeId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('degrees')
      .deleteOne({ _id: degreeId });

    if (response.deletedCount > 0) {
      res.status(204).send({ message: 'Degree deleted successfully' });
    } else {
      res.status(404).json({ message: 'Degree not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  getAlldegrees,
  deleteDegree
};