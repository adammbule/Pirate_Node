import KeyReference from "../models/keyreference.js";

export const createKeyReference = async (req, res) => {
  try {
    const keyRef = await KeyReference.create(req.body);
    res.status(201).json(keyRef);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getKeyReferenceByPiratecoin = async (req, res) => {
  try {
    const keyRef = await KeyReference.findOne({ piratecoinId: req.params.piratecoinId });
    if (!keyRef) return res.status(404).json({ error: "Key reference not found" });
    res.json(keyRef);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
