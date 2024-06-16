const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb');
const passwordUtil = require('../util/passwordComplexityCheck');


const getAllAccounts = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection('school-bd').find();
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSingleAccount = async (req, res, next) => {
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb
      .getDb()
      .db()
      .collection('school-bd')
      .findOne({ _id: userId });

    if (result) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'This contact is not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createAccount = async (req, res) => {
  try {
    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }

    const contact = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      password: req.body.password,
      nationality: req.body.nationality || '',
      account_type: 'student',
      semester: req.body.semester || '',
      parents: {
        mother: req.body.parents?.mother || '',
        father: req.body.parents?.father || ''
      },
      contact_numbers: {
        phone_num: req.body.contact_numbers?.phone_num || '',
        parents: {
          mother: req.body.contact_numbers?.parents?.mother || '',
          father: req.body.contact_numbers?.parents?.father || ''
        }
      },
      public_profile: {
        hobbies: req.body.public_profile?.hobbies || [],
        plans_after_graduation: req.body.public_profile?.plans_after_graduation || '',
        major: req.body.public_profile?.major || '',
        years_to_graduate: req.body.public_profile?.years_to_graduate || 0
      }
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('school-bd')
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Contact created successfully' });
    } else {
      res.status(500).json(response.error || 'Some error occurred while creating the contact.');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }

    const contact = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      password: req.body.password,
      nationality: req.body.nationality,
      account_type: 'student',
      semester: req.body.semester,
      parents: {
        mother: req.body.parents?.mother,
        father: req.body.parents?.father
      },
      contact_numbers: {
        phone_num: req.body.contact_numbers?.phone_num,
        parents: {
          mother: req.body.contact_numbers?.parents?.mother,
          father: req.body.contact_numbers?.parents?.father
        }
      },
      public_profile: {
        hobbies: req.body.public_profile?.hobbies,
        plans_after_graduation: req.body.public_profile?.plans_after_graduation,
        major: req.body.public_profile?.major,
        years_to_graduate: req.body.public_profile?.years_to_graduate
      }
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('school-bd')
      .replaceOne({ _id: userId }, contact);

    if (response.modifiedCount > 0) {
      res.status(204).json({ message: 'Contact updated successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const adminupdateAccount = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);

    const password = req.body.password;
    const passwordCheck = passwordUtil.passwordPass(password);
    if (passwordCheck.error) {
      res.status(400).send({ message: passwordCheck.error });
      return;
    }

    const contact = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      password: req.body.password,
      nationality: req.body.nationality,
      account_type: req.body.account_type || 'admin',
      contact_numbers: {
        phone_num: req.body.contact_numbers?.phone_num
      },
      public_profile: {
        hobbies: req.body.public_profile?.hobbies,
        years_of_service: req.body.public_profile?.years_of_service,
        department: req.body.public_profile?.department,
        role: req.body.public_profile?.role
      }
    };

    const response = await mongodb
      .getDb()
      .db()
      .collection('school-bd')
      .replaceOne({ _id: userId }, contact);

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Contact updated successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDb()
      .db()
      .collection('school-bd')
      .deleteOne({ _id: userId });

    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the contact.');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllAccounts,
  getSingleAccount,
  createAccount,
  updateAccount,
  adminupdateAccount,
  deleteAccount
};